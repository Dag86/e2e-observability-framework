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

console.log('📈 Dynamic Test Metrics Summary');
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);
console.log(`Flaky: ${flakyTests}`);
console.log(`Pass Rate: ${totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : '0.00'}%`);
console.log(`Total Duration: ${(stats.duration ? stats.duration / 1000 : 0).toFixed(2)} seconds`);
console.log('✅ Test results parsed and published dynamically.');
