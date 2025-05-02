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
  onTestEnd(test: TestCase, result: TestResult) {
    const tags = Array.isArray(result.annotations)
      ? result.annotations.filter(a => a.type === 'tag' && a.description).map(a => a.description)
      : [];

    const suite = test.parent.title || 'unspecified';
    const projectName =
    (test.parent as any)?.project?.().name || 'default';


    writeJsonLine({
      event: 'test_end',
      suite,
      title: test.title,
      tags,
      status: result.status.toUpperCase(),
      duration: result.duration ?? 0,
      project: projectName,
      error: result.error?.message || undefined
    });
  }

  onEnd(_result: FullResult) {
    writeJsonLine({ event: 'test_run_complete' });
  }
}

export default LogReporter;
