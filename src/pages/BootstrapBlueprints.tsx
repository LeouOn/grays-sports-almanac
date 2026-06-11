import { useState } from 'react';
import { blueprintsData, type BootstrapBlueprint } from '@/data/blueprints';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AthenaCommentary } from '@/components/AthenaCommentary';
import { ChatAboutThis } from '@/components/ChatAboutThis';
import { PalaceHook } from '@/components/PalaceHook';
import { PalaceLink } from '@/components/PalaceLink';
import { RelatedEntries } from '@/components/RelatedEntries';
import { Search, Filter, Cpu, Wrench, Layers, Lightbulb, Clock, Info, ShieldAlert } from 'lucide-react';

const categoryIcons = {
  'Semiconductors': <Cpu className="size-4 text-indigo-400" />,
  'Machine Tooling': <Wrench className="size-4 text-emerald-400" />,
  'Electronics': <Layers className="size-4 text-rose-400" />,
  'Materials & Chemistry': <Lightbulb className="size-4 text-amber-400" />
};

const difficultyColors = {
  'Basic': 'bg-green-950/60 text-green-400 border-green-900',
  'Intermediate': 'bg-amber-950/60 text-amber-400 border-amber-900',
  'Advanced': 'bg-red-950/60 text-red-400 border-red-900'
};

