import { describe, it, expect, beforeEach } from 'vitest';
import { getActiveCompanion, setActiveDefault, setActiveCustom } from './activeCompanionSelector';

describe('Active companion selector', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns default athena when nothing stored', () => {
    const result = getActiveCompanion();
    expect(result.type).toBe('default');
    expect(result.defaultId).toBe('athena');
  });

  it('setActiveDefault persists correctly', () => {
    setActiveDefault('biff');
    expect(getActiveCompanion().defaultId).toBe('biff');
  });

  it('setActiveCustom persists correctly', () => {
    setActiveCustom('companion-123');
    const result = getActiveCompanion();
    expect(result.type).toBe('custom');
    expect(result.customId).toBe('companion-123');
  });

  it('handles legacy format (plain string)', () => {
    localStorage.setItem('companion_active_id', 'athena');
    const result = getActiveCompanion();
    expect(result.type).toBe('default');
    expect(result.defaultId).toBe('athena');
  });
});