import fs from 'fs';
import path from 'path';

const reportPath = path.resolve('reports/json-reports/report.json');

if (!fs.existsSync(reportPath)) {
  console.error('❌ Report file not found.');
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

const stats = report.stats || {};

const totalTests = stats.expected ?? 0;
const failedTests = stats.unexpected ?? 0;
const flakyTests = stats.flaky ?? 0;
const passedTests = totalTests - failedTests;
const duration = stats.duration ? (stats.duration / 1000).toFixed(2) : '0.00';
const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : '0.00';

// Write to GITHUB_STEP_SUMMARY
const summaryFile = process.env.GITHUB_STEP_SUMMARY;
if (summaryFile) {
  const summary = `
## 📈 Dynamic Test Metrics Summary
- Total Tests: ${totalTests}
- Passed: ${passedTests}
- Failed: ${failedTests}
- Flaky: ${flakyTests}
- Pass Rate: ${passRate}%
- Total Duration: ${duration} seconds
  `;
  fs.appendFileSync(summaryFile, summary);
}

// Always still log to console
console.log('📈 Dynamic Test Metrics Summary');
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);
console.log(`Flaky: ${flakyTests}`);
console.log(`Pass Rate: ${passRate}%`);
console.log(`Total Duration: ${duration} seconds`);
console.log('✅ Test results parsed and published dynamically.');
console.log('📊 Report file path:', reportPath);