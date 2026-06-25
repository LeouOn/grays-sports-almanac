import { listCompanions, createCompanion } from './companionService';

export interface CompanionExport {
  version: 1;
  exportedAt: number;
  companions: Array<{
    name: string;
    prompt: string;
    avatar: string;
    styleTags: string[];
  }>;
}

/**
 * Exports all custom companions as a JSON string.
 */
export async function exportCompanions(): Promise<string> {
  const companions = await listCompanions();
  const data: CompanionExport = {
    version: 1,
    exportedAt: Date.now(),
    companions: companions.map((c) => ({
      name: c.name,
      prompt: c.prompt,
      avatar: c.avatar,
      styleTags: c.styleTags,
    })),
  };
  return JSON.stringify(data, null, 2);
}

/**
 * Exports a single companion as JSON.
 */
export async function exportCompanion(id: string): Promise<string> {
  const { getCompanion } = await import('./companionService');
  const companion = await getCompanion(id);
  if (!companion) throw new Error(`Companion ${id} not found`);

  const data: CompanionExport = {
    version: 1,
    exportedAt: Date.now(),
    companions: [
      {
        name: companion.name,
        prompt: companion.prompt,
        avatar: companion.avatar,
        styleTags: companion.styleTags,
      },
    ],
  };
  return JSON.stringify(data, null, 2);
}

/**
 * Imports companions from a JSON string.
 * Returns the count of successfully imported companions.
 * Skips invalid entries (logs warning).
 */
export async function importCompanions(json: string): Promise<number> {
  let data: CompanionExport;
  try {
    data = JSON.parse(json);
  } catch {
    throw new Error('Invalid JSON format');
  }

  if (!data.companions || !Array.isArray(data.companions)) {
    throw new Error('Invalid companion file: missing companions array');
  }

  let count = 0;
  for (const companion of data.companions) {
    if (!companion.name || !companion.prompt) {
      continue; // Skip invalid entries
    }
    await createCompanion({
      name: companion.name,
      prompt: companion.prompt,
      avatar: companion.avatar || '🎭',
      styleTags: companion.styleTags || [],
    });
    count++;
  }

  return count;
}

/**
 * Triggers a browser download of the JSON file.
 */
export function downloadJSON(json: string, filename: string): void {
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}