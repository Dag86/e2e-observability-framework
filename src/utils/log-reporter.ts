import fs from 'fs';
import path from 'path';
import type {
  Reporter,
  TestCase,
  TestResult,
  FullResult
} from '@playwright/test/reporter';

const logFilePath = path.resolve('reports/logs/playwright.jsonl');

function ensureLogDir() {
  const dir = path.dirname(logFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeJsonLine(data: Record<string, any>) {
  ensureLogDir();
  const logEntry = JSON.stringify({
    timestamp: new Date().toISOString(),
    ...data
  });
  fs.appendFileSync(logFilePath, logEntry + '\n');
}

class LogReporter implements Reporter {
  onTestBegin(test: TestCase) {
    // Optional log on test start
  }

  onTestEnd(test: TestCase, result: TestResult) {
    console.log('🔎 Annotations for test:', test.title);
    console.log(result.annotations);

    // Double-check tag annotations are applied correctly
    const tags = Array.isArray(result.annotations)
      ? result.annotations.filter(a => a.type === 'tag' && a.description).map(a => a.description)
      : [];

    writeJsonLine({
      event: 'test_end',
      title: test.title,
      tags,
      status: result.status.toUpperCase(),
      duration: result.duration ?? 0,
      project: test.parent.project()?.name || 'unknown',
      error: result.error?.message || undefined
    });
  }

  onEnd(_result: FullResult) {
    writeJsonLine({ event: 'test_run_complete' });
  }
}

export default LogReporter;
