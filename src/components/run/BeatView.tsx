import { useState } from 'react';
import type { Beat } from '@/hooks/useRun';

export function BeatView({ beat, correct, onChoose, onAnswer, onAdvance, busy }: {
  beat: Beat;
  correct: boolean | null;
  onChoose: (choiceId: string) => void;
  onAnswer: (idx: number) => void;
  onAdvance: () => void;
  busy: boolean;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const kc = beat.knowledgeCheck;

  return (
    <div className="space-y-4">
      <div>
        <div className="text-[10px] uppercase tracking-wider text-indigo-400 mb-1">
          Beat {beat.index + 1} · {beat.type.replace('_', ' ')}
        </div>
        <h2 className="text-xl font-bold text-white">{beat.title}</h2>
        <p className="text-neutral-300 mt-2 leading-relaxed">{beat.narrative}</p>
      </div>

      {kc ? (
        <div className="space-y-2">
          <p className="font-semibold text-neutral-200">{kc.question}</p>
          {kc.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => { setPicked(i); onAnswer(i); }}
              disabled={busy || picked !== null}
              className={`w-full text-left p-3 rounded-lg border text-sm transition-colors cursor-pointer ${
                picked === null
                  ? 'bg-neutral-900 border-neutral-800 hover:border-indigo-600 text-neutral-200'
                  : i === kc.correctIndex
                    ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300'
                    : picked === i
                      ? 'bg-red-950/40 border-red-600/50 text-red-300'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-500'
              }`}
            >
              {opt}
            </button>
          ))}
          {correct !== null && (
            <p className={`text-sm ${correct ? 'text-emerald-400' : 'text-red-400'}`}>
              {correct ? 'Correct — the locals buy your cover.' : 'Wrong — a few eyebrows rise.'} (Source: {kc.sourceArticle})
            </p>
          )}
          {correct !== null && (
            <button
              onClick={onAdvance}
              disabled={busy}
              className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors cursor-pointer disabled:opacity-50"
            >
              Continue →
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {beat.choices.map(c => (
            <button
              key={c.id}
              onClick={() => onChoose(c.id)}
              disabled={busy}
              className="w-full text-left p-3 rounded-lg border bg-neutral-900 border-neutral-800 hover:border-indigo-600 text-neutral-200 text-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {c.text}
            </button>
          ))}
        </div>
      )}

      {beat.companionQuip && (
        <p className="text-sm italic text-purple-300/80 border-l-2 border-purple-800 pl-3">
          {beat.companionQuip}
        </p>
      )}
    </div>
  );
}