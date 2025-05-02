import fs from 'fs';
import path from 'path';
import { Gauge, Histogram, Registry } from 'prom-client';


const register = new Registry();

// === Playwright Report Loading ===
const reportPath = path.resolve('reports/json-reports/report.json');
if (!fs.existsSync(reportPath)) {
  console.error('❌ Report file not found.');
  process.exit(1);
}
const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

// === Base Stats Extraction ===
const stats = report.stats || {};
const totalTests = stats.expected ?? 0;
const failedTests = stats.unexpected ?? 0;
const flakyTests = stats.flaky ?? 0;
const passedTests = totalTests - failedTests;
const duration = stats.duration ? (stats.duration / 1000).toFixed(2) : '0.00';
const overallPassRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
const minimumPassRate = 95;

// === Tag Parsing ===
interface TagMetrics {
  total: number;
  passed: number;
  failed: number;
}
const tagStats: Record<string, TagMetrics> = {};
const validTagRegex = /^@[a-zA-Z0-9_-]+$/;
function extractValidTagsFromTitle(title: string): string[] {
  const matches = title?.match(/@[a-zA-Z0-9_-]+/g) || [];
  return [...new Set(matches.filter(tag => validTagRegex.test(tag)))];
}

// === Prometheus Metric Definitions ===
const tagGauge = new Gauge({
  name: 'playwright_tag_test_count',
  help: 'Number of tests by tag and status',
  labelNames: ['tag', 'status'],
});
const testDurationHistogram = new Histogram({
  name: 'playwright_test_duration_seconds',
  help: 'Duration of Playwright tests by tag',
  labelNames: ['tag', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});

register.registerMetric(tagGauge);
register.registerMetric(testDurationHistogram);

// === Recursive Suite Walk ===
function walkSuites(suites: any[], inheritedTags: string[] = []) {
  for (const suite of suites) {
    const suiteTags = extractValidTagsFromTitle(suite.title);
    const combinedTags = [...new Set([...inheritedTags, ...suiteTags])];

    for (const spec of suite.specs || []) {
      const specTags = extractValidTagsFromTitle(spec.title);
      const tags = [...new Set([...combinedTags, ...specTags])];

      for (const test of spec.tests || []) {
        for (const result of test.results || []) {
          const status = result.status;
          const durationSec = (result.duration ?? 0) / 1000;

          for (const tag of tags) {
            if (!tagStats[tag]) tagStats[tag] = { total: 0, passed: 0, failed: 0 };
            tagStats[tag].total++;
            if (status === 'passed') tagStats[tag].passed++;
            else if (status === 'failed') tagStats[tag].failed++;

            tagGauge.labels(tag, status).inc();
            testDurationHistogram.labels(tag, status).observe(durationSec);
          }
        }
      }
    }

    if (suite.suites) walkSuites(suite.suites, combinedTags);
  }
}

// === Run Metrics Loading ===
walkSuites(report.suites || []);
console.log('✅ Metrics collected.');

// === Optional CLI Summary Output ===
console.log('\n📈 Dynamic Test Metrics Summary');
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);
console.log(`Flaky: ${flakyTests}`);
console.log(`Pass Rate: ${overallPassRate.toFixed(2)}%`);
console.log(`Total Duration: ${duration} seconds`);

for (const tag of Object.keys(tagStats).sort()) {
  const t = tagStats[tag];
  const tagRate = t.total > 0 ? (t.passed / t.total) * 100 : 0;
  console.log(`- ${tag}: Total ${t.total}, Passed ${t.passed}, Failed ${t.failed}, Pass Rate ${tagRate.toFixed(2)}%`);
}

if (overallPassRate < minimumPassRate) {
  console.error(`❌ Build failed: Overall pass rate ${overallPassRate.toFixed(2)}% < ${minimumPassRate}%`);
  process.exit(1);
} else {
  console.log(`✅ Build passed: Overall pass rate ${overallPassRate.toFixed(2)}%`);
}
module.exports = { register };