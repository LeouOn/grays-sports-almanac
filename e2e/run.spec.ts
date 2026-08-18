import { test, expect } from '@playwright/test';

// Requires the dev stack running with RUN_LLM_STUB=1 on the backend
// (deterministic template beats, no provider keys needed).
test('run happy path: start → choices → retire or finish', async ({ page }) => {
  await page.goto('/run');
  await expect(page.getByText(/choose your destination/i)).toBeVisible();

  await page.getByRole('button', { name: '1980s' }).click();
  await page.getByRole('button', { name: /jump/i }).click();

  // Play until summary appears (max 12 interactions)
  for (let i = 0; i < 12; i++) {
    if (await page.getByRole('button', { name: /run it back/i }).isVisible().catch(() => false)) break;
    const retireBtn = page.getByRole('button', { name: /retire now/i });
    if (await retireBtn.isVisible().catch(() => false)) {
      await retireBtn.click();
      break;
    }
    // Scope gameplay clicks to <main>: header nav buttons live outside main,
    // so without this the first button would be a header link.
    await page.locator('main button').first().click();
    await page.waitForTimeout(300);
  }

  await expect(page.getByText(/run complete|temporal exile/i)).toBeVisible({ timeout: 10000 });
});
