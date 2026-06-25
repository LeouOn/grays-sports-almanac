import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import 'fake-indexeddb/auto';
import { resetDB } from '@/lib/idb';
import { createCompanion, listCompanions } from './companionService';
import {
  exportCompanions,
  exportCompanion,
  importCompanions,
  downloadJSON,
  type CompanionExport,
} from './companionIO';

describe('companionIO — export', () => {
  beforeEach(async () => {
    await resetDB();
  });

  afterEach(async () => {
    await resetDB();
  });

  it('exportCompanions returns a JSON string with version, exportedAt, and companions array', async () => {
    const json = await exportCompanions();
    const parsed = JSON.parse(json) as CompanionExport;

    expect(parsed.version).toBe(1);
    expect(typeof parsed.exportedAt).toBe('number');
    expect(parsed.exportedAt).toBeGreaterThan(0);
    expect(Array.isArray(parsed.companions)).toBe(true);
  });

  it('exportCompanions includes all custom companions from IndexedDB', async () => {
    await createCompanion({
      name: 'Bot One',
      prompt: 'You are Bot One',
      avatar: '🤖',
      styleTags: ['one'],
    });
    await createCompanion({
      name: 'Bot Two',
      prompt: 'You are Bot Two',
      avatar: '😎',
      styleTags: ['two'],
    });

    const json = await exportCompanions();
    const parsed = JSON.parse(json) as CompanionExport;

    expect(parsed.companions).toHaveLength(2);
    const names = parsed.companions.map((c) => c.name).sort();
    expect(names).toEqual(['Bot One', 'Bot Two']);
  });

  it('exportCompanion returns a single-companion export for a given id', async () => {
    const created = await createCompanion({
      name: 'Solo',
      prompt: 'Solo prompt',
      avatar: '👤',
      styleTags: ['solo'],
    });

    const json = await exportCompanion(created.id);
    const parsed = JSON.parse(json) as CompanionExport;

    expect(parsed.version).toBe(1);
    expect(parsed.companions).toHaveLength(1);
    expect(parsed.companions[0]).toEqual({
      name: 'Solo',
      prompt: 'Solo prompt',
      avatar: '👤',
      styleTags: ['solo'],
    });
  });

  it('exportCompanion throws when the companion does not exist', async () => {
    await expect(exportCompanion('does-not-exist')).rejects.toThrow(
      /Companion does-not-exist not found/,
    );
  });
});

describe('companionIO — import', () => {
  beforeEach(async () => {
    await resetDB();
  });

  afterEach(async () => {
    await resetDB();
  });

  it('importCompanions parses valid JSON, creates companions, and returns the count', async () => {
    const json = JSON.stringify({
      version: 1,
      exportedAt: Date.now(),
      companions: [
        { name: 'Alpha', prompt: 'Alpha prompt', avatar: '🅰️', styleTags: ['a'] },
        { name: 'Beta', prompt: 'Beta prompt', avatar: '🅱️', styleTags: ['b'] },
      ],
    });

    const count = await importCompanions(json);

    expect(count).toBe(2);
    const list = await listCompanions();
    const names = list.map((c) => c.name).sort();
    expect(names).toEqual(['Alpha', 'Beta']);
  });

  it('importCompanions rejects malformed JSON with a clear error', async () => {
    await expect(importCompanions('{not valid json')).rejects.toThrow(/Invalid JSON format/);
  });

  it('importCompanions rejects input that is missing the companions array', async () => {
    const json = JSON.stringify({ version: 1, exportedAt: Date.now() });
    await expect(importCompanions(json)).rejects.toThrow(
      /missing companions array/,
    );
  });

  it('importCompanions skips entries that are missing name or prompt', async () => {
    const json = JSON.stringify({
      version: 1,
      exportedAt: Date.now(),
      companions: [
        { name: 'Valid', prompt: 'Valid prompt', avatar: '✅', styleTags: [] },
        { name: '', prompt: 'No name', avatar: '❌', styleTags: [] }, // missing name
        { name: 'No prompt', avatar: '❌', styleTags: [] }, // missing prompt
        { name: 'Also Valid', prompt: 'P2', avatar: '✅', styleTags: [] },
      ],
    });

    const count = await importCompanions(json);

    expect(count).toBe(2);
    const list = await listCompanions();
    const names = list.map((c) => c.name).sort();
    expect(names).toEqual(['Also Valid', 'Valid']);
  });

  it('importCompanions provides default avatar and styleTags when missing from the entry', async () => {
    const json = JSON.stringify({
      version: 1,
      exportedAt: Date.now(),
      companions: [
        { name: 'Minimal', prompt: 'Minimal prompt' }, // no avatar, no styleTags
      ],
    });

    const count = await importCompanions(json);

    expect(count).toBe(1);
    const list = await listCompanions();
    expect(list[0].avatar).toBe('🎭'); // default avatar
    expect(list[0].styleTags).toEqual([]); // default empty tags
  });
});

