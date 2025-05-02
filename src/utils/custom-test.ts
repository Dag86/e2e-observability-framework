import { test as base, expect } from '@playwright/test';

let suiteTags: string[] = [];

function extractTags(str: string): string[] {
  return str.match(/@[a-zA-Z0-9_-]+/g) || [];
}

const test = base.extend<{}>({});

const originalDescribe = test.describe;

// ✅ Override only for suite tag extraction
test.describe = function (title: string, fn: () => void) {
  suiteTags = extractTags(title); // store once per file
  originalDescribe(title, fn);
} as typeof test.describe;

// 🔁 Preserve original describe variants
test.describe.only = originalDescribe.only.bind(originalDescribe);
test.describe.skip = originalDescribe.skip.bind(originalDescribe);
test.describe.fixme = originalDescribe.fixme.bind(originalDescribe);
test.describe.configure = originalDescribe.configure.bind(originalDescribe);

// ✅ Inject both suite-level and test-level tags before each test
test.beforeEach(async ({}, testInfo) => {
  const titleTags = extractTags(testInfo.title);
  const allTags = [...new Set([...suiteTags, ...titleTags])];

  for (const tag of allTags) {
    testInfo.annotations.push({ type: 'tag', description: tag });
  }
});

// 👣 Optional wrapper for labeled steps
async function step(description: string, action: () => Promise<void>) {
  await test.step(description, action);
}

export { test, expect, step };
