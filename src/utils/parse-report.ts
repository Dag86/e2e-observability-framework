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

  for (const suite of reportJson.suites || []) {
    for (const spec of suite.specs || []) {
      totalTests++;
      const status = spec.tests?.[0]?.results?.[0]?.status;
      const duration = spec.tests?.[0]?.results?.[0]?.duration || 0;

      if (status === 'passed') passedTests++;
      else if (status === 'failed') failedTests++;
      else if (status === 'flaky') flakyTests++;

      totalDurationMs += duration;
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
