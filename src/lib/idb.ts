import { openDB as idbOpen, type DBSchema, type IDBPDatabase } from 'idb';

/**
 * Cached knowledge entry stored in IndexedDB for offline access.
 */
export interface KnowledgeEntry {
  id: string;
  module: string;
  type: string;
  data: unknown;
  cachedAt?: number;
}

/**
 * Cached bookmark for read-only offline access.
 */
export interface CachedBookmark {
  id: string;
  module: string;
  entry_id: string;
  note?: string;
  cachedAt?: number;
}

/**
 * Custom companion stored in IndexedDB (C1).
 */
export interface CustomCompanion {
  id: string;
  name: string;
  prompt: string;
  avatar: string;
  styleTags: string[];
  createdAt: number;
  updatedAt: number;
}

/**
 * IndexedDB schema v1 for the Time Traveler's Guide.
 */
export interface TTGDatabaseV1 extends DBSchema {
  knowledge: {
    key: string;
    value: KnowledgeEntry;
    indexes: { module: string; type: string };
  };
  bookmarks_cache: {
    key: string;
    value: CachedBookmark;
  };
}

/**
 * IndexedDB schema v2 — adds custom_companions store (C1).
 */
export interface TTGDatabaseV2 extends DBSchema {
  knowledge: {
    key: string;
    value: KnowledgeEntry;
    indexes: { module: string; type: string };
  };
  bookmarks_cache: {
    key: string;
    value: CachedBookmark;
  };
  custom_companions: {
    key: string;
    value: CustomCompanion;
    indexes: { name: string; createdAt: number };
  };
}

export type TTGDatabase = TTGDatabaseV2;

const DB_NAME = 'time-traveler-guide';
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase<TTGDatabase>> | null = null;

/**
 * Opens the IndexedDB database. Caches the promise so repeated calls
 * return the same connection. The `upgrade` callback handles migrations
 * from any older schema version.
 */
export function openDB(): Promise<IDBPDatabase<TTGDatabase>> {
  if (!dbPromise) {
    dbPromise = idbOpen<TTGDatabase>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        // Migration from 0 → 1: create initial stores
        if (oldVersion < 1) {
          const knowledgeStore = db.createObjectStore('knowledge', {
            keyPath: 'id',
          });
          knowledgeStore.createIndex('module', 'module');
          knowledgeStore.createIndex('type', 'type');

          db.createObjectStore('bookmarks_cache', {
            keyPath: 'id',
          });
        }
        // Migration from 1 → 2: add custom_companions store (C1)
        if (oldVersion < 2) {
          const companionStore = db.createObjectStore('custom_companions', {
            keyPath: 'id',
          });
          companionStore.createIndex('name', 'name');
          companionStore.createIndex('createdAt', 'createdAt');
        }
      },
    });
  }
  return dbPromise;
}

/**
 * Closes the database connection and clears the cached promise.
 * Used by tests and when a fresh connection is needed.
 */
export async function closeDB(): Promise<void> {
  if (dbPromise) {
    const db = await dbPromise;
    db.close();
    dbPromise = null;
  }
}

/**
 * Resets the database entirely: closes the connection and deletes
 * the database. Used by tests to ensure a clean state.
 */
export async function resetDB(): Promise<void> {
  await closeDB();
  await new Promise<void>((resolve) => {
    const req = indexedDB.deleteDatabase(DB_NAME);
    req.onsuccess = () => resolve();
    req.onerror = () => resolve();
    req.onblocked = () => resolve();
  });
}
