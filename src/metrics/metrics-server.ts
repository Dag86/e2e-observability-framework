import express from 'express';
import { Registry, Gauge, collectDefaultMetrics } from 'prom-client';
import fs from 'fs';
import path from 'path';

// Prometheus Registry
const register = new Registry();
collectDefaultMetrics({ register });

// Define metrics
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

// Register them
register.registerMetric(totalTestsGauge);
register.registerMetric(passedTestsGauge);
register.registerMetric(failedTestsGauge);

// Metrics loader with silent CLI
function loadTestMetrics(debug = false) {
  const reportPath = path.resolve('reports/json-reports/report.json');

  if (!fs.existsSync(reportPath)) {
    if (debug) console.error('❌ report.json not found');
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
            const hasPassed = test.results?.some((r: any) => r.status === 'passed');
            const hasFailed = test.results?.some((r: any) => r.status === 'failed');
            if (hasFailed) failed++;
            else if (hasPassed) passed++;
          }
        }
      }
      if (suite.suites) countTests(suite.suites);
    }
  }

  if (json.suites) countTests(json.suites);

  totalTestsGauge.set(total);
  passedTestsGauge.set(passed);
  failedTestsGauge.set(failed);

  if (debug) {
    console.log(`✅ Metrics: total=${total}, passed=${passed}, failed=${failed}`);
  }
}

// Express app
const app = express();

app.get('/metrics', async (_req, res) => {
  loadTestMetrics(); // silent by default
  res.setHeader('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const PORT = 9100;
app.listen(PORT, () => {
  console.log(`🚀 Metrics server: http://localhost:${PORT}/metrics`);
});
