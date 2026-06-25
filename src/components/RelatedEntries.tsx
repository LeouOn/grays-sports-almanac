import { useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { sportsAlmanac } from '@/data/sports';
import { financialAlmanac } from '@/data/finance';
import { eraGuideData } from '@/data/era-guide';
import { disasterAlmanac } from '@/data/disasters';
import { techTransferTargets } from '@/data/tech-transfer';
import { medicalInterventions } from '@/data/medical';
import { safetyProtocols } from '@/data/safety';
import { blueprintsData } from '@/data/blueprints';
import { ArrowUpRight } from 'lucide-react';
import { BookmarkButton } from '@/components/BookmarkButton';

interface LinkCard {
  module: string;
  moduleRoute: string;
  title: string;
  subtitle: string;
  link: string;
}

interface RelatedEntriesProps {
  tags: string[];
  excludeId?: string;
  /** Called with matched entries after scanning all modules. Lets parents react to matches (e.g. show PalaceLink). */
  onMatch?: (matches: LinkCard[]) => void;
}

export function RelatedEntries({ tags, excludeId, onMatch }: RelatedEntriesProps) {
  const prevKeyRef = useRef('');

  const matches = useMemo(() => {
    if (!tags || tags.length === 0) return [];

    const result: LinkCard[] = [];

    const addIfMatch = (
      module: string,
      moduleRoute: string,
      entry: { id: string; tags?: string[] },
      title: string,
      subtitle: string,
      link: string
    ) => {
      if (excludeId && entry.id === excludeId) return;
      if (!entry.tags || entry.tags.length === 0) return;
      if (entry.tags.some(t => tags.includes(t))) {
        result.push({ module, moduleRoute, title, subtitle, link });
      }
    };

    type Tagged = { id: string; tags?: string[] };

    // Search all modules
    sportsAlmanac.forEach(e => addIfMatch('Sports', '/sports', e as Tagged, `${e.event} (${e.year})`, `${e.sport} · ${e.winner}`, '/sports'));
    financialAlmanac.forEach(e => addIfMatch('Finance', '/finance', e as Tagged, `${e.event} (${e.date})`, e.category, '/finance'));
    eraGuideData.forEach(e => addIfMatch('Era Guide', '/era-guide', e as Tagged, `${e.item}`, `${e.category} · ${e.era}`, '/era-guide'));
    disasterAlmanac.forEach(e => addIfMatch('Disasters', '/disasters', e as Tagged, `${e.event} (${e.date})`, e.location, '/disasters'));
    techTransferTargets.forEach(e => addIfMatch('Tech Transfer', '/tech-transfer', e as Tagged, e.concept, `Recipient: ${e.targetRecipient}`, '/tech-transfer'));
    medicalInterventions.forEach(e => addIfMatch('Medical', '/medical', e as Tagged, e.condition, `Optimal: ${e.optimalYear}`, '/medical'));
    safetyProtocols.forEach(e => addIfMatch('Safety', '/safety', e as Tagged, e.title, e.category, '/safety'));
    blueprintsData.forEach(e => addIfMatch('Blueprints', '/blueprints', e as Tagged, e.title, `${e.category} · ${e.difficulty}`, '/blueprints'));

    return result;
  }, [tags, excludeId]);

  // Fire onMatch once per unique match set
  useEffect(() => {
    if (!onMatch || matches.length === 0) return;
    const key = matches.map(m => m.title).join('|');
    if (key === prevKeyRef.current) return;
    prevKeyRef.current = key;
    onMatch(matches);
  }, [matches, onMatch]);

  if (matches.length === 0) return null;

  // Group by module
  const grouped = matches.reduce((acc, m) => {
    if (!acc[m.module]) acc[m.module] = [];
    acc[m.module].push(m);
    return acc;
  }, {} as Record<string, LinkCard[]>);

  return (
    <div className="mt-4 pt-4 border-t border-neutral-800/60">
      <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
        🔗 Related Knowledge
      </div>
      <div className="space-y-2">
        {Object.entries(grouped).map(([module, items]) => (
          <div key={module} className="space-y-1">
            <Link
              to={items[0].moduleRoute}
              className="text-[10px] font-semibold text-indigo-400/80 hover:text-indigo-300 transition-colors"
            >
              {module} →
            </Link>
            <div className="flex flex-wrap gap-1.5">
              {items.slice(0, 4).map((item, i) => (
                <div key={i} className="inline-flex items-center gap-1">
                  <Link
                    to={item.link}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-neutral-900 border border-neutral-800 hover:border-indigo-700/50 hover:bg-neutral-850 transition-all text-[11px] text-neutral-300 hover:text-white group"
                  >
                    <span className="truncate max-w-[180px]">{item.title}</span>
                    <ArrowUpRight className="size-2.5 text-neutral-600 group-hover:text-indigo-400 shrink-0" />
                  </Link>
                  <BookmarkButton module={item.module} entryId={item.title} title={item.title} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
