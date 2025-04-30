import { test as base, expect } from '@playwright/test';

const describeTagStack: string[][] = [];

function extractTags(str: string): string[] {
  return str.match(/@[a-zA-Z0-9_-]+/g) || [];
}

// ✅ Create a full wrapper on top of base test
const test = base.extend<{}>({});

// ✅ Fully override describe before it's used
const originalDescribe = test.describe;

test.describe = function (title: string, fn: () => void) {
  const tags = extractTags(title);
  describeTagStack.push(tags);

  originalDescribe(title, () => {
    try {
      fn();
    } finally {
      describeTagStack.pop();
    }
  });
} as typeof test.describe;

// 🔁 Preserve other describe variants
test.describe.only = originalDescribe.only.bind(originalDescribe);
test.describe.skip = originalDescribe.skip.bind(originalDescribe);
test.describe.fixme = originalDescribe.fixme.bind(originalDescribe);
test.describe.configure = originalDescribe.configure.bind(originalDescribe);

// ✅ Inject tags via annotation before each test
test.beforeEach(async ({}, testInfo) => {
  const titleTags = extractTags(testInfo.title);
  const inheritedTags = describeTagStack.at(-1) || [];
  const allTags = [...new Set([...titleTags, ...inheritedTags])];

  for (const tag of allTags) {
    testInfo.annotations.push({ type: 'tag', description: tag });
  }
});

// 👣 Optional test.step wrapper
async function step(description: string, action: () => Promise<void>) {
  await test.step(description, action);
}

export { test, expect, step };
