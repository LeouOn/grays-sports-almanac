import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { resetDB } from '@/lib/idb';
import { migrateFromLocalStorage, cleanupLocalStorageCompanions } from './companionMigration';
import { listCompanions } from './companionService';

describe('Companion migration', () => {
  beforeEach(async () => {
    await resetDB();
    localStorage.clear();
  });

  it('migrates existing localStorage companion to IndexedDB', async () => {
    localStorage.setItem('companion_custom_name', 'Test Bot');
    localStorage.setItem('companion_custom_prompt', 'You are a test bot');

    await migrateFromLocalStorage();

    const companions = await listCompanions();
    expect(companions).toHaveLength(1);
    expect(companions[0].name).toBe('Test Bot');
  });

  it('does nothing if already migrated', async () => {
    localStorage.setItem('companion_migration_done', Date.now().toString());
    localStorage.setItem('companion_custom_name', 'Test Bot');

    await migrateFromLocalStorage();

    const companions = await listCompanions();
    expect(companions).toHaveLength(0);
  });

  it('does nothing if no localStorage data', async () => {
    await migrateFromLocalStorage();
    const companions = await listCompanions();
    expect(companions).toHaveLength(0);
    expect(localStorage.getItem('companion_migration_done')).toBeTruthy();
  });

  it('cleanup removes localStorage data', () => {
    localStorage.setItem('companion_custom_name', 'Test');
    cleanupLocalStorageCompanions();
    expect(localStorage.getItem('companion_custom_name')).toBeNull();
  });
});