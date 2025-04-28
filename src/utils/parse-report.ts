import fs from 'fs';
import path from 'path';

/**
 * Parses the Playwright JSON report and publishes dynamic metrics into GitHub Actions Summary.
 * Usage: `npx tsx src/utils/parse-report.ts`
 */
async function main() {
  const reportPath = path.resolve('reports/json-reports/report.json');

  if (!fs.existsSync(reportPath)) {
    console.error(`❌ Error: JSON report not found at ${reportPath}`);
    process.exit(1);
  }

  const reportContent = fs.readFileSync(reportPath, 'utf-8');
  const reportJson = JSON.parse(reportContent);

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  let flakyTests = 0;
  let totalDurationMs = 0;

  for (const topLevelSuite of reportJson.suites || []) {
    for (const nestedSuite of topLevelSuite.suites || []) {
      for (const spec of nestedSuite.specs || []) {
        totalTests++;
        const firstResult = spec.tests?.[0]?.results?.[0];

        if (!firstResult) continue;

        if (firstResult.status === 'passed') passedTests++;
        else if (firstResult.status === 'failed') failedTests++;
        else if (firstResult.status === 'flaky') flakyTests++;

        totalDurationMs += firstResult.duration || 0;
      }
    }
  }

  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) {
    console.error('❌ Error: GITHUB_STEP_SUMMARY environment variable not found.');
    process.exit(1);
  }

  const summary = `
## 📈 Dynamic Test Metrics Summary

- **Total Tests**: ${totalTests}
- **Passed**: ${passedTests}
- **Failed**: ${failedTests}
- **Flaky**: ${flakyTests}
- **Total Duration**: ${(totalDurationMs / 1000).toFixed(2)} seconds

✅ Test results parsed and published dynamically.
  `.trim();

  fs.appendFileSync(summaryPath, summary + '\n');
  console.log('✅ Dynamic Test Metrics successfully published to GitHub Actions Summary.');
}

main().catch((error) => {
  console.error('❌ Unexpected error occurred while parsing test report:', error);
  process.exit(1);
});
