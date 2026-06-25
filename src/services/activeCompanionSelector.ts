const ACTIVE_COMPANION_KEY = 'companion_active_id';

export type CompanionType = 'default' | 'custom';

export interface ActiveCompanion {
  type: CompanionType;
  defaultId?: string; // for default companions: 'athena', 'biff', 'doc'
  customId?: string;  // for custom companions: the IndexedDB id
}

/**
 * Gets the currently active companion selection from localStorage.
 * Returns 'athena' as default if nothing stored.
 */
export function getActiveCompanion(): ActiveCompanion {
  const stored = localStorage.getItem(ACTIVE_COMPANION_KEY);
  if (!stored) return { type: 'default', defaultId: 'athena' };

  try {
    const parsed = JSON.parse(stored) as ActiveCompanion;
    return parsed;
  } catch {
    // Legacy format — treat as default companion id
    return { type: 'default', defaultId: stored };
  }
}

/**
 * Sets the active companion. Persists to localStorage.
 */
export function setActiveCompanion(companion: ActiveCompanion): void {
  localStorage.setItem(ACTIVE_COMPANION_KEY, JSON.stringify(companion));
}

/**
 * Sets active to a default companion (athena/biff/doc).
 */
export function setActiveDefault(id: string): void {
  setActiveCompanion({ type: 'default', defaultId: id });
}

/**
 * Sets active to a custom companion.
 */
export function setActiveCustom(id: string): void {
  setActiveCompanion({ type: 'custom', customId: id });
}