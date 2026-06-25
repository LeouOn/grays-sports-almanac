import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import 'fake-indexeddb/auto';
import { CompanionProvider, useCompanion, COMPANION_PROVIDER_FALLBACK } from './CompanionContext';
import { resetDB } from '@/lib/idb';
import type { CustomCompanion } from '@/lib/idb';

// Mock the migration to a no-op so IndexedDB stays empty unless we explicitly populate it.
// This keeps tests deterministic — we test the context, not the migration.
vi.mock('@/services/companionMigration', () => ({
  migrateFromLocalStorage: vi.fn().mockResolvedValue(undefined),
  cleanupLocalStorageCompanions: vi.fn(),
}));

const MOCK_CUSTOM_COMPANION: CustomCompanion = {
  id: 'custom-abc-123',
  name: 'Imported Bot',
  prompt: 'You are a custom imported bot',
  avatar: '🤖',
  styleTags: ['imported', 'test'],
  createdAt: 1_000_000,
  updatedAt: 1_000_000,
};

/**
 * Test harness that exposes the context shape via data-testid attributes
 * and provides buttons to drive state changes. Wraps useCompanion() so we
 * can verify the hook behaves correctly.
 */
function Harness({ children }: { children?: React.ReactNode }) {
  const ctx = useCompanion();
  return (
    <div>
      <span data-testid="active-id">{ctx.activeCompanion.id}</span>
      <span data-testid="active-name">{ctx.activeCompanion.name}</span>
      <span data-testid="active-prompt">{ctx.activeCompanion.prompt}</span>
      <span data-testid="user-name">{ctx.userName}</span>
      <span data-testid="custom-name">{ctx.customName}</span>
      <span data-testid="custom-prompt">{ctx.customPrompt}</span>
      <span data-testid="provider">{ctx.companionProvider}</span>
      <button data-testid="select-biff" onClick={() => ctx.selectCompanion('biff')}>
        Select Biff
      </button>
      <button data-testid="select-doc" onClick={() => ctx.selectCompanion('doc')}>
        Select Doc
      </button>
      <button data-testid="select-athena" onClick={() => ctx.selectCompanion('athena')}>
        Select Athena
      </button>
      <button
        data-testid="select-custom-default"
        onClick={() => ctx.selectCompanion('custom')}
      >
        Select Custom Default
      </button>
      <button
        data-testid="select-custom-idb"
        onClick={() => ctx.selectCustomCompanion(MOCK_CUSTOM_COMPANION)}
      >
        Select IDB Custom
      </button>
      <button data-testid="set-user" onClick={() => ctx.setUserName('TestUser')}>
        Set User
      </button>
      <button data-testid="set-custom-name" onClick={() => ctx.setCustomName('My Bot')}>
        Set Custom Name
      </button>
      <button
        data-testid="set-custom-prompt"
        onClick={() => ctx.setCustomPrompt('You are a test prompt')}
      >
        Set Custom Prompt
      </button>
      <button
        data-testid="set-provider"
        onClick={() => ctx.setCompanionProvider('deepseek')}
      >
        Set Provider
      </button>
      {children}
    </div>
  );
}

