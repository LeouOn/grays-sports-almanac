import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const ZIM_NAME = process.env.KIWIX_ZIM || 'wikipedia_en_top_nopic';
const ZIM_DIR = path.join(process.cwd(), 'data', 'zim');
const INDEX_URL = 'https://download.kiwix.org/zim/wikipedia/';

async function findLatestZimUrl(name) {
  const html = await fetch(INDEX_URL).then(r => r.text());
  const matches = [...html.matchAll(/href="(wikipedia_en_top_nopic_\d{4}-\d{2}\.zim)"/g)].map(m => m[1]);
  if (matches.length === 0) throw new Error(`no ${name} files found on the Kiwix index`);
  const latest = matches.sort().at(-1);
  return INDEX_URL + latest;
}

const dest = path.join(ZIM_DIR, `${ZIM_NAME}.zim`);
if (fs.existsSync(dest)) {
  console.log(`[kiwix] ZIM already present: ${dest}`);
} else {
  fs.mkdirSync(ZIM_DIR, { recursive: true });
  const url = process.env.KIWIX_ZIM_URL || (await findLatestZimUrl(ZIM_NAME));
  console.log(`[kiwix] downloading ${url} (~1.1 GB) — this takes a while`);
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`download failed: HTTP ${res.status}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  console.log(`[kiwix] saved to ${dest}`);
}

console.log('\n[kiwix] Next: serve the ZIM with kiwix-serve:');
console.log(`  kiwix-serve --port=8080 "${dest}"`);
console.log('Then start the app — /api/run will use it automatically (KIWIX_URL/KIWIX_ZIM env vars to override).');
