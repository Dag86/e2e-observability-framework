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

// --- Clean Tag Parsing ---
interface TagMetrics {
  total: number;
  passed: number;
  failed: number;
}

const tagStats: Record<string, TagMetrics> = {};
const validTagRegex = /^@[a-zA-Z0-9_-]+$/;

function traverseSuites(suites: any[]) {
  for (const suite of suites) {
    if (suite.specs) {
      for (const spec of suite.specs) {
        const tags = spec.tags || [];
        const tests = spec.tests || [];

        for (const tag of tags) {
          if (!validTagRegex.test(tag)) {
            continue; // Skip invalid tags like weird special characters
          }

          if (!tagStats[tag]) {
            tagStats[tag] = { total: 0, passed: 0, failed: 0 };
          }

          for (const test of tests) {
            tagStats[tag].total++;

            for (const result of test.results || []) {
              if (result.status === 'passed') {
                tagStats[tag].passed++;
              }
              if (result.status === 'failed') {
                tagStats[tag].failed++;
              }
            }
          }
        }
      }
    }

    if (suite.suites) {
      traverseSuites(suite.suites);
    }
  }
}

traverseSuites(report.suites || []);

// --- Write to GITHUB_STEP_SUMMARY ---
const summaryFile = process.env.GITHUB_STEP_SUMMARY;
if (summaryFile) {
  let summary = `
## 📈 Dynamic Test Metrics Summary
- Total Tests: ${totalTests}
- Passed: ${passedTests}
- Failed: ${failedTests}
- Flaky: ${flakyTests}
- Pass Rate: ${passRate}%
- Total Duration: ${duration} seconds
  `;

  if (Object.keys(tagStats).length > 0) {
    summary += `\n## 🏷️ Test Tag Breakdown\n`;
    for (const [tag, stats] of Object.entries(tagStats)) {
      summary += `
🔖 **${tag}**
- Total: ${stats.total}
- Passed: ${stats.passed}
- Failed: ${stats.failed}
`;
    }
  }

  fs.appendFileSync(summaryFile, summary);
}

// --- Always log to console ---
console.log('📈 Dynamic Test Metrics Summary');
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);
console.log(`Flaky: ${flakyTests}`);
console.log(`Pass Rate: ${passRate}%`);
console.log(`Total Duration: ${duration} seconds`);
console.log('✅ Test results parsed and published dynamically.');


if (Object.keys(tagStats).length > 0) {
  console.log('🏷️ Tag Metrics Breakdown:');
  for (const [tag, stats] of Object.entries(tagStats)) {
    console.log(`- ${tag}: Total ${stats.total}, Passed ${stats.passed}, Failed ${stats.failed}`);
  }
}