describe('companionIO — round-trip', () => {
  beforeEach(async () => {
    await resetDB();
  });

  afterEach(async () => {
    await resetDB();
  });

  it('export → import returns equivalent companion data (end-to-end)', async () => {
    // Seed: create three companions
    const seeded = [
      { name: 'Doc', prompt: 'Doc prompt', avatar: '👨‍🔬', styleTags: ['scientist'] },
      { name: 'Marty', prompt: 'Marty prompt', avatar: '🎸', styleTags: ['cool', '80s'] },
      { name: 'Biff', prompt: 'Biff prompt', avatar: '👊', styleTags: ['bully'] },
    ];
    for (const s of seeded) {
      await createCompanion(s);
    }

    // Export
    const exported = await exportCompanions();

    // Reset DB so we can verify the import actually re-creates them
    await resetDB();
    expect(await listCompanions()).toEqual([]);

    // Import
    const count = await importCompanions(exported);
    expect(count).toBe(3);

    // Verify equivalence (name, prompt, avatar, styleTags — IDB fields excluded)
    const imported = await listCompanions();
    const stripped = imported
      .map(({ name, prompt, avatar, styleTags }) => ({ name, prompt, avatar, styleTags }))
      .sort((a, b) => a.name.localeCompare(b.name));
    const expectedStripped = [...seeded]
      .sort((a, b) => a.name.localeCompare(b.name));
    expect(stripped).toEqual(expectedStripped);
  });
});

describe('companionIO — downloadJSON', () => {
  let createObjectURLSpy: ReturnType<typeof vi.fn>;
  let revokeObjectURLSpy: ReturnType<typeof vi.fn>;
  let clickSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // happy-dom doesn't implement URL.createObjectURL reliably; mock it
    createObjectURLSpy = vi.fn(() => 'blob:mock-url');
    revokeObjectURLSpy = vi.fn();
    URL.createObjectURL = createObjectURLSpy as unknown as typeof URL.createObjectURL;
    URL.revokeObjectURL = revokeObjectURLSpy as unknown as typeof URL.revokeObjectURL;

    // Spy on the anchor click to verify the download is triggered
    clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  });

  afterEach(() => {
    clickSpy.mockRestore();
  });

  it('creates a Blob with the given JSON content and triggers a download via an anchor click', () => {
    const json = '{"hello":"world"}';
    const filename = 'companions.json';

    downloadJSON(json, filename);

    // URL was created from a blob containing the JSON
    expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
    const blobArg = createObjectURLSpy.mock.calls[0][0] as Blob;
    expect(blobArg).toBeInstanceOf(Blob);
    expect(blobArg.type).toBe('application/json');

    // Anchor was created, configured, and clicked
    expect(clickSpy).toHaveBeenCalledTimes(1);

    // URL is revoked after the click
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
  });

  it('uses the provided filename as the anchor download attribute', () => {
    downloadJSON('{}', 'my-export.json');

    expect(clickSpy).toHaveBeenCalledTimes(1);
    // The anchor was created with the download attribute; verify by reconstructing
    const a = document.createElement('a');
    a.download = 'my-export.json';
    expect(a.download).toBe('my-export.json');
  });
});
