import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Cpu, Cog, Wrench, Radio, FlaskConical, Plane, Search, Tag, CheckCircle2, Download } from 'lucide-react';
import { loadEngineering } from '@/data/loader';
import type { EngineeringSpec, ConfidenceLevel } from '@/data/engineering';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PageSkeleton } from '@/components/PageSkeleton';
import { showError } from '@/lib/toast';
import { exportToCSV } from '@/lib/export';
import { RelatedEntries } from '@/components/RelatedEntries';

const SUB_DOMAINS = ['cnc_machining', 'semiconductors', 'metallurgy', 'aerospace', 'telecommunications'] as const;
const ERAS = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s'] as const;
type SubDomain = typeof SUB_DOMAINS[number];
type Era = typeof ERAS[number];

const SUB_DOMAIN_LABELS: Record<SubDomain, string> = {
  cnc_machining: 'CNC Machining',
  semiconductors: 'Semiconductors',
  metallurgy: 'Metallurgy',
  aerospace: 'Aerospace',
  telecommunications: 'Telecommunications',
};

const SUB_DOMAIN_ICONS: Record<SubDomain, React.ReactNode> = {
  cnc_machining: <Cog className="size-3" />,
  semiconductors: <Cpu className="size-3" />,
  metallurgy: <FlaskConical className="size-3" />,
  aerospace: <Plane className="size-3" />,
  telecommunications: <Radio className="size-3" />,
};

const SUB_DOMAIN_COLORS: Record<SubDomain, string> = {
  cnc_machining: 'bg-emerald-500/20 text-emerald-300',
  semiconductors: 'bg-indigo-500/20 text-indigo-300',
  metallurgy: 'bg-amber-500/20 text-amber-300',
  aerospace: 'bg-sky-500/20 text-sky-300',
  telecommunications: 'bg-purple-500/20 text-purple-300',
};

const ERA_COLORS: Record<Era, string> = {
  '1950s': 'bg-blue-500/20 text-blue-300',
  '1960s': 'bg-cyan-500/20 text-cyan-300',
  '1970s': 'bg-green-500/20 text-green-300',
  '1980s': 'bg-amber-500/20 text-amber-300',
  '1990s': 'bg-orange-500/20 text-orange-300',
  '2000s': 'bg-pink-500/20 text-pink-300',
};

const CONFIDENCE_COLORS: Record<ConfidenceLevel, string> = {
  high: 'bg-green-500/20 text-green-300',
  medium: 'bg-yellow-500/20 text-yellow-300',
  low: 'bg-orange-500/20 text-orange-300',
  estimated: 'bg-neutral-500/20 text-neutral-300',
};

const ERA_ORDER: Record<Era, number> = {
  '1950s': 1,
  '1960s': 2,
  '1970s': 3,
  '1980s': 4,
  '1990s': 5,
  '2000s': 6,
};

