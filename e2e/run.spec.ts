import { test, expect } from '@playwright/test';

// Requires the dev stack running with RUN_LLM_STUB=1 on the backend
// (deterministic template beats, no provider keys needed).
test('run happy path: start → choices → retire or finish', async ({ page }) => {
  await page.goto('/run');
  await expect(page.getByText(/choose your destination/i)).toBeVisible();

  await page.getByRole('button', { name: '1980s', exact: true }).click();
  await page.getByRole('button', { name: /jump/i }).click();

  // Play until summary appears (each beat takes 1-2 interactions: answer +
  // Continue for knowledge checks, one click for scenario choices).
  for (let i = 0; i < 14; i++) {
    if (await page.getByRole('button', { name: /run it back/i }).isVisible().catch(() => false)) break;
    const retireBtn = page.getByRole('button', { name: /retire now/i });
    if (await retireBtn.isVisible().catch(() => false)) {
      await retireBtn.click();
      break;
    }
    const continueBtn = page.getByRole('button', { name: /continue/i });
    if (await continueBtn.isVisible().catch(() => false)) {
      await continueBtn.click();
      await page.waitForTimeout(300);
      continue;
    }
    // Scope gameplay clicks to <main>: header nav buttons live outside main.
    // Skip disabled buttons (locked knowledge-check options).
    await page.locator('main button:not([disabled])').first().click();
    await page.waitForTimeout(300);
  }

  await expect(page.getByText(/run complete|temporal exile/i)).toBeVisible({ timeout: 10000 });
});
