import { tool } from 'ai';
import { z } from 'zod';

export interface WikiSearchResult {
  title: string;
  path: string;
  snippet: string;
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
}

export function htmlToText(html: string, maxChars = 4000): string {
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
  text = decodeEntities(text).replace(/\s+/g, ' ').trim();
  if (text.length <= maxChars) return text;
  const cut = text.slice(0, maxChars);
  return cut.slice(0, cut.lastIndexOf(' ')) + '…';
}

export function parseSearchXml(xml: string): WikiSearchResult[] {
  const results: WikiSearchResult[] = [];

  // Real kiwix-serve /search?format=xml emits RSS (<rss><channel><item>...)
  // with links shaped /content/<bookName>/<Article_Path>. The article path
  // we feed to wikiRead strips the /content/<bookName>/ prefix.
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[1];
    const title = /<title>([\s\S]*?)<\/title>/.exec(block)?.[1];
    const link = /<link>([\s\S]*?)<\/link>/.exec(block)?.[1];
    const snippet = /<description>([\s\S]*?)<\/description>/.exec(block)?.[1] ?? '';
    if (!title || !link) continue;
    const decoded = decodeEntities(link.trim());
    // /content/<book>/<path...> - drop leading empty, 'content', and book.
    const segments = decoded.replace(/^\//, '').split('/').map(seg => decodeURIComponent(seg));
    if (segments.length < 3) continue;
    const articlePath = segments.slice(2).join('/');
    results.push({
      title: decodeEntities(title).trim(),
      path: articlePath,
      snippet: htmlToText(snippet, 300),
    });
  }
  return results;
}

export class KiwixClient {
  // fetchImpl is swappable in tests.
  fetchImpl: typeof fetch = fetch;

  constructor(
    private baseUrl: string = process.env.KIWIX_URL || 'http://localhost:8080',
    private zimName: string = process.env.KIWIX_ZIM || 'wikipedia_en_top_nopic',
  ) {}

  async ping(): Promise<boolean> {
    try {
      const res = await this.fetchImpl(`${this.baseUrl}/catalog/v2/root.xml`, {
        signal: AbortSignal.timeout(2000),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async search(query: string, limit = 5): Promise<WikiSearchResult[]> {
    const url = new URL(`${this.baseUrl}/search`);
    url.searchParams.set('pattern', query);
    url.searchParams.set('books.name', this.zimName);
    url.searchParams.set('pageLength', String(limit));
    url.searchParams.set('format', 'xml');
    const res = await this.fetchImpl(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`kiwix search failed: HTTP ${res.status}`);
    return parseSearchXml(await res.text());
  }

  async readArticle(path: string): Promise<{ title: string; text: string }> {
    const res = await this.fetchImpl(
      `${this.baseUrl}/raw/${this.zimName}/content/A/${encodeURIComponent(path)}`,
      { signal: AbortSignal.timeout(8000) },
    );
    if (!res.ok) throw new Error(`kiwix read failed: HTTP ${res.status}`);
    const html = await res.text();
    const title = /<h1[^>]*>([\s\S]*?)<\/h1>/.exec(html)?.[1];
    return {
      title: title ? htmlToText(title, 200) : path.replace(/_/g, ' '),
      text: htmlToText(html),
    };
  }
}

export function createWikiTools(client: KiwixClient) {
  return {
    wikiSearch: tool({
      description:
        'Search the offline Wikipedia archive for articles. Returns title, path, and snippet. Use before wikiRead.',
      inputSchema: z.object({
        query: z.string().describe('Free-text search, e.g. "1978 World Series"'),
        limit: z.number().int().min(1).max(10).default(5),
      }),
      execute: async ({ query, limit }) => client.search(query, limit),
    }),
    wikiRead: tool({
      description:
        'Read the plain text of a Wikipedia article by its path (from wikiSearch results, without the A/ prefix).',
      inputSchema: z.object({
        path: z.string().describe('Article path, e.g. "Babe_Ruth"'),
      }),
      execute: async ({ path }) => client.readArticle(path),
    }),
  };
}