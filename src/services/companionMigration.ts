import { createCompanion } from './companionService';

const CUSTOM_NAME_KEY = 'companion_custom_name';
const CUSTOM_PROMPT_KEY = 'companion_custom_prompt';
const MIGRATION_DONE_KEY = 'companion_migration_done';

/**
 * Migrates the old single custom companion from localStorage to IndexedDB.
 * Runs once on app load. Safe to call multiple times — checks MIGRATION_DONE_KEY.
 */
export async function migrateFromLocalStorage(): Promise<void> {
  // Already migrated
  if (localStorage.getItem(MIGRATION_DONE_KEY)) return;

  const customName = localStorage.getItem(CUSTOM_NAME_KEY);
  const customPrompt = localStorage.getItem(CUSTOM_PROMPT_KEY);

  if (customName && customPrompt) {
    await createCompanion({
      name: customName,
      prompt: customPrompt,
      avatar: '🎭',
      styleTags: ['migrated'],
    });
  }

  localStorage.setItem(MIGRATION_DONE_KEY, Date.now().toString());
}

/**
 * Clears old localStorage companion data after successful migration.
 * Call this only after migration is confirmed working.
 */
export function cleanupLocalStorageCompanions(): void {
  localStorage.removeItem(CUSTOM_NAME_KEY);
  localStorage.removeItem(CUSTOM_PROMPT_KEY);
}