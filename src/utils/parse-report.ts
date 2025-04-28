import fs from 'fs';
import path from 'path';

/**
 * Parses Playwright JSON report and publishes metrics to GitHub Actions Summary.
 */
async function main() {
  const reportPath = path.resolve('reports/json-reports/report.json');

  if (!fs.existsSync(reportPath)) {
    console.error(`❌ Error: JSON report not found at ${reportPath}`);
    process.exit(1);
  }

  let reportJson;
  try {
    const reportContent = await fs.promises.readFile(reportPath, 'utf-8');
    reportJson = JSON.parse(reportContent);
  } catch (error) {
    console.error('❌ Failed to read or parse the JSON report:', error);
    process.exit(1);
  }

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

  const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : '0.00';

  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) {
    console.error('❌ Error: GITHUB_STEP_SUMMARY environment variable not found.');
    process.exit(1);
  }

  const summaryContent = `
## 📈 Dynamic Test Metrics Summary

- **Total Tests**: ${totalTests}
- **Passed**: ${passedTests}
- **Failed**: ${failedTests}
- **Flaky**: ${flakyTests}
- **Pass Rate**: ${passRate}%
- **Total Duration**: ${(totalDurationMs / 1000).toFixed(2)} seconds

✅ Test results parsed and published dynamically.
`.trim();

  try {
    await fs.promises.appendFile(summaryPath, summaryContent + '\n');
    console.log('✅ Dynamic Test Metrics successfully published to GitHub Actions Summary.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to write summary to GitHub Actions:', error);
    process.exit(1);
  }
}

main();
