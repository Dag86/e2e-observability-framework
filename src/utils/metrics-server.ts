import express from 'express';
import { Registry, collectDefaultMetrics } from 'prom-client';
import fs from 'fs';
import path from 'path';

import {
  tagGauge,
  durationHistogram,
  walkSuites
} from '../utils/metrics-utils';

// Prometheus Registry
const register = new Registry();
collectDefaultMetrics({ register });

register.registerMetric(tagGauge);
register.registerMetric(durationHistogram);

// Silent metric loader
function loadTestMetrics(debug = false) {
  const reportPath = path.resolve('reports/json-reports/report.json');
  if (!fs.existsSync(reportPath)) {
    if (debug) console.warn('❌ report.json not found');
    return;
  }

  const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
  walkSuites(report.suites || []);

  if (debug) {
    console.log('✅ Metrics reloaded from report.json');
  }
}

// Express app
const app = express();

app.get('/metrics', async (_req, res) => {
  loadTestMetrics(); // refresh on each scrape
  res.setHeader('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const PORT = 9100;
app.listen(PORT, () => {
  console.log(`🚀 Prometheus metrics server running at http://localhost:${PORT}/metrics`);
});
