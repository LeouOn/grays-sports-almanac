# Podcasts — NotebookLM Audio Overviews

Turn an era's almanac into a two-host podcast episode with [NotebookLM](https://notebooklm.google.com), then register it in the app.

## Workflow

1. **Generate the briefing book**

   ```bash
   pnpm briefing -- --era 1980s
   ```

   Produces `data/briefings/1980s-travelers-briefing.md` — a per-era markdown "briefing book" compiled from the archive's curated entries (bets, market moves, headlines, disasters, destinations, safety, blueprints). Use `--era all` to write all six decades.

2. **Upload to NotebookLM**

   Go to [notebooklm.google.com](https://notebooklm.google.com), create a new notebook, click **Add source**, and upload (or paste) the markdown file. One notebook per era keeps sources clean.

3. **Generate the Audio Overview**

   In the notebook, open **Audio Overview** and generate. **Deep Dive** (the two-host conversation) is the fun default; **Customize** lets you steer the focus (e.g. "emphasize the sports bets and the 1987 crash"). Generation takes a few minutes.

4. **Download the MP3 and register it**

   ```bash
   node scripts/add-podcast.mjs --file ~/Downloads/audio-overview.mp3 --title "1980s Briefing" --era 1980s
   ```

   This copies the file to `public/podcasts/` and adds an episode to `public/podcasts/manifest.json`. Optional flags: `--description "<text>"`, `--id <stable-id>` (recommended if you regenerate an episode — re-running with the same `--id` replaces it), `--force` (overwrite a file owned by a different id).

5. **Listen in the app**

   Open `/podcasts` — the episode is listed and playable.

## Notes

- Briefing books are generated output (`data/briefings/` is gitignored); regenerate any time with `pnpm briefing`.
- MP3s and `manifest.json` live under `public/podcasts/` and are committed, so registered episodes ship with the app.
- The briefing's blockquote "voice note" and `## Final Words` closing beat are deliberate — they prime NotebookLM's hosts to stay in-world. Keep them when editing.
