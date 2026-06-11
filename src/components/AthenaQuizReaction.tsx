import athenaStatic from '../data/athena-static.json';

type Performance = 'low' | 'mid' | 'high';

interface AthenaQuizReactionProps {
  tier: number;
  performance: Performance;
  category: string;
}

export function AthenaQuizReaction({ tier, performance, category }: AthenaQuizReactionProps) {
  const reactions = athenaStatic.quizReactions as Record<string, string>;
  const key = `${tier}:${performance}:${category}`;
  const genericKey = `${tier}:${performance}:generic`;

  const reaction = reactions[key] || reactions[genericKey];
  if (!reaction) return null;

  return (
    <div className="flex items-start gap-2 px-3 py-2 mt-2 text-xs italic text-amber-200/80 border-l-2 border-amber-500/40 bg-amber-950/15 rounded-r select-none">
      <span className="font-bold not-italic text-amber-400 uppercase tracking-wider text-[10px] shrink-0">
        Athena
      </span>
      <span>&ldquo;{reaction}&rdquo;</span>
    </div>
  );
}
