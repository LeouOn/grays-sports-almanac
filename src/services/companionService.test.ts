import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { resetDB } from '@/lib/idb';
import {
  createCompanion,
  getCompanion,
  listCompanions,
  updateCompanion,
  deleteCompanion,
  searchCompanions,
  type CompanionInput,
} from './companionService';

describe('Companion CRUD service', () => {
  beforeEach(async () => {
    await resetDB();
  });

  it('creates a companion and retrieves it by id', async () => {
    const input: CompanionInput = {
      name: 'Sarcastic Bot',
      prompt: 'You are a sarcastic AI...',
      avatar: '🤖',
      styleTags: ['sarcastic', 'witty'],
    };
    const created = await createCompanion(input);
    expect(created.id).toBeDefined();
    expect(created.name).toBe('Sarcastic Bot');

    const retrieved = await getCompanion(created.id);
    expect(retrieved?.name).toBe('Sarcastic Bot');
    expect(retrieved?.styleTags).toEqual(['sarcastic', 'witty']);
  });

  it('lists all companions sorted by createdAt desc', async () => {
    await createCompanion({ name: 'First', prompt: 'p1', avatar: '😀', styleTags: [] });
    await createCompanion({ name: 'Second', prompt: 'p2', avatar: '😎', styleTags: [] });
    const list = await listCompanions();
    expect(list).toHaveLength(2);
    expect(list[0].name).toBe('Second'); // newest first
  });

  it('updates a companion', async () => {
    const created = await createCompanion({ name: 'Old', prompt: 'p', avatar: '🤖', styleTags: [] });
    const updated = await updateCompanion(created.id, { name: 'New', prompt: 'updated prompt' });
    expect(updated.name).toBe('New');
    expect(updated.prompt).toBe('updated prompt');
    expect(updated.updatedAt).toBeGreaterThanOrEqual(created.updatedAt);
  });

  it('deletes a companion', async () => {
    const created = await createCompanion({ name: 'Temp', prompt: 'p', avatar: '🗑️', styleTags: [] });
    await deleteCompanion(created.id);
    const retrieved = await getCompanion(created.id);
    expect(retrieved).toBeUndefined();
  });

  it('searches companions by name', async () => {
    await createCompanion({ name: 'Sarcastic Bot', prompt: 'p', avatar: '🤖', styleTags: ['sarcastic'] });
    await createCompanion({ name: 'Happy Bot', prompt: 'p', avatar: '😀', styleTags: ['happy'] });
    const results = await searchCompanions('sarcastic');
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Sarcastic Bot');
  });

  it('searches companions by style tag', async () => {
    await createCompanion({ name: 'Bot1', prompt: 'p', avatar: '🤖', styleTags: ['witty', 'sarcastic'] });
    await createCompanion({ name: 'Bot2', prompt: 'p', avatar: '😀', styleTags: ['happy'] });
    const results = await searchCompanions('witty');
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Bot1');
  });

  it('search is case-insensitive', async () => {
    await createCompanion({ name: 'SARCASTIC Bot', prompt: 'p', avatar: '🤖', styleTags: [] });
    const results = await searchCompanions('sarcastic');
    expect(results).toHaveLength(1);
  });

  it('returns empty array when no companions match search', async () => {
    await createCompanion({ name: 'Bot', prompt: 'p', avatar: '🤖', styleTags: [] });
    const results = await searchCompanions('nonexistent');
    expect(results).toHaveLength(0);
  });

  it('getCompanion returns undefined for non-existent id', async () => {
    const result = await getCompanion('non-existent');
    expect(result).toBeUndefined();
  });

  it('listCompanions returns empty array when no companions exist', async () => {
    const list = await listCompanions();
    expect(list).toEqual([]);
  });
});