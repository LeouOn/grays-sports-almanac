import { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'tt-install-dismissed';
const DISMISS_DAYS = 7;

const detectIOS = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  // Safari proper — exclude Chrome, CriOS, Android, FxiOS.
  const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua);
  return isIOS && isSafari;
};

const wasDismissedRecently = (): boolean => {
  try {
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (!dismissed) return false;
    const daysSince = (Date.now() - parseInt(dismissed, 10)) / (1000 * 60 * 60 * 24);
    return daysSince < DISMISS_DAYS;
  } catch {
    return false;
  }
};

const isStandalone = (): boolean => {
  try {
    return window.matchMedia('(display-mode: standalone)').matches;
  } catch {
    return false;
  }
};

// Compute initial visibility synchronously from environment signals so the
// effect doesn't have to call setState in its body (which the React 19
// `react-hooks/set-state-in-effect` lint rule disallows). iOS Safari gets
// manual instructions immediately; Android/Chrome wait for the
// `beforeinstallprompt` event.
const computeInitialVisible = (): boolean => {
  if (wasDismissedRecently()) return false;
  if (isStandalone()) return false;
  return detectIOS();
};

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOS] = useState<boolean>(detectIOS);
  const [visible, setVisible] = useState<boolean>(computeInitialVisible);

  useEffect(() => {
    // iOS Safari doesn't fire beforeinstallprompt; nothing more to wire up.
    if (showIOS) return;
    // Already installed or recently dismissed — don't bother listening.
    if (isStandalone() || wasDismissedRecently()) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [showIOS]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'dismissed') {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    }
    setVisible(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="mx-auto max-w-2xl mb-4 p-3 bg-indigo-950/30 border border-indigo-900/50 rounded-lg flex items-start gap-3">
      <Download className="size-5 text-indigo-400 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-neutral-100">Install Time Traveler's Guide</p>
        <p className="text-xs text-neutral-400 mt-0.5">
          {showIOS ? (
            <>Tap <Share className="inline size-3" /> Share → "Add to Home Screen" for offline access.</>
          ) : (
            <>Add to your home screen for offline access and a native app experience.</>
          )}
        </p>
      </div>
      {!showIOS && (
        <button
          onClick={handleInstall}
          className="shrink-0 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
        >
          Install
        </button>
      )}
      <button
        onClick={handleDismiss}
        aria-label="Dismiss install prompt"
        className="shrink-0 text-neutral-500 hover:text-neutral-300 p-1"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}