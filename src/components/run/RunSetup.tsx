import { useState } from 'react';

const ERAS = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s'];

export function RunSetup({ onStart, loading }: { onStart: (era: string) => void; loading: boolean }) {
  const [era, setEra] = useState('1980s');
  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">The Run</h1>
        <p className="text-neutral-400">Choose your destination, traveler. Survive 10 beats, grow your capital, and retire before the timeline notices you.</p>
      </div>
      <div className="grid grid-cols-3 gap-2" role="group" aria-label="Destination era">
        {ERAS.map(e => (
          <button
            key={e}
            onClick={() => setEra(e)}
            aria-pressed={era === e}
            className={`py-3 rounded-lg border text-sm font-semibold transition-colors cursor-pointer ${era === e ? 'bg-indigo-600/20 border-indigo-500/60 text-indigo-300' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'}`}
          >
            {e}
          </button>
        ))}
      </div>
      <button
        onClick={() => onStart(era)}
        disabled={loading}
        className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold transition-colors cursor-pointer"
      >
        {loading ? 'Jumping…' : `Jump to the ${era} ⚡`}
      </button>
    </div>
  );
}