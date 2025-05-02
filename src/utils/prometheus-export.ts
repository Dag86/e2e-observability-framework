import fs from 'fs';
import path from 'path';
import { Registry } from 'prom-client';

import {
  tagStats,
  tagGauge,
  durationHistogram,
  walkSuites
} from '../utils/metrics-utils';

// Setup
const register = new Registry();
register.registerMetric(tagGauge);
register.registerMetric(durationHistogram);

const reportPath = path.resolve('reports/json-reports/report.json');
if (!fs.existsSync(reportPath)) {
  console.error('❌ Report file not found.');
  process.exit(1);
}
const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

walkSuites(report.suites || []);

// Summary stats
const stats = report.stats || {};
const totalTests = stats.expected ?? 0;
const failedTests = stats.unexpected ?? 0;
const flakyTests = stats.flaky ?? 0;
const passedTests = totalTests - failedTests;
const duration = stats.duration ? (stats.duration / 1000).toFixed(2) : '0.00';
const overallPassRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
const minimumPassRate = 95;

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

// GitHub summary
const summaryFile = process.env.GITHUB_STEP_SUMMARY;
if (summaryFile) {
  const passIcon = overallPassRate >= minimumPassRate ? '✅' : '❌';

  let summary = `## 📈 Dynamic Test Metrics Summary ${passIcon}\n\n`;
  summary += `| Metric         | Value |\n`;
  summary += `|----------------|-------|\n`;
  summary += `| Total Tests    | ${totalTests} |\n`;
  summary += `| Passed         | ${passedTests} |\n`;
  summary += `| Failed         | ${failedTests} |\n`;
  summary += `| Flaky          | ${flakyTests} |\n`;
  summary += `| Pass Rate      | ${overallPassRate.toFixed(2)}% ${passIcon} |\n`;
  summary += `| Duration       | ${duration} sec |\n`;

  const sortedTags = Object.keys(tagStats).sort();
  if (sortedTags.length > 0) {
    summary += `\n### 🏷️ Test Breakdown by Tag\n\n`;
    summary += `| Tag | Total | Passed | Failed | Pass Rate |\n`;
    summary += `|-----|-------|--------|--------|-----------|\n`;

    for (const tag of sortedTags) {
      const t = tagStats[tag];
      const tagRate = t.total > 0 ? (t.passed / t.total) * 100 : 0;
      const icon = tagRate >= minimumPassRate ? '✅' : '❌';
      summary += `| ${tag} | ${t.total} | ${t.passed} | ${t.failed} | ${tagRate.toFixed(2)}% ${icon} |\n`;
    }
  }

  fs.appendFileSync(summaryFile, summary);
}

// Threshold gate
if (overallPassRate < minimumPassRate) {
  console.error(`❌ Build failed: Overall pass rate ${overallPassRate.toFixed(2)}% < ${minimumPassRate}%`);
  process.exit(1);
} else {
  console.log(`✅ Build passed: Overall pass rate ${overallPassRate.toFixed(2)}%`);
}
