import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: 1,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
  webServer: [
    {
      command: 'pnpm run dev:frontend',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
      timeout: 30000,
    },
    {
      // Backend on :3001, proxied via /api in vite.config.ts.
      // RUN_LLM_STUB=1 forces template beats so the run e2e needs no LLM keys.
      command: 'pnpm exec tsx server/index.ts',
      url: 'http://localhost:3001/api/health',
      reuseExistingServer: true,
      timeout: 30000,
      env: { RUN_LLM_STUB: '1' },
    },
  ],
});
