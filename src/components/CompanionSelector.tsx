import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { ChevronDown, Settings } from 'lucide-react';
import { defaultCompanions } from '@/data/companions';
import { listCompanions } from '@/services/companionService';
import { type CustomCompanion } from '@/lib/idb';
import { useCompanion } from '@/context/CompanionContext';

export function CompanionSelector() {
  const { activeCompanion, selectCompanion, selectCustomCompanion } = useCompanion();
  const [open, setOpen] = useState(false);
  const [customCompanions, setCustomCompanions] = useState<CustomCompanion[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  // Load custom companions when dropdown opens
  useEffect(() => {
    if (open) {
      listCompanions()
        .then(setCustomCompanions)
        .catch(() => setCustomCompanions([]));
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  const isActiveDefault = (id: string) =>
    activeCompanion.id === id;
  const isActiveCustom = (id: string) =>
    activeCompanion.id === id;

  const handleSelectDefault = (id: string) => {
    selectCompanion(id);
    setOpen(false);
  };

  const handleSelectCustom = (companion: CustomCompanion) => {
    selectCustomCompanion(companion);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2.5 rounded-full border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 text-neutral-400 hover:text-white text-xs transition-all cursor-pointer select-none"
        aria-label={`Active Companion: ${activeCompanion.name}. Click to change.`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="text-sm">{activeCompanion.avatar}</span>
        <span className="hidden sm:inline font-semibold">{activeCompanion.name}</span>
        <ChevronDown className={`size-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          aria-label="Select a companion"
          className="absolute right-0 top-full mt-2 w-72 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in zoom-in-95 duration-150 origin-top-right"
        >
          {/* Default companions */}
          <div className="p-2">
            <p className="px-2 py-1 text-[10px] font-bold tracking-wider text-neutral-500 uppercase">
              Default Companions
            </p>
            {defaultCompanions.map((c) => {
              const isActive = isActiveDefault(c.id);
              return (
                <button
                  key={c.id}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => handleSelectDefault(c.id)}
                  className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-indigo-950/30 border border-indigo-500/30'
                      : 'hover:bg-neutral-800/50 border border-transparent'
                  }`}
                >
                  <span className="text-xl shrink-0">{c.avatar}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-neutral-200 truncate">
                      {c.name}
                    </div>
                    <div className="text-[10px] text-neutral-500 truncate">
                      {c.description}
                    </div>
                  </div>
                  {isActive && (
                    <span className="shrink-0 px-1.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-[9px] font-semibold text-indigo-400">
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Custom companions */}
          {customCompanions.length > 0 && (
            <div className="p-2 border-t border-neutral-800">
              <p className="px-2 py-1 text-[10px] font-bold tracking-wider text-neutral-500 uppercase">
                Custom Companions
              </p>
              {customCompanions.map((c) => {
                const isActive = isActiveCustom(c.id);
                return (
                  <button
                    key={c.id}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => handleSelectCustom(c)}
                    className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-indigo-950/30 border border-indigo-500/30'
                        : 'hover:bg-neutral-800/50 border border-transparent'
                    }`}
                  >
                    <span className="text-xl shrink-0">{c.avatar || '🤖'}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-neutral-200 truncate">
                        {c.name}
                      </div>
                      <div className="text-[10px] text-neutral-500 truncate">
                        {c.styleTags.slice(0, 3).join(', ') || 'Custom'}
                      </div>
                    </div>
                    {isActive && (
                      <span className="shrink-0 px-1.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-[9px] font-semibold text-indigo-400">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Manage link */}
          <div className="border-t border-neutral-800 p-2">
            <Link
              to="/companions"
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-colors"
            >
              <Settings className="size-3.5" />
              Manage Companions
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
