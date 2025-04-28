import fs from 'fs';
import path from 'path';

/**
 * Parses the Playwright JSON report and publishes dynamic metrics into GitHub Actions summary.
 * Usage: `npx tsx src/utils/parse-report.ts`
 */
async function main() {
  const reportPath = path.resolve('reports/json-reports/report.json');

  if (!fs.existsSync(reportPath)) {
    console.error('❌ Error: JSON report not found at', reportPath);
    process.exit(1);
  }

  const reportContent = fs.readFileSync(reportPath, 'utf-8');
  const reportJson = JSON.parse(reportContent);

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  let flakyTests = 0;
  let totalDurationMs = 0;

  const suites = reportJson.suites || [];

  for (const topLevelSuite of suites) {
    for (const nestedSuite of topLevelSuite.suites || []) {
      for (const spec of nestedSuite.specs || []) {
        totalTests++;
        const result = spec.tests?.[0]?.results?.[0];

        if (result?.status === 'passed') passedTests++;
        else if (result?.status === 'failed') failedTests++;
        else if (result?.status === 'flaky') flakyTests++;

        if (result?.duration) {
          totalDurationMs += result.duration;
        }
      }
    }
  }

  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) {
    console.error('❌ Error: GITHUB_STEP_SUMMARY not set.');
    process.exit(1);
  }

  const summaryContent = `
## 📈 Dynamic Test Metrics Summary

- **Total Tests**: ${totalTests}
- **Passed**: ${passedTests}
- **Failed**: ${failedTests}
- **Flaky**: ${flakyTests}
- **Total Duration**: ${(totalDurationMs / 1000).toFixed(2)} seconds
`;

  fs.appendFileSync(summaryPath, summaryContent.trim());
  console.log('✅ Published dynamic test summary to GitHub Actions summary.');
}

main().catch((error) => {
  console.error('❌ Parser failed with error:', error);
  process.exit(1);
});
