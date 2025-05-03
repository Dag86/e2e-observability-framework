import express from 'express';
import { Registry, collectDefaultMetrics, Gauge } from 'prom-client';
import fs from 'fs';
import path from 'path';

import {
  tagGauge,
  durationHistogram,
  walkSuites,
  tagStats,
} from '../utils/metrics-utils';

// Prometheus Registry
const register = new Registry();
collectDefaultMetrics({ register });

// === Global Test Stats Gauges ===
const totalGauge = new Gauge({
  name: 'playwright_total_tests',
  help: 'Total number of Playwright tests executed',
});
const passedGauge = new Gauge({
  name: 'playwright_passed_tests',
  help: 'Number of passed Playwright tests',
});
const failedGauge = new Gauge({
  name: 'playwright_failed_tests',
  help: 'Number of failed Playwright tests',
});

register.registerMetric(tagGauge);
register.registerMetric(durationHistogram);
register.registerMetric(totalGauge);
register.registerMetric(passedGauge);
register.registerMetric(failedGauge);

// === Safe Metrics Loader ===
function loadTestMetrics(debug = false) {
  const reportPath = path.resolve('reports/json-reports/report.json');
  if (!fs.existsSync(reportPath)) {
    if (debug) console.warn('❌ report.json not found');
    return;
  }

  // Reset all gauges and histograms
  tagGauge.reset();
  durationHistogram.reset();
  totalGauge.reset();
  passedGauge.reset();
  failedGauge.reset();
  Object.keys(tagStats).forEach((key) => delete tagStats[key]);

  const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
  walkSuites(report.suites || []);

  let total = 0;
  let passed = 0;
  let failed = 0;

  for (const [tag, stats] of Object.entries(tagStats)) {
    total += stats.total;
    passed += stats.passed;
    failed += stats.failed;

    tagGauge.labels(tag, 'passed').set(stats.passed);
    tagGauge.labels(tag, 'failed').set(stats.failed);
    tagGauge.labels(tag, 'total').set(stats.total);
  }

  totalGauge.set(total);
  passedGauge.set(passed);
  failedGauge.set(failed);

  if (debug) {
    console.log(`✅ Metrics reloaded: total=${total}, passed=${passed}, failed=${failed}`);
  }
}

// === Express Metrics Endpoint ===
const app = express();

app.get('/metrics', async (_req, res) => {
  loadTestMetrics(); // fresh scrape each time
  res.setHeader('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const PORT = 9100;
app.listen(PORT, () => {
  console.log(`🚀 Prometheus metrics server running at http://localhost:${PORT}/metrics`);
});
