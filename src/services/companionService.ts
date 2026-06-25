import { openDB, type CustomCompanion } from '@/lib/idb';

export interface CompanionInput {
  name: string;
  prompt: string;
  avatar: string;
  styleTags: string[];
}

function generateId(): string {
  return `companion-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function createCompanion(input: CompanionInput): Promise<CustomCompanion> {
  const now = Date.now();
  const companion: CustomCompanion = {
    id: generateId(),
    name: input.name,
    prompt: input.prompt,
    avatar: input.avatar,
    styleTags: input.styleTags,
    createdAt: now,
    updatedAt: now,
  };
  const db = await openDB();
  await db.put('custom_companions', companion);
  return companion;
}

export async function getCompanion(id: string): Promise<CustomCompanion | undefined> {
  const db = await openDB();
  return db.get('custom_companions', id);
}

export async function listCompanions(): Promise<CustomCompanion[]> {
  const db = await openDB();
  const all = await db.getAllFromIndex('custom_companions', 'createdAt');
  return all.reverse(); // newest first
}

export async function updateCompanion(
  id: string,
  updates: Partial<CompanionInput>,
): Promise<CustomCompanion> {
  const db = await openDB();
  const existing = await db.get('custom_companions', id);
  if (!existing) throw new Error(`Companion ${id} not found`);

  const updated: CustomCompanion = {
    ...existing,
    ...updates,
    updatedAt: Date.now(),
  };
  await db.put('custom_companions', updated);
  return updated;
}

export async function deleteCompanion(id: string): Promise<void> {
  const db = await openDB();
  await db.delete('custom_companions', id);
}

export async function searchCompanions(query: string): Promise<CustomCompanion[]> {
  const all = await listCompanions();
  const lowerQuery = query.toLowerCase();
  return all.filter(
    (c) =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.styleTags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
  );
}