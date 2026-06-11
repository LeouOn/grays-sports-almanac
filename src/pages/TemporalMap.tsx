import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CompanionThought } from '@/components/CompanionThought';
import { useCompanion } from '../context/CompanionContext';
import { disasterAlmanac } from '../data/disasters';
import { techTransferTargets } from '../data/tech-transfer';
import { medicalInterventions } from '../data/medical';
import { Search, Printer, ShieldAlert, Check, Info, Filter, Activity, Zap } from 'lucide-react';

interface TimelineItem {
  id: string;
  year: number;
  dateStr: string;
  type: 'disaster' | 'tech' | 'medical';
  title: string;
  category: string;
  subtitle: string;
  description: string;
  risk: 'Low' | 'Medium' | 'High' | 'Extreme';
  livesSavedStr: string;
  livesSavedNum: number;
  deliveryMethod: string;
  causeOrContext: string;
  interventionOrDetails: string;
}

const riskScores: Record<TimelineItem['risk'], number> = {
  'Low': 1,
  'Medium': 3,
  'High': 5,
  'Extreme': 10
};

const typeColors = {
  disaster: 'border-red-500/30 bg-red-950/20 text-red-400 hover:border-red-500/50',
  tech: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400 hover:border-emerald-500/50',
  medical: 'border-rose-500/30 bg-rose-950/20 text-rose-400 hover:border-rose-500/50'
};

const typeIcons = {
  disaster: '🚨',
  tech: '🔬',
  medical: '💊'
};

function parseLivesSaved(str: string): number {
  if (!str) return 0;
  if (/million/i.test(str)) return 1000000;
  if (/hundreds of thousands/i.test(str)) return 200000;
  if (/thousands/i.test(str)) return 10000;
  const matches = str.match(/\d+[\d,.]*/g);
  if (matches) {
    let maxVal = 0;
    for (const match of matches) {
      const val = parseInt(match.replace(/,/g, ''), 10);
      if (!isNaN(val) && val > maxVal) maxVal = val;
    }
    return maxVal;
  }
  return 0;
}

