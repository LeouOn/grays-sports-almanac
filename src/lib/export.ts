/**
 * Client-side data export utilities using Blob + URL.createObjectURL.
 */

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function escapeCSVValue(value: unknown): string {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Exports an array of objects as a CSV file download.
 * Headers are derived from the keys of the first object.
 */
export function exportToCSV(
  data: Record<string, unknown>[],
  filename: string,
): void {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows: string[] = [];

  csvRows.push(headers.map(escapeCSVValue).join(','));

  for (const row of data) {
    csvRows.push(
      headers.map((h) => escapeCSVValue(row[h])).join(','),
    );
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
}

/**
 * Exports any data structure as a JSON file download.
 */
export function exportToJSON(data: unknown, filename: string): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], {
    type: 'application/json;charset=utf-8;',
  });
  downloadBlob(blob, filename);
}
