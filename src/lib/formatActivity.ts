// Shared date formatters used by pages that surface activity timestamps.
// Extracted from Progress.tsx so Podcasts.tsx can format addedAt the same way
// without re-implementing the locale call.
export function formatActivity(date: string | null | undefined): string {
  if (!date) return '—';
  try {
    return new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return date;
  }
}
