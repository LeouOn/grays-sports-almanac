import { test, expect } from './fixtures';

test.describe('Critical Path Smoke Tests', () => {
  // 1. Navigation — click through dashboard cards
  test('navigation: all module pages load from dashboard', async ({ page }) => {
    await page.goto('/');

    // Verify dashboard heading is visible
    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();

    // Click each dashboard card link and verify the page loads
    const routes = [
      { link: 'View Almanac', heading: /sports/i },
      { link: 'View Almanac', heading: /financial/i },
      { link: 'View Guide', heading: /era/i },
      { link: 'View Protocols', heading: /disaster/i },
      { link: 'Take the Quiz', heading: /quiz/i },
      { link: 'View Targets', heading: /tech/i },
      { link: 'View Interventions', heading: /medical/i },
      { link: 'Calculate Risk', heading: /butterfly/i },
      { link: 'View Protocols', heading: /safety/i },
      { link: 'View Strategy Map', heading: /temporal/i },
      { link: 'View Blueprints', heading: /bootstrap/i },
    ];

    for (const { link, heading } of routes) {
      await page.goto('/');
      await page.getByRole('link', { name: link }).first().click();
      await expect(page.getByRole('heading', { name: heading })).toBeVisible({ timeout: 10000 });
    }
  });

  // 2. Search — Ctrl+K opens search overlay
  test('search: Ctrl+K opens search overlay', async ({ page }) => {
    await page.goto('/');

    // Press Ctrl+K to open search
    await page.keyboard.press('Control+k');

    // Search overlay should be visible with the input
    const searchInput = page.getByPlaceholder(/search across all/i);
    await expect(searchInput).toBeVisible();

    // Type a query and verify results appear
    await searchInput.fill('secretariat');
    await expect(page.getByText(/secretariat/i)).toBeVisible();
  });

  // 3. Theme toggle
  test('theme: toggle switches between dark and light', async ({ page }) => {
    await page.goto('/');

    // The theme toggle button shows "Light" in dark mode or "Dark" in light mode
    const themeButton = page.getByRole('button', { name: /switch to (light|dark) mode/i });

    // Check initial state and toggle
    const initialIsDark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    );

    await themeButton.click();

    // After toggle, the class should have changed
    const afterToggleIsDark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    );
    expect(afterToggleIsDark).toBe(!initialIsDark);
  });

  // 4. 404 page
  test('404: unknown route shows themed not found page', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');

    // The NotFound page shows "Timeline Not Found"
    await expect(page.getByRole('heading', { name: /timeline not found/i })).toBeVisible();

    // There should be a link back to home
    await expect(page.getByRole('link', { name: /return to present day/i })).toBeVisible();
  });

  // 5. Bookmarks page loads
  test('bookmarks: page renders with content', async ({ page }) => {
    await page.goto('/bookmarks');

    // Bookmarks page should have a heading
    await expect(page.getByRole('heading', { name: /bookmark/i })).toBeVisible({ timeout: 10000 });
  });
});