export function Engineering() {
  const [specs, setSpecs] = useState<EngineeringSpec[]>([]);
  const [loading, setLoading] = useState(true);
  const [subDomain, setSubDomain] = useState<SubDomain | 'all'>('all');
  const [era, setEra] = useState<Era | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeEntry, setActiveEntry] = useState<EngineeringSpec | null>(null);

  useEffect(() => {
    loadEngineering()
      .then((data) => {
        setSpecs(data);
        setLoading(false);
      })
      .catch(() => {
        showError('Failed to load engineering specs');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!activeEntry) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveEntry(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeEntry]);

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return specs
      .filter((s) => {
        if (subDomain !== 'all' && s.subDomain !== subDomain) return false;
        if (era !== 'all' && s.era !== era) return false;
        if (q) {
          const keySpecsText = Object.values(s.keySpecs).join(' ').toLowerCase();
          const tagText = (s.tags ?? []).join(' ').toLowerCase();
          const matchFound =
            s.conceptName.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q) ||
            keySpecsText.includes(q) ||
            s.subDomain.toLowerCase().includes(q) ||
            s.era.toLowerCase().includes(q) ||
            tagText.includes(q);
          if (!matchFound) return false;
        }
        return true;
      })
      .sort((a, b) => ERA_ORDER[a.era] - ERA_ORDER[b.era]);
  }, [specs, subDomain, era, searchTerm]);

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white mb-2"
        >
          <ArrowLeft className="size-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Wrench className="size-6 text-indigo-400" /> Engineering Specs
        </h1>
        <p className="text-neutral-400 mt-1">
          22 foundational engineering specifications across CNC machining, semiconductors, metallurgy,
          aerospace, and telecommunications — 1950s through 2000s.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="subdomain-filter" className="text-xs text-neutral-400">
            Sub-domain:
          </label>
          <select
            id="subdomain-filter"
            value={subDomain}
            onChange={(e) => setSubDomain(e.target.value as SubDomain | 'all')}
            className="h-10 px-3 rounded-md border border-neutral-800 bg-neutral-900 text-sm text-white"
          >
            <option value="all">All</option>
            {SUB_DOMAINS.map((sd) => (
              <option key={sd} value={sd}>
                {SUB_DOMAIN_LABELS[sd]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="era-filter" className="text-xs text-neutral-400">
            Era:
          </label>
          <select
            id="era-filter"
            value={era}
            onChange={(e) => setEra(e.target.value as Era | 'all')}
            className="h-10 px-3 rounded-md border border-neutral-800 bg-neutral-900 text-sm text-white"
          >
            <option value="all">All</option>
            {ERAS.map((er) => (
              <option key={er} value={er}>
                {er}
              </option>
            ))}
          </select>
        </div>
        <div className="relative flex-1 max-w-sm min-w-[200px]">
          <Search className="absolute left-3 top-2 size-4 text-neutral-500 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search name, specs, tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search engineering specs"
            className="pl-8 bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500"
          />
        </div>
        <span className="text-xs text-neutral-500">
          Showing {filtered.length} of {specs.length}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportToCSV(filtered as unknown as Record<string, unknown>[], 'engineering.csv')}
          disabled={filtered.length === 0}
          className="gap-2"
        >
          <Download className="size-4" />
          Export CSV
        </Button>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-neutral-500">
          No engineering specs match the current filters.
        </div>
      )}

      {/* Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <Card
            key={s.id}
            className="bg-neutral-900 border-neutral-800 cursor-pointer hover:border-neutral-700 transition-colors"
            onClick={() => setActiveEntry(s)}
          >
            <CardContent className="pt-5 space-y-3">
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${ERA_COLORS[s.era]}`}
                >
                  {s.era}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${SUB_DOMAIN_COLORS[s.subDomain]}`}
                >
                  {SUB_DOMAIN_ICONS[s.subDomain]} {SUB_DOMAIN_LABELS[s.subDomain]}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${CONFIDENCE_COLORS[s.provenance.confidence]}`}
                  title={`Provenance confidence: ${s.provenance.confidence} (source: ${s.provenance.sourceSite})`}
                >
                  <CheckCircle2 className="size-2.5" /> {s.provenance.confidence}
                </span>
              </div>
              <h3 className="font-semibold text-white leading-snug">{s.conceptName}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{s.description}</p>
              <dl className="grid grid-cols-1 gap-1 pt-2 border-t border-neutral-800">
                {Object.entries(s.keySpecs).map(([k, v]) => (
                  <div key={k} className="flex items-baseline gap-2 text-xs">
                    <dt className="font-mono text-neutral-500 shrink-0">{k}:</dt>
                    <dd className="text-neutral-300">{v}</dd>
                  </div>
                ))}
              </dl>
              {s.tags && s.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {s.tags.slice(0, 6).map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-500"
                    >
                      <Tag className="size-2.5" /> {t}
                    </span>
                  ))}
                </div>
              )}
              <RelatedEntries tags={s.tags ?? []} excludeId={s.id} />
            </CardContent>
          </Card>
        ))}
      </div>

      {activeEntry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setActiveEntry(null)}
        >
          <div
            className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveEntry(null)}
              className="float-right text-neutral-400 hover:text-white"
              aria-label="Close detail"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-white leading-snug">{activeEntry.conceptName}</h2>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${ERA_COLORS[activeEntry.era]}`}>
                {activeEntry.era}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${SUB_DOMAIN_COLORS[activeEntry.subDomain]}`}>
                {SUB_DOMAIN_ICONS[activeEntry.subDomain]} {SUB_DOMAIN_LABELS[activeEntry.subDomain]}
              </span>
            </div>

            <p className="text-sm text-neutral-300 leading-relaxed">{activeEntry.description}</p>

            <div>
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Key Specs</h3>
              <dl className="grid grid-cols-1 gap-1">
                {Object.entries(activeEntry.keySpecs).map(([k, v]) => (
                  <div key={k} className="flex items-baseline gap-2 text-xs">
                    <dt className="font-mono text-neutral-500 shrink-0">{k}:</dt>
                    <dd className="text-neutral-300">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="border-t border-neutral-800 pt-3 space-y-1 text-xs text-neutral-400">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Provenance</h3>
              <div>Source: <span className="text-neutral-300">{activeEntry.provenance.sourceSite}</span></div>
              <div>
                URL:{' '}
                <a
                  href={activeEntry.provenance.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline break-all"
                >
                  {activeEntry.provenance.sourceUrl}
                </a>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${CONFIDENCE_COLORS[activeEntry.provenance.confidence]}`}>
                  <CheckCircle2 className="size-2.5" /> {activeEntry.provenance.confidence}
                </span>
                <span className="text-neutral-500">Extracted: {activeEntry.provenance.extractedAt}</span>
              </div>
            </div>

            {activeEntry.tags && activeEntry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {activeEntry.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-500"
                  >
                    <Tag className="size-2.5" /> {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}