import { useState, useEffect, useCallback } from 'react';
import { syncBookmarks, isBookmarksCached } from '@/services/bookmarkSync';

type SyncState = 'synced' | 'syncing' | 'offline' | 'failed';

export function SyncStatusIndicator() {
  const [state, setState] = useState<SyncState>('synced');
  const [, setIsOnline] = useState(navigator.onLine);

  const doSync = useCallback(async () => {
    setState('syncing');
    try {
      await syncBookmarks();
      const cached = await isBookmarksCached();
      setState(cached ? 'synced' : 'failed');
    } catch {
      setState('failed');
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => { setIsOnline(true); void doSync(); };
    const handleOffline = () => { setIsOnline(false); setState('offline'); };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [doSync]);

  // Initial sync on mount
  useEffect(() => {
    if (navigator.onLine) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void doSync();
    } else {
      setState('offline');
    }
  }, [doSync]);

  const colors: Record<SyncState, string> = {
    synced: 'bg-emerald-500',
    syncing: 'bg-blue-500',
    offline: 'bg-amber-500',
    failed: 'bg-red-500',
  };

  const labels: Record<SyncState, string> = {
    synced: 'Synced',
    syncing: 'Syncing...',
    offline: 'Offline',
    failed: 'Sync failed',
  };

  return (
    <div className="flex items-center gap-2 text-xs text-neutral-400">
      <span
        className={`inline-block w-2 h-2 rounded-full ${colors[state]} ${state === 'syncing' ? 'animate-pulse' : ''}`}
        aria-hidden="true"
      />
      <span aria-live="polite">{labels[state]}</span>
      {state === 'failed' && (
        <button
          onClick={() => void doSync()}
          className="text-indigo-400 hover:text-indigo-300 underline"
        >
          Retry
        </button>
      )}
    </div>
  );
}