import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, render, screen, fireEvent, cleanup } from '@testing-library/react';
import { InstallPrompt } from './InstallPrompt';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const makeDeferredPromptEvent = (outcome: 'accepted' | 'dismissed' = 'accepted') => {
  const event = new Event('beforeinstallprompt') as InstallPromptEvent;
  event.prompt = vi.fn().mockResolvedValue(undefined);
  event.userChoice = Promise.resolve({ outcome });
  return event;
};

const setStandalone = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query === '(display-mode: standalone)' ? matches : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

const setUserAgent = (ua: string) => {
  Object.defineProperty(navigator, 'userAgent', {
    value: ua,
    writable: true,
    configurable: true,
  });
};

beforeEach(() => {
  // Default: Chromium on Linux, not standalone, fresh dismiss state.
  setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  setStandalone(false);
  localStorage.clear();
  vi.restoreAllMocks();
  cleanup();
});

afterEach(() => {
  cleanup();
});

describe('InstallPrompt', () => {
  it('renders nothing when already in standalone (installed) mode', () => {
    setStandalone(true);
    const { container } = render(<InstallPrompt />);
    // Standalone = installed; banner must stay hidden even after the event.
    expect(container).toBeEmptyDOMElement();

    act(() => {
      window.dispatchEvent(makeDeferredPromptEvent());
    });
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText(/Install Time Traveler/i)).toBeNull();
  });

  it('shows the install button after beforeinstallprompt fires', async () => {
    render(<InstallPrompt />);

    // Before the event, nothing is rendered.
    expect(screen.queryByText(/Install Time Traveler/i)).toBeNull();

    act(() => {
      window.dispatchEvent(makeDeferredPromptEvent());
    });

    const heading = await screen.findByText(/Install Time Traveler/i);
    expect(heading).toBeTruthy();
    const installBtn = screen.getByRole('button', { name: /^install$/i });
    expect(installBtn).toBeTruthy();

    // Clicking Install calls the deferred prompt's prompt() and hides the banner.
    await act(async () => {
      fireEvent.click(installBtn);
      // Flush microtasks so the userChoice Promise resolves inside act().
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(screen.queryByText(/Install Time Traveler/i)).toBeNull();
  });

  it('records dismissal in localStorage and hides the banner', () => {
    render(<InstallPrompt />);

    act(() => {
      window.dispatchEvent(makeDeferredPromptEvent());
    });
    expect(screen.getByText(/Install Time Traveler/i)).toBeTruthy();

    const dismissBtn = screen.getByRole('button', { name: /dismiss install prompt/i });
    act(() => {
      fireEvent.click(dismissBtn);
    });

    // The timestamp is recorded…
    const stored = localStorage.getItem('tt-install-dismissed');
    expect(stored).toBeTruthy();
    expect(Number.isFinite(Number(stored))).toBe(true);

    // …and the banner is gone immediately.
    expect(screen.queryByText(/Install Time Traveler/i)).toBeNull();
  });
});