# Offline Wikipedia (Kiwix) for The Run

The Run's knowledge checks ground questions in a local Wikipedia ZIM via kiwix-serve.

## Setup

1. `pnpm kiwix:setup` — downloads `wikipedia_en_top_nopic` (~1.1 GB, top-50k articles) to `data/zim/`.
2. Install kiwix-serve (Windows): `winget install Kiwix.KiwixServe` or download from https://download.kiwix.org/release/kiwix-tools/
3. Serve: `kiwix-serve --port=8080 data/zim/wikipedia_en_top_nopic.zim`
4. Start the app normally. Env overrides: `KIWIX_URL` (default `http://localhost:8080`), `KIWIX_ZIM` (default `wikipedia_en_top_nopic`).

Without kiwix-serve running, the game degrades to curated-only mode — fully playable, knowledge checks come from the built-in almanac instead of Wikipedia.
