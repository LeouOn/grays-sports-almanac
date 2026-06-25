import { test, expect } from './fixtures';
import type { Page } from '@playwright/test';

/**
 * Keyboard-only navigation E2E tests.
 *
 * Verifies that every interactive element is reachable without a mouse, that
 * tab order is logical, that the skip link works, and that the modal dialogs
 * (search + companion) trap and restore focus correctly via `useModalFocus`.
 *
 * These run against the Playwright-managed dev server (see playwright.config.ts)
 * and are excluded from the vitest suite via `exclude: ['e2e/**']` in
 * vite.config.ts.
 */

/** Serializable snapshot of whichever element currently holds focus. */
type FocusedInfo = {
  tag: string;
  text: string;
  aria: string;
  href: string;
};

async function getFocusedInfo(page: Page): Promise<FocusedInfo | null> {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return null;
    return {
      tag: el.tagName.toLowerCase(),
      text: (el.textContent || '').trim().slice(0, 40),
      aria: el.getAttribute('aria-label') || '',
      href: el.getAttribute('href') || '',
    };
  });
}

/** True when the active element lives inside the open modal dialog. */
async function focusInsideModal(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const dlg = document.querySelector('[role="dialog"][aria-modal="true"]');
    return !!dlg && dlg.contains(document.activeElement) && document.activeElement !== document.body;
  });
}

// Card CTAs on the dashboard, in DOM order. Two cards share the label
// "View Almanac" (Sports + Financial), so we match by text rather than href.
const CARD_CTA_PATTERN =
  /^(view (almanac|guide|protocols|targets|interventions|strategy map|blueprints)|take the quiz|calculate risk)$/i;

// Every module card's destination route + the heading that confirms the page
// loaded. Mirrors the routes exercised by e2e/smoke.spec.ts.
const MODULE_CARDS: Array<{ href: string; heading: RegExp }> = [
  { href: '/sports', heading: /sports/i },
  { href: '/finance', heading: /financial/i },
  { href: '/era-guide', heading: /era/i },
  { href: '/disasters', heading: /disaster/i },
  { href: '/quiz', heading: /quiz/i },
  { href: '/tech-transfer', heading: /tech/i },
  { href: '/medical', heading: /medical/i },
  { href: '/butterfly', heading: /butterfly/i },
  { href: '/safety', heading: /safety/i },
  { href: '/timeline', heading: /temporal/i },
  { href: '/blueprints', heading: /bootstrap/i },
];

