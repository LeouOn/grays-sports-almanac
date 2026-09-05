import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PageSkeleton } from '@/components/PageSkeleton';
import { formatActivity } from '@/lib/formatActivity';

export interface PodcastEpisode {
  id: string;
  title: string;
  era: string;
  file: string;
  description: string;
  addedAt: string;
}

interface Manifest {
  episodes: PodcastEpisode[];
}

// Pause every other <audio> on the page when this one starts playing.
// Cheap, dependency-free, and works because the player is the only place
// audio elements get rendered.
function pauseOthers(current: HTMLAudioElement) {
  const audios = document.querySelectorAll<HTMLAudioElement>('audio');
  audios.forEach((a) => {
    if (a !== current) a.pause();
  });
}

export function Podcasts() {
  const [episodes, setEpisodes] = useState<PodcastEpisode[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/podcasts/manifest.json')
      .then((res) => {
        if (!res.ok) throw new Error(`manifest returned ${res.status}`);
        return res.json() as Promise<Manifest>;
      })
      .then((data) => {
        if (cancelled) return;
        setEpisodes(Array.isArray(data.episodes) ? data.episodes : []);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'failed to load manifest');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">🎙️ Audio Briefings</h1>
          <p className="text-neutral-400 mt-1">
            NotebookLM-generated deep dives, compiled from the archive. Listen before you jump.
          </p>
        </div>
        <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-lg flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-red-200">Could not load the podcast manifest</h3>
            <p className="text-sm text-neutral-400 mt-1">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setEpisodes(null);
              // Trigger a fresh fetch by remounting the effect target via location reload-lite:
              // simplest reliable approach is to re-run the effect by reloading the manifest URL.
              fetch('/podcasts/manifest.json')
                .then((res) => {
                  if (!res.ok) throw new Error(`manifest returned ${res.status}`);
                  return res.json() as Promise<Manifest>;
                })
                .then((data) => setEpisodes(Array.isArray(data.episodes) ? data.episodes : []))
                .catch((err: unknown) =>
                  setError(err instanceof Error ? err.message : 'failed to load manifest'),
                );
            }}
            className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition-colors cursor-pointer shrink-0"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (episodes === null) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">🎙️ Audio Briefings</h1>
          <p className="text-neutral-400 mt-1">
            NotebookLM-generated deep dives, compiled from the archive. Listen before you jump.
          </p>
        </div>
        <PageSkeleton />
      </div>
    );
  }

  if (episodes.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">🎙️ Audio Briefings</h1>
          <p className="text-neutral-400 mt-1">
            NotebookLM-generated deep dives, compiled from the archive. Listen before you jump.
          </p>
        </div>
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">No episodes yet</CardTitle>
            <CardDescription className="text-neutral-400">
              Audio briefings live in <code className="px-1 py-0.5 rounded bg-neutral-800 text-neutral-200 text-xs">public/podcasts/</code> and are listed in
              {' '}<code className="px-1 py-0.5 rounded bg-neutral-800 text-neutral-200 text-xs">public/podcasts/manifest.json</code>. Generate one with the pipeline below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="space-y-3 text-sm text-neutral-300 list-decimal list-inside">
              <li>
                Generate a briefing book for an era.
                <pre className="mt-2 ml-5 p-3 rounded bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 overflow-x-auto"><code>pnpm briefing -- --era 1980s</code></pre>
              </li>
              <li>
                Upload the resulting markdown to NotebookLM as a source and download the Audio Overview MP3.
              </li>
              <li>
                Register the MP3 with the registrar (copies it into <code className="px-1 py-0.5 rounded bg-neutral-800 text-neutral-200 text-xs">public/podcasts/</code> and prepends an entry to the manifest).
                <pre className="mt-2 ml-5 p-3 rounded bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 overflow-x-auto"><code>node scripts/add-podcast.mjs --file ~/Downloads/1980s.mp3 --title "1980s Traveler's Briefing" --era 1980s</code></pre>
              </li>
              <li>Reload this page — your episode will appear at the top of the list.</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">🎙️ Audio Briefings</h1>
        <p className="text-neutral-400 mt-1">
          NotebookLM-generated deep dives, compiled from the archive. Listen before you jump.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {episodes.map((episode) => (
          <Card key={episode.id} className="bg-neutral-900 border-neutral-800 hover:border-indigo-800/50 transition-colors">
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <CardTitle className="text-white text-lg">{episode.title}</CardTitle>
                <span className="px-2.5 py-1 rounded-full bg-indigo-600/20 border border-indigo-500/60 text-indigo-300 text-[11px] font-semibold shrink-0">
                  {episode.era}
                </span>
              </div>
              {episode.description && (
                <CardDescription className="text-neutral-400">{episode.description}</CardDescription>
              )}
              <div className="text-xs text-neutral-500 mt-1">Added {formatActivity(episode.addedAt)}</div>
            </CardHeader>
            <CardContent>
              {/* preload="none" so we don't burn bandwidth until the user hits play */}
              <audio
                controls
                preload="none"
                src={episode.file}
                className="w-full"
                onPlay={(e) => pauseOthers(e.currentTarget)}
              >
                <track kind="captions" />
                Your browser does not support the audio element.
              </audio>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
