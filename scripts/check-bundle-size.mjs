#!/usr/bin/env node
/**
 * Bundle size budget checker.
 * Run after `vite build` to verify chunks are within budget.
 * Fails (exit 1) if any chunk exceeds its budget.
 *
 * Usage: node scripts/check-bundle-size.mjs
 * Script assumes `dist/assets` directory exists (run `vite build` first).
 *
 * ---------------------------------------------------------------------------
 * BUDGET RATIONALE
 * ---------------------------------------------------------------------------
 * Budgets are set with headroom above the current observed size so that
 * minor dependency updates do not cause noise, while still catching
 * regressions (e.g. accidentally importing a heavy lib into the entry chunk).
 *
 * - `index` (420 KB):   Initial entry chunk — most critical for TTFB/LCP.
 *                       Was 516 KB before P2 lazy-loading, now ~401 KB after
 *                       P2+P4+O1+C1-C9 (idb lib, chart skeletons, search async,
 *                       companion services). 22% reduction from original.
 *                       Loosened from 350 KB because idb library + async
 *                       search + companion infrastructure added framework
 *                       code to the entry chunk. Gzip size (~125 KB) is
 *                       well within performance targets.
 * - `CategoricalChart` (350 KB): recharts CategoricalChart (Line/Area/Bar).
 *                       Lazy-loaded via P4. ~257 KB currently. Acceptable
 *                       because it loads on demand, not on first paint.
 * - `CartesianChart` (350 KB):   recharts CartesianChart wrapper. ~53 KB.
 * - `PolarChart` (200 KB):       recharts Pie/Radar. ~14 KB currently.
 * - `Quiz` (250 KB):             Quiz page — question data + logic. ~212 KB.
 * - `FinancialAlmanac` (100 KB), `ButterflyCalculator` (100 KB),
 *   `TemporalMap` (100 KB):      Feature pages with their own data/visuals.
 * - `BootstrapBlueprints` (50 KB): Small static reference page.
 * - `css` (150 KB):              Aggregated index CSS (Tailwind + fonts).
 * - `_default` (100 KB):         Catch-all for unnamed chunks (icons, utils,
 *                       shared hooks, etc.). Most are < 80 KB.
 *
 * ---------------------------------------------------------------------------
 * HOW TO ADJUST
 * ---------------------------------------------------------------------------
 * - To TIGHTEN a budget after optimization work: reduce the number, rebuild,
 *   and confirm the script still passes.
 * - To LOOSEN a budget (last resort, with justification): increase the number
 *   and document the reason in the comment above the budget entry.
 * - To ADD a new chunk budget: identify the chunk name from `dist/assets/`
 *   (the prefix before the first `-`), then add an entry to BUDGETS.
 *
 * ---------------------------------------------------------------------------
 * WHEN TO RE-EVALUATE
 * ---------------------------------------------------------------------------
 * - After adding a new top-level route or feature page.
 * - After upgrading a major dependency (especially recharts, react, ai-sdk).
 * - After any bundle-splitting refactor (P2/P4-style work).
 * - Quarterly, even if nothing has changed, to catch drift.
 * ---------------------------------------------------------------------------
 */

import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST_DIR = 'dist/assets';

// Budgets in BYTES (1 KB = 1024 bytes)
const BUDGETS = {
  // Initial entry chunk — most critical
  'index': 420 * 1024,      // 420 KB (was 516, now ~401 after P2+P4+O1+C1-C9)

  // Large lazy chunks — acceptable since they load on demand
  'CategoricalChart': 350 * 1024,  // recharts (263 KB currently)
  'CartesianChart': 350 * 1024,    // recharts cartesian
  'PolarChart': 200 * 1024,        // recharts polar
  'Quiz': 250 * 1024,              // quiz page (217 KB)

  // Page chunks
  'FinancialAlmanac': 100 * 1024,
  'ButterflyCalculator': 100 * 1024,
  'TemporalMap': 100 * 1024,
  'BootstrapBlueprints': 50 * 1024,

  // CSS
  'css': 150 * 1024,  // index CSS

  // Default budget for any unnamed chunk
  '_default': 100 * 1024,
};

// Read dist/assets directory
function getChunkSizes() {
  const files = readdirSync(DIST_DIR);
  const chunks = {};

  for (const file of files) {
    if (!file.endsWith('.js') && !file.endsWith('.css')) continue;
    const filePath = join(DIST_DIR, file);
    const size = statSync(filePath).size;

    // Extract chunk name (remove hash prefix/suffix)
    // Format: name-hash.ext or hash.ext
    const match = file.match(/^([a-zA-Z]+)-/);
    const name = match ? match[1] : file.split('-')[0].split('.')[0];

    if (file.endsWith('.css')) {
      chunks['css'] = (chunks['css'] || 0) + size;
    } else {
      // Sum all chunks with the same name prefix
      chunks[name] = (chunks[name] || 0) + size;
    }
  }

  return chunks;
}

function checkBudgets() {
  const chunks = getChunkSizes();
  const failures = [];
  const passes = [];

  for (const [name, size] of Object.entries(chunks)) {
    const budget = BUDGETS[name] || BUDGETS._default;
    const sizeKB = (size / 1024).toFixed(2);
    const budgetKB = (budget / 1024).toFixed(2);

    if (size > budget) {
      failures.push(`✗ ${name}: ${sizeKB} KB exceeds budget ${budgetKB} KB`);
    } else {
      passes.push(`✓ ${name}: ${sizeKB} KB / ${budgetKB} KB`);
    }
  }

  console.log('\n📦 Bundle Size Budget Check\n');
  console.log('PASSES:');
  passes.forEach(p => console.log(`  ${p}`));

  if (failures.length > 0) {
    console.log('\nFAILURES:');
    failures.forEach(f => console.log(`  ${f}`));
    console.log(`\n❌ ${failures.length} chunk(s) over budget`);
    process.exit(1);
  } else {
    console.log(`\n✅ All ${passes.length} chunk(s) within budget`);
  }
}

try {
  checkBudgets();
} catch (err) {
  console.error('Error checking bundle sizes:', err.message);
  console.error('Did you run `vite build` first?');
  process.exit(1);
}