test.describe('Keyboard navigation', () => {
  test('skip link is the first focusable element and moves focus to main content', async ({ page }) => {
    await page.goto('/');
    await page.focus('body');

    // First Tab lands on the skip link.
    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: /skip to main content/i });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();

    // Activating it sends focus to the main landmark (tabindex=-1 makes it
    // programmatically focusable, which is the standard skip-link contract).
    await page.keyboard.press('Enter');
    const main = page.locator('#main-content');
    await expect(main).toBeFocused();
  });

  test('dashboard tab order is logical: skip link, then header chrome, then module cards', async ({ page }) => {
    await page.goto('/');
    await page.focus('body');

    // Walk Tab and record each unique stop until focus cycles back to the
    // first one (or we hit a sane cap).
    const stops: FocusedInfo[] = [];
    const seen = new Set<string>();
    const firstKey = () => {
      const s = stops[0];
      return s ? `${s.tag}|${s.href}|${s.text}|${s.aria}` : '';
    };
    for (let i = 0; i < 50; i++) {
      await page.keyboard.press('Tab');
      const cur = await getFocusedInfo(page);
      if (!cur) continue;
      const key = `${cur.tag}|${cur.href}|${cur.text}|${cur.aria}`;
      if (stops.length > 0 && key === firstKey()) break; // wrapped
      if (seen.has(key)) continue;
      seen.add(key);
      stops.push(cur);
    }

    // 1. Skip link is the very first focusable element.
    expect(stops[0].text.toLowerCase()).toMatch(/skip/);

    // 2. A header nav link (e.g. "Sports") is reached before any card CTA.
    const navLinkIdx = stops.findIndex(s => /^sports$/i.test(s.text));
    const firstCardIdx = stops.findIndex(s => CARD_CTA_PATTERN.test(s.text));
    expect(navLinkIdx).toBeGreaterThanOrEqual(0);
    expect(firstCardIdx).toBeGreaterThan(navLinkIdx);

    // 3. All 11 module card CTAs are reachable via Tab.
    const cardCtas = stops.filter(s => CARD_CTA_PATTERN.test(s.text));
    expect(cardCtas).toHaveLength(11);
  });

  test('search modal: Ctrl+K opens, typing filters results, Escape closes and restores focus', async ({ page }) => {
    await page.goto('/');

    // Focus the search trigger explicitly so we can verify focus restoration.
    const trigger = page.getByRole('button', { name: /search the archive/i });
    await trigger.focus();
    await expect(trigger).toBeFocused();

    // Global Ctrl+K shortcut opens the search modal.
    await page.keyboard.press('Control+k');
    const input = page.getByRole('textbox', { name: /search the archive/i });
    await expect(input).toBeVisible();
    await expect(input).toBeFocused();

    // Typing produces live results.
    await page.keyboard.type('secretariat');
    await expect(page.getByText(/secretariat/i).first()).toBeVisible();

    // Escape closes the modal.
    await page.keyboard.press('Escape');
    await expect(input).not.toBeVisible();

    // useModalFocus restores focus to the trigger that opened the dialog.
    await expect(trigger).toBeFocused();
  });

  test('companion modal: keyboard-activatable, focus trapped, Escape closes and restores focus', async ({ page }) => {
    await page.goto('/');

    // Reach and activate the companion button without a mouse.
    const trigger = page.getByRole('button', { name: /open companion settings/i });
    await trigger.focus();
    await expect(trigger).toBeFocused();
    await page.keyboard.press('Enter');

    const dialog = page.getByRole('dialog', { name: /time travel companion/i });
    await expect(dialog).toBeVisible();

    // useModalFocus pulls focus into the dialog and focuses the first focusable
    // child (the header close button).
    const closeBtn = page.getByRole('button', { name: /close companion settings/i });
    await expect(closeBtn).toBeFocused();

    // Tab cycles inside the dialog without escaping to the page behind.
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      const contained = await focusInsideModal(page);
      expect(contained, `Tab iteration ${i} escaped the companion dialog`).toBeTruthy();
    }

    // Escape closes the dialog.
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();

    // Focus is restored to the trigger.
    await expect(trigger).toBeFocused();
  });

  test('every dashboard module card is keyboard-focusable and Enter-navigable', async ({ page }) => {
    for (const { href, heading } of MODULE_CARDS) {
      await page.goto('/');
      const link = page.locator(`a[href="${href}"]`).first();
      await link.focus();
      await expect(link).toBeFocused();

      // Enter activates the link (equivalent to a click).
      await page.keyboard.press('Enter');
      await expect(page.getByRole('heading', { name: heading })).toBeVisible({ timeout: 10000 });
    }
  });

  test('Escape closes both the search and companion modals', async ({ page }) => {
    await page.goto('/');

    // Search modal via Ctrl+K, then Escape.
    await page.keyboard.press('Control+k');
    const searchInput = page.getByRole('textbox', { name: /search the archive/i });
    await expect(searchInput).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(searchInput).not.toBeVisible();

    // Companion modal via keyboard activation, then Escape.
    const companionBtn = page.getByRole('button', { name: /open companion settings/i });
    await companionBtn.focus();
    await page.keyboard.press('Enter');
    const companionDialog = page.getByRole('dialog', { name: /time travel companion/i });
    await expect(companionDialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(companionDialog).not.toBeVisible();
  });

  test('focus trap: Tab and Shift+Tab never escape an open modal to the page behind', async ({ page }) => {
    await page.goto('/');

    // Open the search modal — its focus trap is provided by useModalFocus.
    await page.keyboard.press('Control+k');
    const dialog = page.getByRole('dialog', { name: /search the archive/i });
    await expect(dialog).toBeVisible();

    // Tab forward many times — focus must stay inside the dialog.
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press('Tab');
      const contained = await focusInsideModal(page);
      expect(contained, `Tab forward iteration ${i} escaped the dialog`).toBeTruthy();
    }

    // Shift+Tab backward many times — same containment invariant.
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press('Shift+Tab');
      const contained = await focusInsideModal(page);
      expect(contained, `Shift+Tab iteration ${i} escaped the dialog`).toBeTruthy();
    }
  });
});
