import express from 'express';
import { Registry, Gauge, collectDefaultMetrics } from 'prom-client';
import fs from 'fs';
import path from 'path';

// Create a Prometheus Registry
const register = new Registry();
collectDefaultMetrics({ register }); // optional: system metrics like memory usage

// Custom metrics
const totalTestsGauge = new Gauge({
  name: 'playwright_total_tests',
  help: 'Total number of Playwright tests executed',
});

const passedTestsGauge = new Gauge({
  name: 'playwright_passed_tests',
  help: 'Number of passed Playwright tests',
});

const failedTestsGauge = new Gauge({
  name: 'playwright_failed_tests',
  help: 'Number of failed Playwright tests',
});

// Register custom gauges
register.registerMetric(totalTestsGauge);
register.registerMetric(passedTestsGauge);
register.registerMetric(failedTestsGauge);

// Function to read latest Playwright report
function loadTestMetrics() {
  const reportPath = path.resolve('reports/json-reports/report.json');

  if (!fs.existsSync(reportPath)) {
    console.error('❌ Playwright report not found. No metrics updated.');
    return;
  }

  const content = fs.readFileSync(reportPath, 'utf-8');
  const json = JSON.parse(content);

  let total = 0;
  let passed = 0;
  let failed = 0;

  function countTests(suites: any[]) {
    for (const suite of suites) {
      if (suite.specs) {
        for (const spec of suite.specs) {
          for (const test of spec.tests || []) {
            total++;
            const hasPassed = test.results?.some((result: any) => result.status === 'passed');
            const hasFailed = test.results?.some((result: any) => result.status === 'failed');

            if (hasFailed) failed++;
            else if (hasPassed) passed++;
          }
        }
      }
      if (suite.suites) {
        countTests(suite.suites); // recurse deeper if nested suites exist
      }
    }
  }

  if (json.suites) {
    countTests(json.suites);
  }

  // Update gauges
  totalTestsGauge.set(total);
  passedTestsGauge.set(passed);
  failedTestsGauge.set(failed);

  console.log(`🔍 Metrics loaded: total=${total}, passed=${passed}, failed=${failed}`);
}


// Create the Express app
const app = express();

// Scrape endpoint for Prometheus
app.get('/metrics', async (_req, res) => {
  loadTestMetrics(); // Refresh metrics from latest file
  res.setHeader('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Start server
const PORT = 9100; // Common Prometheus scrape port
app.listen(PORT, () => {
  console.log(`🚀 Metrics server running at http://localhost:${PORT}/metrics`);
});
