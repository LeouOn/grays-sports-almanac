import fs from 'node:fs';
import path from 'node:path';

const INGESTED_DIR = path.join(process.cwd(), 'data', 'ingested');

/** Module name → array of entries */
type IngestedStore = Record<string, unknown[]>;

/**
 * Load all ingested entries from the data/ingested/ directory.
 * Each file is named {module}.json and contains an array of entries.
 */
export function loadIngested(): IngestedStore {
  const store: IngestedStore = {};
  try {
    if (!fs.existsSync(INGESTED_DIR)) {
      fs.mkdirSync(INGESTED_DIR, { recursive: true });
      return store;
    }

    const files = fs.readdirSync(INGESTED_DIR).filter(f => f.endsWith('.json'));
    for (const file of files) {
      const moduleName = file.replace('.json', '');
      try {
        const raw = fs.readFileSync(path.join(INGESTED_DIR, file), 'utf-8');
        const entries = JSON.parse(raw);
        if (Array.isArray(entries)) {
          store[moduleName] = entries;
        }
      } catch (err) {
        console.warn(`[persistence] Failed to load ${file}: ${(err as Error).message}`);
      }
    }

    const total = Object.values(store).reduce((sum, arr) => sum + arr.length, 0);
    if (total > 0) {
      console.log(`[persistence] Loaded ${total} ingested entries across ${Object.keys(store).length} modules`);
    }
  } catch (err) {
    console.warn(`[persistence] Error loading ingested data: ${(err as Error).message}`);
  }
  return store;
}

/**
 * Save an entry to the ingested JSON file for its module.
 * Creates the file if it doesn't exist, appends or updates the entry.
 */
export function saveIngested(module: string, entry: Record<string, unknown>): void {
  try {
    if (!fs.existsSync(INGESTED_DIR)) {
      fs.mkdirSync(INGESTED_DIR, { recursive: true });
    }

    const filePath = path.join(INGESTED_DIR, `${module}.json`);
    let entries: Record<string, unknown>[] = [];

    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        entries = JSON.parse(raw);
      } catch {
        entries = [];
      }
    }

    // Update or append
    const idx = entries.findIndex((e) => e.id === entry.id);
    if (idx >= 0) {
      entries[idx] = { ...entries[idx], ...entry };
    } else {
      entries.push(entry);
    }

    fs.writeFileSync(filePath, JSON.stringify(entries, null, 2), 'utf-8');
    console.log(`[persistence] Saved ${entry.id} → ${module}.json (${entries.length} entries total)`);
  } catch (err) {
    console.error(`[persistence] Failed to save ${entry.id}: ${(err as Error).message}`);
  }
}

/**
 * Get all ingested entries for a module.
 */
export function getIngested(module: string): unknown[] {
  const filePath = path.join(INGESTED_DIR, `${module}.json`);
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return [];
  }
}

/**
 * Full backup: returns all ingested data as a JSON object.
 */
export function exportIngested(): IngestedStore {
  return loadIngested();
}

/**
 * Full restore: writes an entire IngestedStore to disk.
 */
export function restoreIngested(store: IngestedStore): { restored: number } {
  let count = 0;
  for (const [module, entries] of Object.entries(store)) {
    if (!Array.isArray(entries)) continue;
    const filePath = path.join(INGESTED_DIR, `${module}.json`);
    fs.writeFileSync(filePath, JSON.stringify(entries, null, 2), 'utf-8');
    count += entries.length;
  }
  console.log(`[persistence] Restored ${count} entries across ${Object.keys(store).length} modules`);
  return { restored: count };
}
