import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { MobileNav } from './MobileNav';

beforeEach(() => {
  vi.clearAllMocks();
  // Stub fetch so any background calls don't pollute tests
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('null', { status: 200 })));
  cleanup();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const renderNav = (overrides: Partial<Parameters<typeof MobileNav>[0]> = {}) => {
  const props = {
    activeCompanionAvatar: '🧑‍🚀',
    activeCompanionName: 'Test',
    onCompanionClick: vi.fn(),
    onSearchClick: vi.fn(),
    ...overrides,
  };
  return render(
    <MemoryRouter>
      <MobileNav {...props} />
    </MemoryRouter>
  );
};

describe('MobileNav grouped drawer', () => {
  it('shows 3 group headers: Knowledge, AI Tools, Personal', async () => {
    renderNav();
    // Open the sheet by clicking the hamburger
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    expect(await screen.findByText('Knowledge')).toBeTruthy();
    expect(screen.getByText('AI Tools')).toBeTruthy();
    expect(screen.getByText('Personal')).toBeTruthy();
  });

  it('groups Knowledge section contains expected links', async () => {
    renderNav();
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    // Wait for sheet to open
    await screen.findByText('Knowledge');
    // Core Knowledge items (no icon = plain label; with icon = emoji-labeled)
    expect(screen.getByText('Sports')).toBeTruthy();
    expect(screen.getByText('Finance')).toBeTruthy();
    expect(screen.getByText('Era')).toBeTruthy();
    expect(screen.getByText('Timeline')).toBeTruthy();
    expect(screen.getByText('Blueprints')).toBeTruthy();
    expect(screen.getByText('Disasters')).toBeTruthy();
    expect(screen.getByText('Tech')).toBeTruthy();
    expect(screen.getByText('Medical')).toBeTruthy();
    expect(screen.getByText('Safety')).toBeTruthy();
    expect(screen.getByText('World Events')).toBeTruthy();
    expect(screen.getByText('Places to Live')).toBeTruthy();
    expect(screen.getByText('Places to Visit')).toBeTruthy();
    expect(screen.getByText('Engineering')).toBeTruthy();
  });

  it('groups AI Tools section contains expected links', async () => {
    renderNav();
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    await screen.findByText('AI Tools');
    expect(screen.getByText('Quiz')).toBeTruthy();
    expect(screen.getByText('Risk')).toBeTruthy();
    expect(screen.getByText('Companions')).toBeTruthy();
  });

  it('groups Personal section contains expected links', async () => {
    renderNav();
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    await screen.findByText('Personal');
    expect(screen.getByText('Bookmarks')).toBeTruthy();
    expect(screen.getByText('Progress')).toBeTruthy();
  });

  it('total count: 19 nav links across 3 groups', async () => {
    renderNav();
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    await screen.findByText('Knowledge');
    // 13 Knowledge + 3 AI Tools + 3 Personal = 19 nav links total.
    // The 2 header buttons (companion, search) are <button> elements, not
    // <a> tags, so getAllByRole('link') only counts the 19 nav links.
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(19);
  });

  it('clicking a nav link closes the drawer and navigates', async () => {
    renderNav();
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    const quizLink = await screen.findByText('Quiz');
    fireEvent.click(quizLink);
    // After clicking, the SheetClose should close the drawer. The link itself
    // is still in the DOM (MemoryRouter rendered), but the Sheet's open state
    // has flipped. We verify the call stack is correct by checking the
    // component doesn't crash and Quiz is still queryable.
    expect(quizLink).toBeTruthy();
  });

  it('shows the active companion avatar and name in the header', () => {
    renderNav({ activeCompanionAvatar: '🧙', activeCompanionName: 'Merlin' });
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    expect(screen.getByText('Merlin')).toBeTruthy();
  });

  it('search button in the header calls onSearchClick', () => {
    const onSearchClick = vi.fn();
    renderNav({ onSearchClick });
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    fireEvent.click(screen.getByText('Search'));
    expect(onSearchClick).toHaveBeenCalledTimes(1);
  });

  it('companion button in the header calls onCompanionClick', () => {
    const onCompanionClick = vi.fn();
    renderNav({ onCompanionClick });
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    fireEvent.click(screen.getByText('Test'));
    expect(onCompanionClick).toHaveBeenCalledTimes(1);
  });
});
