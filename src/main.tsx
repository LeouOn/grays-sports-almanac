import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { captureVitals } from '@/lib/web-vitals';
import { checkVersionAndInvalidate } from '@/services/cacheInvalidation';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Production-only: capture Core Web Vitals (CLS/FCP/INP/LCP/TTFB).
// Tree-shaken out of dev builds by the PROD guard.
if (import.meta.env.PROD) {
  captureVitals().catch(() => {
    /* vitals are best-effort; never block the app on them */
  });
}

// On app boot: clear IndexedDB caches when the app version changes.
checkVersionAndInvalidate('0.0.0').catch(() => {
  /* cache invalidation is best-effort; never block the app on it */
});
