import { useState } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { X, WifiOff } from 'lucide-react';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  const [dismissed, setDismissed] = useState(false);

  if (isOnline || dismissed) return null;

  return (
    <div
      className="fixed top-[env(safe-area-inset-top,0px)] left-0 right-0 z-40 bg-amber-600 text-white px-4 py-2 flex items-center justify-between text-sm"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        <WifiOff className="size-4" aria-hidden="true" />
        <span>You're offline. Showing cached content.</span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss offline notice"
        className="hover:bg-amber-700 rounded p-1 transition-colors"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}