export function BootstrapBlueprints() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeBlueprint, setActiveBlueprint] = useState<BootstrapBlueprint | null>(null);
  const [modalTab, setModalTab] = useState<'specs' | 'guide' | 'impact'>('specs');

  const categories = ['All', 'Semiconductors', 'Machine Tooling', 'Electronics', 'Materials & Chemistry'];

  const filtered = blueprintsData.filter(b => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.keyPrinciples.some(p => p.toLowerCase().includes(searchTerm.toLowerCase())) ||
      b.materialsRequired.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenBlueprint = (blueprint: BootstrapBlueprint) => {
    setActiveBlueprint(blueprint);
    setModalTab('specs');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-neutral-50 via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
          Bootstrap Blueprints &amp; Specs
        </h2>
        <p className="text-neutral-400 mt-2">
          Preserved technical specifications and building instructions for jumpstarting core engineering primitives from scratch.
        </p>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-neutral-950/40 p-4 border border-neutral-900 rounded-lg">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 size-4 text-neutral-500" />
          <Input
            type="text"
            placeholder="Search blueprints, materials, or rules..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 bg-neutral-900 border-neutral-800 text-xs text-white focus-visible:ring-indigo-500"
          />
        </div>

        {/* Categories Tab buttons */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mr-1.5 flex items-center gap-1">
            <Filter className="size-3" /> Filter:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded text-xs font-semibold border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-950 border-indigo-850 text-indigo-300 shadow-inner'
                  : 'bg-neutral-950/20 border-transparent text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Blueprint Cards */}
      {filtered.length === 0 ? (
        <Card className="bg-neutral-950 border-neutral-850 p-12 text-center">
          <p className="text-neutral-500 text-sm">No bootstrap specifications cataloged matching the selected filters.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(blueprint => (
            <Card
              key={blueprint.id}
              className="bg-neutral-900/30 border-neutral-850 hover:bg-neutral-900/50 hover:border-neutral-750 transition-all duration-300 flex flex-col justify-between"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-950 border border-neutral-850">
                    {categoryIcons[blueprint.category]} {blueprint.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-semibold border ${difficultyColors[blueprint.difficulty]}`}>
                    {blueprint.difficulty}
                  </span>
                </div>
                <CardTitle className="text-base font-extrabold text-neutral-200 mt-2 hover:text-indigo-400 transition-colors">
                  {blueprint.title}
                </CardTitle>
                <CardDescription className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {blueprint.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                {/* Core Principles */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Key Engineering Primitives</span>
                  <div className="flex flex-wrap gap-1">
                    {blueprint.keyPrinciples.map((pr, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-400 border border-neutral-900 text-[10px]">
                        {pr}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card footer details & button */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-950 gap-4 flex-wrap">
                  <span className="text-[10px] text-neutral-500 flex items-center gap-1 font-mono">
                    <Clock className="size-3 text-neutral-600" /> Era: {blueprint.historicalEra}
                  </span>
                  <Button
                    onClick={() => handleOpenBlueprint(blueprint)}
                    variant="outline"
                    className="border-neutral-800 bg-neutral-950 hover:bg-neutral-900 text-neutral-300 text-xs cursor-pointer h-8"
                  >
                    View Specifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Blueprint Details Dialog Modal */}
      {activeBlueprint && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center items-center p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-start p-5 border-b border-neutral-800 bg-neutral-950/20">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-950 border border-neutral-850">
                    {categoryIcons[activeBlueprint.category]} {activeBlueprint.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-semibold border ${difficultyColors[activeBlueprint.difficulty]}`}>
                    {activeBlueprint.difficulty}
                  </span>
                </div>
                <h3 className="text-lg font-black text-white leading-tight pr-6 mt-1">
                  {activeBlueprint.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveBlueprint(null)}
                className="text-neutral-500 hover:text-white transition-colors cursor-pointer text-xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-neutral-800 bg-neutral-950/40 p-1 gap-1">
              <button
                onClick={() => setModalTab('specs')}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  modalTab === 'specs' ? 'bg-neutral-850 text-white' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Info className="size-3.5" /> General Specs
              </button>
              <button
                onClick={() => setModalTab('guide')}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  modalTab === 'guide' ? 'bg-neutral-850 text-white' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Wrench className="size-3.5" /> Build Guide
              </button>
              <button
                onClick={() => setModalTab('impact')}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  modalTab === 'impact' ? 'bg-neutral-850 text-white' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Clock className="size-3.5" /> Chrono Impact
              </button>
            </div>

            {/* Modal Body Scrollable */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {modalTab === 'specs' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Summary */}
                  <div>
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Process Overview</h4>
                    <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950 p-3 rounded-lg border border-neutral-850/40">
                      {activeBlueprint.description}
                    </p>
                  </div>

                  {/* Tolerances Alert */}
                  <div className="bg-amber-950/15 border border-amber-900/40 p-3.5 rounded-lg text-xs leading-relaxed flex items-start gap-2.5">
                    <ShieldAlert className="size-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-400 block mb-0.5">Physical Limits &amp; Tolerances</strong>
                      <span className="text-neutral-300 font-mono text-[11px]">{activeBlueprint.tolerances}</span>
                    </div>
                  </div>

                  {/* Materials list */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Required Elements &amp; Substrates</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                      {activeBlueprint.materialsRequired.map((mat, i) => (
                        <li key={i} className="text-xs text-neutral-300 bg-neutral-950/60 border border-neutral-850 p-2 rounded flex items-center gap-2">
                          <span className="text-indigo-400 font-mono text-[10px]">#{i + 1}</span> {mat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {modalTab === 'guide' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap bg-neutral-950 p-4 rounded-lg border border-neutral-850/40 font-sans">
                    {/* Render the markdown step guide with clean line breaks */}
                    {activeBlueprint.stepByStepGuide}
                  </div>
                </div>
              )}

              {modalTab === 'impact' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Timeline change */}
                  <div>
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Timeline Acceleration Vector</h4>
                    <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950 p-3.5 rounded-lg border border-neutral-850/40 border-l-4 border-l-blue-500">
                      {activeBlueprint.chronoImpact}
                    </p>
                  </div>

                  <div className="p-3 bg-neutral-950 border border-neutral-850 rounded-lg text-xs leading-normal">
                    <strong className="text-neutral-200 block mb-1">Pre-requisite Ready State:</strong>
                    <p className="text-neutral-400 text-[11px]">
                      Ensure the local temporal area meets the basic materials infrastructure. For instance, high-vacuum chambers require high-purity sealants, and optical lithography reticles require quartz optics. Refer to the target recipient profiles in the Tech Transfer module for optimal drop zones.
                    </p>
                  </div>
                </div>
              )}

              <PalaceHook routeId={activeBlueprint.id} />
              {/* Dynamic Companion commentary thought block */}
              {activeBlueprint.tags && activeBlueprint.tags.length > 0 && (
                <>
                  <PalaceLink tags={activeBlueprint.tags} contextItem={`Blueprint: ${activeBlueprint.title}`} excludeId={activeBlueprint.id} />
                  <RelatedEntries tags={activeBlueprint.tags} excludeId={activeBlueprint.id} />
                </>
              )}
              <AthenaCommentary entryId={activeBlueprint.id} />
              <ChatAboutThis entryId={activeBlueprint.id} module="blueprints" fields={{ title: activeBlueprint.title }} />
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-800 bg-neutral-950/20 flex justify-end">
              <Button
                onClick={() => setActiveBlueprint(null)}
                variant="outline"
                className="text-xs h-9 cursor-pointer"
              >
                Close Blueprint
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