export function TemporalMap() {
  const { activeCompanion } = useCompanion();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<TimelineItem['type'][]>(['disaster', 'tech', 'medical']);
  const [selectedRisks, setSelectedRisks] = useState<TimelineItem['risk'][]>(['Low', 'Medium', 'High', 'Extreme']);
  const [selectedEvent, setSelectedEvent] = useState<TimelineItem | null>(null);
  const [activePlan, setActivePlan] = useState<string[]>(() => {
    const saved = localStorage.getItem('temporal_plan_events');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load temporal plan', e);
      }
    }
    return [];
  });
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const savePlan = (newPlan: string[]) => {
    setActivePlan(newPlan);
    localStorage.setItem('temporal_plan_events', JSON.stringify(newPlan));
  };

  // Compile and merge all data sources
  const allEvents = useMemo<TimelineItem[]>(() => {
    const list: TimelineItem[] = [];

    // Disasters
    disasterAlmanac.forEach(d => {
      list.push({
        id: d.id,
        year: d.year,
        dateStr: d.date,
        type: 'disaster',
        title: d.event,
        category: d.category,
        subtitle: `${d.location} · ${d.casualties}`,
        description: d.cause,
        risk: d.butterflyRisk,
        livesSavedStr: d.estimatedLivesSaved,
        livesSavedNum: parseLivesSaved(d.estimatedLivesSaved),
        deliveryMethod: d.deliveryMethod,
        causeOrContext: d.cause,
        interventionOrDetails: d.intervention
      });
    });

    // Tech Transfer
    techTransferTargets.forEach(t => {
      list.push({
        id: t.id,
        year: t.optimalYear,
        dateStr: `${t.optimalYear} (Optimal Year)`,
        type: 'tech',
        title: t.concept,
        category: 'Technology Transfer',
        subtitle: `Recipient: ${t.targetRecipient}`,
        description: t.description,
        risk: t.butterflyRisk,
        livesSavedStr: 'Accelerated innovation / economic growth',
        livesSavedNum: 0,
        deliveryMethod: t.deliveryMethod,
        causeOrContext: t.recipientContext,
        interventionOrDetails: t.estimatedImpact
      });
    });

    // Medical Interventions
    medicalInterventions.forEach(m => {
      list.push({
        id: m.id,
        year: m.optimalYear,
        dateStr: `Optimal Year: ${m.optimalYear}`,
        type: 'medical',
        title: m.condition,
        category: 'Medical Intervention',
        subtitle: `Recipient: ${m.targetRecipient}`,
        description: m.description,
        risk: m.butterflyRisk,
        livesSavedStr: m.estimatedLivesSaved,
        livesSavedNum: parseLivesSaved(m.estimatedLivesSaved),
        deliveryMethod: m.deliveryMethod,
        causeOrContext: m.details,
        interventionOrDetails: m.description
      });
    });

    return list;
  }, []);

  // Filter events
  const filteredEvents = useMemo(() => {
    return allEvents.filter(e => {
      const matchesSearch = 
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.year.toString().includes(searchTerm) ||
        e.deliveryMethod.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedTypes.includes(e.type);
      const matchesRisk = selectedRisks.includes(e.risk);

      return matchesSearch && matchesType && matchesRisk;
    });
  }, [allEvents, searchTerm, selectedTypes, selectedRisks]);

  // Group filtered events by year
  const groupedEvents = useMemo(() => {
    const groups: Record<number, TimelineItem[]> = {};
    filteredEvents.forEach(e => {
      if (!groups[e.year]) {
        groups[e.year] = [];
      }
      groups[e.year].push(e);
    });

    const sortedYears = Object.keys(groups)
      .map(Number)
      .sort((a, b) => sortOrder === 'asc' ? a - b : b - a);

    return sortedYears.map(year => ({
      year,
      items: groups[year].sort((a, b) => a.title.localeCompare(b.title))
    }));
  }, [filteredEvents, sortOrder]);

  // Planner metrics
  const activePlanItems = useMemo(() => {
    return allEvents.filter(e => activePlan.includes(e.id));
  }, [allEvents, activePlan]);

  const stats = useMemo(() => {
    let livesSaved = 0;
    let totalRisk = 0;
    const techFields = new Set<string>();

    activePlanItems.forEach(item => {
      livesSaved += item.livesSavedNum;
      totalRisk += riskScores[item.risk];

      if (item.type === 'tech') {
        if (item.id === 'tcp-ip' || item.id === 'cryptography') techFields.add('Computer Science');
        if (item.id === 'li-ion' || item.id === 'wind-turbine') techFields.add('Clean Energy');
        if (item.id === 'cfc-ozone') techFields.add('Environmental Policy');
        if (item.id === 'h-pylori' || item.id === 'recombinant-dna') techFields.add('Biomedical Science');
      }
    });

    return {
      livesSaved,
      totalRisk,
      techFields: Array.from(techFields)
    };
  }, [activePlanItems]);

  const timelineWarnings = useMemo(() => {
    const warnings: string[] = [];
    const ids = activePlanItems.map(i => i.id);

    if (ids.includes('tcp-ip') && ids.includes('recombinant-dna')) {
      warnings.push('⚠️ Multi-Vector Technology Wave: Accelerating internet architecture and gene editing concurrently creates extreme societal shifts.');
    }
    if (ids.includes('aids-early') && ids.includes('bhopal')) {
      warnings.push('⚠️ High Agency Load: Mitigating the global AIDS epidemic and the Bhopal chemical leak simultaneously challenges payphone drops.');
    }
    if (stats.totalRisk > 15) {
      warnings.push('⚠️ High Probability Distortion: Aggregate butterfly indexes exceed 15. The risk of major timeline bifurcation is significant.');
    }
    if (stats.totalRisk > 25) {
      warnings.push('🚨 space-time stability failure: Risk index exceeds 25. High timeline collapse threat.');
    }

    return warnings;
  }, [activePlanItems, stats.totalRisk]);

  const handleToggleEventInPlan = (id: string) => {
    const newPlan = activePlan.includes(id) 
      ? activePlan.filter(i => i !== id)
      : [...activePlan, id];
    savePlan(newPlan);
  };

  const handleResetPlan = () => {
    savePlan([]);
  };

  const handleToggleType = (type: TimelineItem['type']) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  const handleToggleRisk = (risk: TimelineItem['risk']) => {
    setSelectedRisks(prev => 
      prev.includes(risk) 
        ? prev.filter(r => r !== risk) 
        : [...prev, risk]
    );
  };

  const getStabilityColor = (riskVal: number) => {
    if (riskVal === 0) return 'text-neutral-500';
    if (riskVal < 6) return 'text-green-400';
    if (riskVal < 15) return 'text-amber-400';
    if (riskVal < 25) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 timeline-container">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-neutral-50 via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            Temporal Strategy Map &amp; Timeline
          </h2>
          <p className="text-neutral-400 mt-2">
            Formulate a timeline-safe plan by selecting key historical interventions. Avoid exceeding critical butterfly risk threshold limits.
          </p>
        </div>
        <div className="flex gap-2 shrink-0 print:hidden">
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 text-neutral-300 text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="size-3.5" />
            Print Briefing
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        {/* Sidebar Column: Filters & Config (xl:col-span-1) */}
        <div className="space-y-6 xl:col-span-1 xl:sticky xl:top-24 print:hidden">
          <Card className="bg-neutral-900/60 border-neutral-850">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Filter className="size-4 text-indigo-400" />
                <span>Search &amp; Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-4 text-neutral-500" />
                <Input
                  type="text"
                  placeholder="Search events or tools..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 bg-neutral-950 border-neutral-800 text-xs text-white focus-visible:ring-indigo-500"
                />
              </div>

              {/* Event Type Filter */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Event Types</label>
                <div className="grid grid-cols-1 gap-1.5">
                  {(['disaster', 'tech', 'medical'] as TimelineItem['type'][]).map(type => {
                    const isChecked = selectedTypes.includes(type);
                    return (
                      <button
                        key={type}
                        onClick={() => handleToggleType(type)}
                        className={`flex items-center justify-between px-3 py-2 rounded text-xs transition-all border cursor-pointer ${
                          isChecked 
                            ? 'bg-neutral-950 border-neutral-700 text-neutral-200' 
                            : 'bg-neutral-950/20 border-neutral-900/50 text-neutral-600 hover:text-neutral-400'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{typeIcons[type]}</span>
                          <span className="capitalize">{type === 'tech' ? 'Tech Transfer' : type === 'medical' ? 'Medical' : 'Disasters'}</span>
                        </span>
                        {isChecked && <Check className="size-3.5 text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Risk Level Filter */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Max Butterfly Risk</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['Low', 'Medium', 'High', 'Extreme'] as TimelineItem['risk'][]).map(risk => {
                    const isChecked = selectedRisks.includes(risk);
                    return (
                      <button
                        key={risk}
                        onClick={() => handleToggleRisk(risk)}
                        className={`py-1.5 px-2 rounded text-[11px] font-medium text-center border transition-all cursor-pointer ${
                          isChecked 
                            ? 'bg-neutral-950 border-neutral-750 text-neutral-200 shadow-inner' 
                            : 'bg-neutral-950/10 border-transparent text-neutral-600 hover:text-neutral-500'
                        }`}
                      >
                        {risk}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort Order Toggles */}
              <div className="pt-2 border-t border-neutral-800 flex justify-between items-center text-xs text-neutral-400">
                <span>Timeline Sort</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setSortOrder('asc')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${sortOrder === 'asc' ? 'bg-neutral-800 text-white' : 'hover:text-white'}`}
                  >
                    1970 ➔
                  </button>
                  <button
                    onClick={() => setSortOrder('desc')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${sortOrder === 'desc' ? 'bg-neutral-800 text-white' : 'hover:text-white'}`}
                  >
                    ➔ 2001
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Timeline Column: Years & Cards (xl:col-span-2) */}
        <div className="space-y-8 xl:col-span-2">
          {groupedEvents.length === 0 ? (
            <Card className="bg-neutral-950 border-neutral-850 p-12 text-center">
              <p className="text-neutral-500 text-sm">No historical events found matching the active filters.</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTypes(['disaster', 'tech', 'medical']);
                  setSelectedRisks(['Low', 'Medium', 'High', 'Extreme']);
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 mt-2 cursor-pointer"
              >
                Reset Search Filters
              </Button>
            </Card>
          ) : (
            <div className="relative border-l border-neutral-800 ml-4 xl:ml-6 pl-6 space-y-8">
              {groupedEvents.map(group => (
                <div key={group.year} className="relative group/year animate-in fade-in duration-300">
                  {/* Timeline Year Node */}
                  <div className="absolute -left-[35px] top-1.5 flex items-center justify-center size-8 rounded-full border border-neutral-800 bg-black font-mono text-xs font-bold text-neutral-400 group-hover/year:border-indigo-500 group-hover/year:text-white transition-all select-none">
                    {group.year}
                  </div>

                  <div className="space-y-4">
                    {group.items.map(event => {
                      const isSelectedInPlan = activePlan.includes(event.id);
                      return (
                        <div
                          key={`${event.type}-${event.id}`}
                          className={`group/card p-4 rounded-xl border transition-all duration-300 ${
                            isSelectedInPlan 
                              ? 'bg-neutral-950/80 border-indigo-500/50 shadow-[0_0_15px_-3px_rgba(99,102,241,0.15)]' 
                              : 'bg-neutral-900/30 border-neutral-850 hover:bg-neutral-900/50 hover:border-neutral-750'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Checkbox Trigger */}
                            <div className="pt-1.5 print:hidden">
                              <button
                                onClick={() => handleToggleEventInPlan(event.id)}
                                aria-label={`Toggle ${event.title}`}
                                data-testid={`checkbox-${event.id}`}
                                className={`flex items-center justify-center size-5 rounded border transition-all cursor-pointer ${
                                  isSelectedInPlan 
                                    ? 'bg-indigo-600 border-indigo-500 text-white' 
                                    : 'border-neutral-750 hover:border-neutral-500 bg-neutral-950'
                                }`}
                              >
                                {isSelectedInPlan && <Check className="size-3.5 stroke-[3]" />}
                              </button>
                            </div>

                            {/* Info Block */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${typeColors[event.type]}`}>
                                  {typeIcons[event.type]} {event.category}
                                </span>
                                <span className="text-[10px] text-neutral-500 font-mono">
                                  {event.dateStr}
                                </span>
                                <span className={`text-[10px] font-semibold font-mono ${
                                  event.risk === 'Low' ? 'text-green-400' :
                                  event.risk === 'Medium' ? 'text-amber-400' :
                                  event.risk === 'High' ? 'text-orange-400' : 'text-red-400'
                                }`}>
                                  {event.risk} Risk
                                </span>
                              </div>

                              <h4 className="text-base font-bold text-neutral-200 mt-2 group-hover/card:text-indigo-400 transition-colors">
                                {event.title}
                              </h4>
                              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed line-clamp-2">
                                {event.description}
                              </p>

                              {/* Card Actions */}
                              <div className="flex gap-4 items-center mt-3 pt-3 border-t border-neutral-900/50">
                                <button
                                  onClick={() => setSelectedEvent(event)}
                                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  <Info className="size-3" />
                                  View Details &amp; Guidance
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Column: Plan Metrics Dashboard (xl:col-span-1) */}
        <div className="space-y-6 xl:col-span-1 xl:sticky xl:top-24 print:hidden">
          <Card className={`border-2 transition-all duration-500 ${
            stats.totalRisk > 25 
              ? 'border-red-900 bg-red-950/10 shadow-red-950/20' 
              : stats.totalRisk > 15 
              ? 'border-orange-900 bg-orange-950/10' 
              : stats.totalRisk > 0 
              ? 'border-indigo-900 bg-indigo-950/10' 
              : 'border-neutral-850 bg-neutral-900/40'
          }`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="size-4 text-indigo-400" />
                <span>Simulated Plan Summary</span>
              </CardTitle>
              <CardDescription className="text-neutral-500 text-xs">
                Active Checklist Evaluation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {/* Stat Cards */}
              <div className="space-y-3">
                {/* Lives Saved */}
                <div className="bg-neutral-950/60 p-3 rounded-lg border border-neutral-850">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Estimated Lives Saved</span>
                  <span data-testid="stats-lives-saved" className="text-xl font-black text-white font-mono mt-0.5 block">
                    {stats.livesSaved.toLocaleString()}
                  </span>
                </div>

                {/* Timeline Distortion */}
                <div className="bg-neutral-950/60 p-3 rounded-lg border border-neutral-850">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Timeline Distortion Risk</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span data-testid="stats-risk-distortion" className="text-xl font-black text-white font-mono">{stats.totalRisk}</span>
                    <span className="text-[10px] text-neutral-500 font-mono">Index Score</span>
                  </div>
                  <span className={`text-[10px] font-bold block mt-1 ${getStabilityColor(stats.totalRisk)}`}>
                    {stats.totalRisk === 0 ? '🔘 No operations selected' :
                     stats.totalRisk < 6 ? '🟢 Safe - Minor divergence' :
                     stats.totalRisk < 15 ? '🟡 Stable - Monitor timelines' :
                     stats.totalRisk < 25 ? '🟠 Caution - Elevated butterfly chaos' :
                     '🚨 High Alert - Spatial disruption risk'}
                  </span>
                </div>
              </div>

              {/* Accelerated Fields */}
              {stats.techFields.length > 0 && (
                <div className="bg-neutral-950/40 p-3 rounded-lg border border-neutral-850/60 space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Accelerated Technology Sectors</label>
                  <div className="flex flex-wrap gap-1">
                    {stats.techFields.map(field => (
                      <span key={field} className="px-1.5 py-0.5 rounded bg-emerald-950/40 border border-emerald-900 text-emerald-400 text-[9px] font-semibold">
                        <Zap className="size-2 inline mr-0.5" />
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline Warnings Box */}
              {timelineWarnings.length > 0 && (
                <div className="space-y-1.5 p-3 rounded-lg bg-red-950/10 border border-red-900/30">
                  <label className="text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                    <ShieldAlert className="size-3" />
                    Timeline Warnings
                  </label>
                  <ul className="text-[10px] text-red-300/90 space-y-1 list-none leading-relaxed">
                    {timelineWarnings.map((warn, i) => (
                      <li key={i}>{warn}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Selection Summary list */}
              {activePlanItems.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-neutral-800">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Intervention Queue</span>
                  <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
                    {activePlanItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center gap-2 text-[10px] p-1.5 bg-neutral-950/40 rounded border border-neutral-850">
                        <span className="text-neutral-300 font-semibold truncate flex-1">{item.title}</span>
                        <span className={`text-[9px] font-mono shrink-0 px-1 rounded ${
                          item.risk === 'Low' ? 'bg-green-950 text-green-400' :
                          item.risk === 'Medium' ? 'bg-amber-950 text-amber-400' :
                          item.risk === 'High' ? 'bg-orange-950 text-orange-400' : 'bg-red-950 text-red-400'
                        }`}>
                          {item.risk}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              {activePlan.length > 0 && (
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleResetPlan}
                    variant="outline"
                    className="flex-1 text-xs border-neutral-800 text-neutral-400 hover:text-white cursor-pointer h-8 py-0"
                  >
                    Clear Queue
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Printable Briefing Layout (Only visible during printing) */}
      <div className="hidden print:block space-y-6 pt-12">
        <div className="border-b-2 border-black pb-4 text-center">
          <h1 className="text-2xl font-black uppercase tracking-wider">Temporal Briefing Dossier</h1>
          <p className="text-xs uppercase font-mono mt-1 text-neutral-600">Strictly Confidential · For Traveler Use Only</p>
        </div>

        <div className="grid grid-cols-2 gap-4 border border-black p-4 font-mono text-xs">
          <div>
            <strong>Active Companion:</strong> {activeCompanion.name}<br />
            <strong>Calculated Stability Index:</strong> {stats.totalRisk} (Risk multiplier)<br />
            <strong>Projected Lives Saved:</strong> {stats.livesSaved.toLocaleString()}<br />
          </div>
          <div>
            <strong>Dossier Generation:</strong> {new Date().toISOString().split('T')[0]}<br />
            <strong>Target Chrono Scope:</strong> Modern Era (1950–2001)<br />
            <strong>Plan Status:</strong> {stats.totalRisk > 25 ? 'CRITICAL DISTORTION THREAT' : 'STABLE PATHWAY APPROVED'}
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-bold uppercase border-b border-black pb-1">Scheduled Timeline Interventions</h3>
          {activePlanItems.length === 0 ? (
            <p className="text-xs italic">No actions scheduled in this briefing queue.</p>
          ) : (
            <div className="space-y-4">
              {activePlanItems.map((item, idx) => (
                <div key={item.id} className="border-l-4 border-black pl-3 space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-sm">
                      {idx + 1}. [{item.year}] {item.title}
                    </span>
                    <span className="text-[10px] font-mono uppercase">Risk: {item.risk}</span>
                  </div>
                  <p className="text-[10px] text-neutral-700 leading-normal">
                    <strong>Cause/Context:</strong> {item.causeOrContext}
                  </p>
                  <p className="text-[10px] text-neutral-750 leading-normal">
                    <strong>Intervention Protocol:</strong> {item.interventionOrDetails}
                  </p>
                  <p className="text-[10px] text-neutral-750 leading-normal">
                    <strong>Delivery Mechanism:</strong> {item.deliveryMethod}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {timelineWarnings.length > 0 && (
          <div className="border border-black p-3 bg-neutral-100 mt-6 space-y-1">
            <strong className="text-xs uppercase flex items-center gap-1">⚠️ Safety / Temporal Instability Warning:</strong>
            <ul className="list-disc list-inside text-[9px] font-mono leading-normal">
              {timelineWarnings.map((warn, i) => (
                <li key={i}>{warn}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Details Dialog Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center items-center p-4 animate-in fade-in duration-200 print:hidden">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-start p-5 border-b border-neutral-800">
              <div className="space-y-1 min-w-0">
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${typeColors[selectedEvent.type]}`}>
                  {typeIcons[selectedEvent.type]} {selectedEvent.category}
                </span>
                <h3 className="text-lg font-bold text-white pr-4 leading-tight truncate">
                  {selectedEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-neutral-500 hover:text-white transition-colors cursor-pointer text-xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* Modal Body Scrollable */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start pb-4 border-b border-neutral-800/50">
                {/* Visual Risk Gauge Widget */}
                <div className="md:col-span-1 flex flex-col items-center justify-center p-3 bg-neutral-950 border border-neutral-850 rounded-lg">
                  <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Butterfly Risk</span>
                  <div className="relative size-16 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="size-full overflow-visible">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#1f1f1f" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="40" fill="none"
                        stroke={
                          selectedEvent.risk === 'Low' ? '#22c55e' :
                          selectedEvent.risk === 'Medium' ? '#eab308' :
                          selectedEvent.risk === 'High' ? '#f97316' : '#ef4444'
                        }
                        strokeWidth="8"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (riskScores[selectedEvent.risk] / 10) * 251.2}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>
                    <span className="absolute font-bold text-xs font-mono">
                      {selectedEvent.risk}
                    </span>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <div className="flex justify-between text-xs pb-1 border-b border-neutral-850">
                    <span className="text-neutral-500">Chrono Node:</span>
                    <span className="font-semibold text-neutral-200">{selectedEvent.dateStr}</span>
                  </div>
                  <div className="flex justify-between text-xs pb-1 border-b border-neutral-850">
                    <span className="text-neutral-500">Impact Factor:</span>
                    <span className="font-semibold text-green-400">{selectedEvent.livesSavedStr}</span>
                  </div>
                </div>
              </div>

              {/* Case context / Description */}
              <div className="space-y-1">
                <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Historical Context &amp; Details</h5>
                <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950 p-3 rounded-lg border border-neutral-850/40">
                  {selectedEvent.causeOrContext}
                </p>
              </div>

              {/* Intervention Plan */}
              <div className="space-y-1">
                <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Recommended Intervention</h5>
                <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950 p-3 rounded-lg border border-neutral-850/40">
                  {selectedEvent.interventionOrDetails}
                </p>
              </div>

              {/* Delivery Mechanism */}
              <div className="space-y-1">
                <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Delivery Mechanism</h5>
                <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950 p-3 rounded-lg border border-neutral-850/40">
                  {selectedEvent.deliveryMethod}
                </p>
              </div>

              {/* Companion Commentary thought block */}
              <CompanionThought 
                contextItem={`Historical event detail for traveler: Year: ${selectedEvent.year}. Type: ${selectedEvent.type}. Category: ${selectedEvent.category}. Title: ${selectedEvent.title}. Context: ${selectedEvent.causeOrContext}. Intervention details: ${selectedEvent.interventionOrDetails}. Delivery mechanism: ${selectedEvent.deliveryMethod}.`} 
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-800 bg-neutral-950/20 flex gap-2 justify-end">
              <Button
                onClick={() => setSelectedEvent(null)}
                variant="outline"
                className="text-xs h-9 cursor-pointer"
              >
                Close View
              </Button>
              <Button
                onClick={() => {
                  handleToggleEventInPlan(selectedEvent.id);
                }}
                className={`text-xs h-9 cursor-pointer ${
                  activePlan.includes(selectedEvent.id)
                    ? 'bg-red-700 hover:bg-red-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {activePlan.includes(selectedEvent.id) ? 'Remove from Queue' : 'Queue Intervention'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
