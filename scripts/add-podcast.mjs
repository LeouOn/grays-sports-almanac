#!/usr/bin/env node
// Podcast registrar. Copies a downloaded NotebookLM Audio Overview MP3 into
// public/podcasts/ and registers it in manifest.json so the app's /podcasts
// view lists and plays it. Idempotent by --id: re-running with an existing id
// replaces that episode entry and re-copies the file.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const USAGE = `Usage: node scripts/add-podcast.mjs --file <path-to-mp3> --title "<title>" --era <1950s|...|2000s> [--description "<desc>"] [--id <id>] [--force]
  --file        path to the downloaded MP3 (required)
  --title       episode title shown in the app (required)
  --era         one of 1950s|1960s|1970s|1980s|1990s|2000s (required)
  --description optional episode description (default "")
  --id          optional stable id; defaults to a slug of the title
  --force       overwrite an existing destination file
Registers the episode in public/podcasts/manifest.json. Re-running with an
existing --id updates that episode in place.`;

const ERAS = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s'];

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i < 0 ? undefined : process.argv[i + 1];
}

function fail(message) {
  console.error(`error: ${message}`);
  console.error(USAGE);
  process.exit(1);
}

const file = arg('file');
const title = arg('title');
const era = arg('era');
const description = arg('description') ?? '';
const idArg = arg('id');
const force = process.argv.includes('--force');

if (!file || !title || !era) fail('missing required --file, --title or --era');
if (!ERAS.includes(era)) fail(`invalid --era "${era}" (expected one of ${ERAS.join('|')})`);
if (!existsSync(file)) fail(`file not found: ${file}`);
if (path.extname(file).toLowerCase() !== '.mp3') fail(`not an .mp3 file: ${file}`);

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const id = idArg ?? slugify(title);
const name = slugify(id);
if (!name) fail('could not derive a slug from --id/--title');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destDir = path.join(root, 'public', 'podcasts');
const dest = path.join(destDir, `${name}.mp3`);
const relDest = path.join('public', 'podcasts', `${name}.mp3`);
const manifestPath = path.join(destDir, 'manifest.json');

let manifest = { episodes: [] };
if (existsSync(manifestPath)) {
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  } catch (err) {
    fail(`could not parse ${manifestPath}: ${err.message}`);
  }
}
if (!Array.isArray(manifest.episodes)) fail(`${manifestPath} has no "episodes" array`);

const existingIndex = manifest.episodes.findIndex(ep => ep.id === id);
const updating = existingIndex >= 0;
if (existsSync(dest) && !force && !updating) {
  fail(`${relDest} already exists (different episode owns that name); pass --force to overwrite`);
}

const episode = {
  id,
  title,
  era,
  file: `podcasts/${name}.mp3`,
  description,
  addedAt: new Date().toISOString(),
};

mkdirSync(destDir, { recursive: true });
copyFileSync(file, dest);
if (updating) {
  manifest.episodes[existingIndex] = episode;
} else {
  manifest.episodes.unshift(episode);
}
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`${updating ? 'updated' : 'registered'} "${title}" (${era})`);
console.log(`  audio:    ${relDest}`);
console.log(`  manifest: public/podcasts/manifest.json (${manifest.episodes.length} episodes)`);