describe('CompanionProvider', () => {
  beforeEach(async () => {
    await resetDB();
    localStorage.clear();
    cleanup();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders children with default athena companion when no localStorage exists', () => {
    render(
      <CompanionProvider>
        <Harness />
      </CompanionProvider>,
    );

    expect(screen.getByTestId('active-id').textContent).toBe('athena');
    expect(screen.getByTestId('user-name').textContent).toBe('Yune');
    expect(screen.getByTestId('custom-name').textContent).toBe('Time Cop');
  });

  it('hydrates user name, custom name, and custom prompt from localStorage on mount', () => {
    localStorage.setItem('traveler_user_name', 'Marcus');
    localStorage.setItem('companion_custom_name', 'Time Bot');
    localStorage.setItem('companion_custom_prompt', 'You are a time-traveling bot');

    render(
      <CompanionProvider>
        <Harness />
      </CompanionProvider>,
    );

    expect(screen.getByTestId('user-name').textContent).toBe('Marcus');
    expect(screen.getByTestId('custom-name').textContent).toBe('Time Bot');
    expect(screen.getByTestId('custom-prompt').textContent).toBe(
      'You are a time-traveling bot',
    );
  });

  it('hydrates the active companion from localStorage (saved as default id)', () => {
    localStorage.setItem('companion_active_id', 'biff');

    render(
      <CompanionProvider>
        <Harness />
      </CompanionProvider>,
    );

    expect(screen.getByTestId('active-id').textContent).toBe('biff');
  });

  it('selectCompanion switches active default companion and persists to localStorage', () => {
    render(
      <CompanionProvider>
        <Harness />
      </CompanionProvider>,
    );
    expect(screen.getByTestId('active-id').textContent).toBe('athena');

    fireEvent.click(screen.getByTestId('select-biff'));

    expect(screen.getByTestId('active-id').textContent).toBe('biff');
    const stored = localStorage.getItem('companion_active_id');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.type).toBe('default');
    expect(parsed.defaultId).toBe('biff');
  });

  it('selectCustomCompanion switches to a custom companion from IndexedDB', () => {
    render(
      <CompanionProvider>
        <Harness />
      </CompanionProvider>,
    );
    expect(screen.getByTestId('active-id').textContent).toBe('athena');

    fireEvent.click(screen.getByTestId('select-custom-idb'));

    expect(screen.getByTestId('active-id').textContent).toBe('custom-abc-123');
    expect(screen.getByTestId('active-name').textContent).toBe('Imported Bot');
  });

  it('interpolates userName into the athena prompt', () => {
    localStorage.setItem('traveler_user_name', 'ZenMaster');

    render(
      <CompanionProvider>
        <Harness />
      </CompanionProvider>,
    );

    const prompt = screen.getByTestId('active-prompt').textContent ?? '';
    expect(prompt).toContain('ZenMaster');
    expect(prompt).not.toContain('{{userName}}');
  });

  it('interpolates preferences into the athena prompt (no {{preferences}} placeholder remains)', () => {
    render(
      <CompanionProvider>
        <Harness />
      </CompanionProvider>,
    );

    const prompt = screen.getByTestId('active-prompt').textContent ?? '';
    // The placeholder must be replaced with the formatted preferences block
    expect(prompt).not.toContain('{{preferences}}');
    // Preferences block contains a section header from formatPreferences
    expect(prompt).toContain('### ');
  });

  it('uses customName and customPrompt when the "custom" default is selected', () => {
    localStorage.setItem('companion_custom_name', 'My Test Companion');
    localStorage.setItem('companion_custom_prompt', 'You are my test prompt');

    render(
      <CompanionProvider>
        <Harness />
      </CompanionProvider>,
    );

    fireEvent.click(screen.getByTestId('select-custom-default'));

    expect(screen.getByTestId('active-id').textContent).toBe('custom');
    expect(screen.getByTestId('active-name').textContent).toBe('My Test Companion');
    expect(screen.getByTestId('active-prompt').textContent).toBe('You are my test prompt');
  });

  it('setUserName updates the context state and persists to localStorage', () => {
    render(
      <CompanionProvider>
        <Harness />
      </CompanionProvider>,
    );
    expect(screen.getByTestId('user-name').textContent).toBe('Yune');

    fireEvent.click(screen.getByTestId('set-user'));

    expect(screen.getByTestId('user-name').textContent).toBe('TestUser');
    expect(localStorage.getItem('traveler_user_name')).toBe('TestUser');
  });

  it('COMPANION_PROVIDER_FALLBACK is in cost-ordered chain: minimax → zhipu → deepseek → google', () => {
    expect(COMPANION_PROVIDER_FALLBACK).toEqual(['minimax', 'zhipu', 'deepseek', 'google']);
  });
});

describe('useCompanion hook', () => {
  beforeEach(() => {
    localStorage.clear();
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it('throws when used outside a CompanionProvider', () => {
    // Suppress React's error boundary console noise for this expected error
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<Harness />)).toThrow(/useCompanion must be used within a CompanionProvider/);

    spy.mockRestore();
  });
});
