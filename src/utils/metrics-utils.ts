// 📁 src/utils/metrics-utils.ts
import { Gauge, Histogram } from 'prom-client';

export interface TagMetrics {
  total: number;
  passed: number;
  failed: number;
}

export const tagStats: Record<string, TagMetrics> = {};

export const tagGauge = new Gauge({
  name: 'playwright_tag_test_count',
  help: 'Number of tests by tag and status',
  labelNames: ['tag', 'status'],
});

export const durationHistogram = new Histogram({
  name: 'playwright_test_duration_seconds',
  help: 'Test duration histogram by tag and status',
  labelNames: ['tag', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});

const tagPattern = /@[a-zA-Z0-9_-]+/g;
export function extractTags(input: string): string[] {
  const matches = input?.match(tagPattern) || [];
  return [...new Set(matches)];
}

export function walkSuites(
  suites: any[],
  inheritedTags: string[] = []
): void {
  for (const suite of suites) {
    const suiteTags = extractTags(suite.title);
    const combinedTags = [...new Set([...inheritedTags, ...suiteTags])];

    for (const spec of suite.specs || []) {
      const specTags = extractTags(spec.title);
      const tags = [...new Set([...combinedTags, ...specTags])];

      for (const test of spec.tests || []) {
        for (const result of test.results || []) {
          const status = result.status;
          const duration = (result.duration ?? 0) / 1000;

          for (const tag of tags) {
            tagStats[tag] ??= { total: 0, passed: 0, failed: 0 };
            tagStats[tag].total++;
            if (status === 'passed') tagStats[tag].passed++;
            if (status === 'failed') tagStats[tag].failed++;

            tagGauge.labels(tag, status).inc();
            durationHistogram.labels(tag, status).observe(duration);
          }
        }
      }
    }

    if (suite.suites) walkSuites(suite.suites, combinedTags);
  }
}
