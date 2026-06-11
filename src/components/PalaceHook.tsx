import athenaStatic from '../data/athena-static.json';

interface PalaceHookProps {
  routeId: string;
}

export function PalaceHook({ routeId }: PalaceHookProps) {
  const mnemonic = (athenaStatic.mnemonics as Record<string, string>)[routeId];
  if (!mnemonic) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 mt-2 text-xs italic text-indigo-300 border-l-2 border-indigo-500/40 bg-indigo-950/20 rounded-r select-none">
      <span className="font-bold not-italic text-indigo-400 uppercase tracking-wider text-[10px]">
        Hook:
      </span>
      <span>&ldquo;{mnemonic}&rdquo;</span>
    </div>
  );
}
