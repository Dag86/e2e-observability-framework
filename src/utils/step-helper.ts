import { test } from '@playwright/test';

/**
 * Utility to wrap Playwright actions in named steps.
 * @param description Step description shown in reports
 * @param action Async function to execute inside the step
 */
export async function step(description: string, action: () => Promise<void>) {
  await test.step(description, action);
}
