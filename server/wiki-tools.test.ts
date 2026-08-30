import { describe, it, expect } from 'vitest';
import { parseSearchXml, htmlToText, KiwixClient, createWikiTools } from './wiki-tools.js';

const SEARCH_XML = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:opensearch="http://a9.com/-/spec/opensearch/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Search: Miracle on Ice</title>
    <link>/search?pattern=Miracle%20on%20Ice&amp;format=xml</link>
    <description>Search result for Miracle on Ice</description>
    <item>
      <title>Miracle on Ice</title>
      <link>/content/wikipedia_en_top_mini_2026-06/Miracle_on_Ice</link>
      <description><b>on</b> <b>Ice</b> 1980 Winter Olympics in Lake Placid...</description>
      <book><title>Best of Wikipedia</title></book>
      <wordCount>499</wordCount>
    </item>
    <item>
      <title>1980 Winter Olympics</title>
      <link>/content/wikipedia_en_top_mini_2026-06/1980_Winter_Olympics</link>
      <description>International multi-sport event held in the United States.</description>
      <book><title>Best of Wikipedia</title></book>
      <wordCount>1100</wordCount>
    </item>
  </channel>
</rss>`;

describe('parseSearchXml (live RSS shape)', () => {
  it('extracts title, path (without book prefix), and snippet from <item> blocks', () => {
    const results = parseSearchXml(SEARCH_XML);
    expect(results).toHaveLength(2);
    expect(results[0]).toEqual({
      title: 'Miracle on Ice',
      path: 'Miracle_on_Ice',
      snippet: 'on Ice 1980 Winter Olympics in Lake Placid...',
    });
  });

  it('returns [] on malformed xml', () => {
    expect(parseSearchXml('not xml at all')).toEqual([]);
  });

  it('decodes percent-encoding in the article path', () => {
    const xml = `<rss><channel><item><title>X</title><link>/content/foo/Babe%20Ruth</link><description></description></item></channel></rss>`;
    expect(parseSearchXml(xml)).toEqual([{ title: 'X', path: 'Babe Ruth', snippet: '' }]);
  });
});

describe('htmlToText', () => {
  it('strips tags, scripts, styles and collapses whitespace', () => {
    const html = '<html><head><style>body{color:red}</style><script>var x=1;</script></head>' +
      '<body><h1>Title</h1><p>Hello <b>bold</b>   world &amp; friends</p></body></html>';
    expect(htmlToText(html)).toBe('Title Hello bold world & friends');
  });

  it('truncates to maxChars on a word boundary', () => {
    const long = '<p>' + 'word '.repeat(2000) + '</p>';
    const out = htmlToText(long, 100);
    expect(out.length).toBeLessThanOrEqual(101); // 100 + ellipsis
    expect(out.endsWith('…')).toBe(true);
  });
});

describe('KiwixClient', () => {
  it('ping returns false when server unreachable', async () => {
    const client = new KiwixClient('http://127.0.0.1:59999', 'test_zim');
    expect(await client.ping()).toBe(false);
  });

  it('search hits /search with format=xml and books.name', async () => {
    const calls: string[] = [];
    const client = new KiwixClient('http://fake', 'my_zim');
    (client as unknown as { fetchImpl: typeof fetch }).fetchImpl = async (url: unknown) => {
      calls.push(String(url));
      return new Response(SEARCH_XML, { status: 200 });
    };
    const results = await client.search('Babe Ruth', 3);
    expect(calls[0]).toContain('/search?');
    expect(calls[0]).toContain('pattern=Babe+Ruth');
    expect(calls[0]).toContain('books.name=my_zim');
    expect(calls[0]).toContain('format=xml');
    expect(calls[0]).toContain('pageLength=3');
    expect(results[0].path).toBe('Miracle_on_Ice');
  });

  it('readArticle fetches /raw/{zim}/content/A/{path} and returns text', async () => {
    const client = new KiwixClient('http://fake', 'my_zim');
    (client as unknown as { fetchImpl: typeof fetch }).fetchImpl = async (url: unknown) => {
      expect(String(url)).toBe('http://fake/raw/my_zim/content/A/Babe_Ruth');
      return new Response('<html><body><h1>Babe Ruth</h1><p>George Herman Ruth Jr.</p></body></html>', { status: 200 });
    };
    const article = await client.readArticle('Babe_Ruth');
    expect(article.title).toBe('Babe Ruth');
    expect(article.text).toContain('George Herman Ruth Jr.');
  });
});

describe('createWikiTools', () => {
  it('wikiSearch.execute delegates to client.search', async () => {
    const client = new KiwixClient('http://fake', 'zim');
    client.search = async (q: string) => [{ title: 'T', path: 'P', snippet: q }];
    const tools = createWikiTools(client);
    const out = await tools.wikiSearch.execute!(
      { query: '1978 World Series', limit: 5 },
      { toolCallId: 't1', messages: [] },
    );
    expect(out).toEqual([{ title: 'T', path: 'P', snippet: '1978 World Series' }]);
  });
});