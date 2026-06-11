import { Routes, Route, Link } from 'react-router';
import { lazy, Suspense, useState, useEffect } from 'react';
import { searchAll, type SearchResult } from './lib/search';
import { Search, X, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { CompanionProvider, useCompanion } from './context/CompanionContext';
import { defaultCompanions } from './data/companions';

const SportsAlmanac = lazy(() => import('./pages/SportsAlmanac').then(m => ({ default: m.SportsAlmanac })));
const EraGuide = lazy(() => import('./pages/EraGuide').then(m => ({ default: m.EraGuide })));
const Quiz = lazy(() => import('./pages/Quiz').then(m => ({ default: m.Quiz })));
const FinancialAlmanac = lazy(() => import('./pages/FinancialAlmanac').then(m => ({ default: m.FinancialAlmanac })));
const DisasterPrevention = lazy(() => import('./pages/DisasterPrevention').then(m => ({ default: m.DisasterPrevention })));
const TechTransfer = lazy(() => import('./pages/TechTransfer').then(m => ({ default: m.TechTransfer })));
const MedicalInterventions = lazy(() => import('./pages/MedicalInterventions').then(m => ({ default: m.MedicalInterventions })));
const ButterflyCalculator = lazy(() => import('./pages/ButterflyCalculator').then(m => ({ default: m.ButterflyCalculator })));
const SafetyProtocols = lazy(() => import('./pages/SafetyProtocols').then(m => ({ default: m.SafetyProtocols })));
const TemporalMap = lazy(() => import('./pages/TemporalMap').then(m => ({ default: m.TemporalMap })));
const BootstrapBlueprints = lazy(() => import('./pages/BootstrapBlueprints').then(m => ({ default: m.BootstrapBlueprints })));

function Lazy({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20 text-neutral-500 animate-pulse">Loading module…</div>}>
      {children}
    </Suspense>
  );
}

function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-1">Welcome, Traveler.</h2>
        <p className="text-neutral-400">You are about to depart for the modern era (1970s–2001). Select a module to prepare.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-neutral-900 border-neutral-800 hover:border-indigo-800/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-white">🏈 Sports Almanac</CardTitle>
            <CardDescription className="text-neutral-400">Super Bowls, World Series, boxing, Triple Crown, and bracket-busting upsets.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/sports" className={buttonVariants({ variant: "secondary", className: "w-full text-center" })}>
              View Almanac
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 hover:border-indigo-800/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-white">📈 Financial Almanac</CardTitle>
            <CardDescription className="text-neutral-400">Market crashes, commodity spikes, IPOs, and currency events — your bootstrap fund.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/finance" className={buttonVariants({ variant: "secondary", className: "w-full text-center" })}>
              View Almanac
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 hover:border-indigo-800/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-white">🕰️ Era Integration Guide</CardTitle>
            <CardDescription className="text-neutral-400">Prices, slang, tech constraints, fashion, and identity — blend in.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/era-guide" className={buttonVariants({ variant: "secondary", className: "w-full text-center" })}>
              View Guide
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 hover:border-red-800/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-white">🛟 Disaster Prevention</CardTitle>
            <CardDescription className="text-neutral-400">Preventable tragedies with low-profile intervention strategies.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/disasters" className={buttonVariants({ variant: "secondary", className: "w-full text-center" })}>
              View Protocols
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 hover:border-indigo-800/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-white">🧠 LLM Testing Module</CardTitle>
            <CardDescription className="text-neutral-400">Tier 1 Factual Recall — prove you know the era before you go.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/quiz" className={buttonVariants({ variant: "secondary", className: "w-full text-center" })}>
              Take the Quiz
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 hover:border-emerald-800/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-white">🔬 Technology Transfer</CardTitle>
            <CardDescription className="text-neutral-400">What to send, to whom, and when — accelerating good tech.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/tech-transfer" className={buttonVariants({ variant: "secondary", className: "w-full text-center" })}>
              View Targets
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 hover:border-rose-800/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-white">💊 Medical Interventions</CardTitle>
            <CardDescription className="text-neutral-400">Life-saving medical knowledge with minimal butterfly risk.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/medical" className={buttonVariants({ variant: "secondary", className: "w-full text-center" })}>
              View Interventions
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 hover:border-amber-800/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-white">🦋 Butterfly Risk Calculator</CardTitle>
            <CardDescription className="text-neutral-400">Score your intervention before you act. Avoid timeline collapse.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/butterfly" className={buttonVariants({ variant: "secondary", className: "w-full text-center" })}>
              Calculate Risk
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 hover:border-indigo-800/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-white">🛡️ Safety &amp; Dead Drops</CardTitle>
            <CardDescription className="text-neutral-400">Identity, banking, housing, and methods to communicate across time.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/safety" className={buttonVariants({ variant: "secondary", className: "w-full text-center" })}>
              View Protocols
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 hover:border-indigo-500/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-white">🗺️ Temporal Strategy Map</CardTitle>
            <CardDescription className="text-neutral-400">Checklist-simulate key operations and analyze timeline distortion effects.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/timeline" className={buttonVariants({ variant: "secondary", className: "w-full text-center" })}>
              View Strategy Map
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 hover:border-purple-500/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-white">🛠️ Bootstrap Blueprints</CardTitle>
            <CardDescription className="text-neutral-400">Preserved specs to build semiconductors, CNC tooling, and flat transistors from scratch.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/blueprints" className={buttonVariants({ variant: "secondary", className: "w-full text-center" })}>
              View Blueprints
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isCompanionOpen, setIsCompanionOpen] = useState(false);
  const { activeCompanion, selectCompanion, customName, setCustomName, customPrompt, setCustomPrompt, companionProvider, setCompanionProvider, userName, setUserName } = useCompanion();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(open => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSearchResults(searchAll(query));
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Group search results by module
  const groupedResults = searchResults.reduce((acc, result) => {
    if (!acc[result.module]) {
      acc[result.module] = [];
    }
    acc[result.module].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <div className="min-h-screen bg-black text-neutral-50 flex flex-col font-sans">
      <header className="border-b border-neutral-800 bg-neutral-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="text-xl font-extrabold tracking-tight bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent shrink-0">
            Time Traveler's Guide
          </Link>
          <div className="flex items-center gap-4 flex-1 justify-end">
            <nav className="hidden lg:flex gap-4 flex-wrap">
              <Link to="/sports" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Sports</Link>
              <Link to="/finance" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Finance</Link>
              <Link to="/era-guide" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Era</Link>
              <Link to="/timeline" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Timeline</Link>
              <Link to="/blueprints" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Blueprints</Link>
              <Link to="/disasters" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Disasters</Link>
              <Link to="/tech-transfer" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Tech</Link>
              <Link to="/medical" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Medical</Link>
              <Link to="/butterfly" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Risk</Link>
              <Link to="/safety" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Safety</Link>
              <Link to="/quiz" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Quiz</Link>
            </nav>
            <button
              onClick={() => setIsCompanionOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 text-neutral-400 hover:text-white text-xs transition-all cursor-pointer select-none"
              title={`Active Companion: ${activeCompanion.name}`}
            >
              <span className="text-sm">{activeCompanion.avatar}</span>
              <span className="hidden sm:inline font-semibold">{activeCompanion.name}</span>
            </button>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 text-neutral-400 hover:text-white text-xs transition-all cursor-pointer select-none"
            >
              <Search className="size-3.5" />
              <span className="hidden sm:inline">Search archive...</span>
              <kbd className="hidden sm:inline-flex ml-2 pointer-events-none h-5 select-none items-center gap-1 rounded border border-neutral-800 bg-neutral-950 px-1.5 font-mono text-[10px] font-medium text-neutral-500">
                Ctrl+K
              </kbd>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 text-neutral-400 hover:text-white text-xs transition-all cursor-pointer select-none print:hidden"
              title="Print Dossier on Acid-Free Paper"
            >
              <Printer className="size-3.5" />
              <span className="hidden sm:inline">Print Guide</span>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-12">
        {children}
      </main>

      {/* Global Search Overlay Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center pt-20 px-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-2xl rounded-xl shadow-2xl flex flex-col h-[500px] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 p-4 border-b border-neutral-800">
              <Search className="size-5 text-neutral-400 shrink-0" />
              <input
                type="text"
                placeholder="Search across all historical guides and records..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-transparent text-white border-0 focus:outline-none focus:ring-0 w-full text-base"
                autoFocus
              />
              <button onClick={closeSearch} className="text-neutral-500 hover:text-white transition-colors cursor-pointer">
                <X className="size-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {searchQuery === '' ? (
                <div className="text-neutral-500 text-center py-20">
                  <p className="text-lg font-medium">Search the Archive</p>
                  <p className="text-sm mt-1">Type in a year, sports team, price, or disaster.</p>
                </div>
              ) : Object.keys(groupedResults).length === 0 ? (
                <div className="text-neutral-500 text-center py-20">
                  <p className="text-lg font-medium">No results found</p>
                  <p className="text-sm mt-1">Try another keyword (e.g. "secretariat", "IBM", "chernobyl", "embargo")</p>
                </div>
              ) : (
                Object.entries(groupedResults).map(([module, items]) => (
                  <div key={module} className="space-y-2">
                    <h3 className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">{module}</h3>
                    <div className="space-y-2">
                      {items.map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.link}
                          onClick={closeSearch}
                          className="block p-3 rounded-lg border border-neutral-800/50 bg-neutral-950/40 hover:bg-neutral-950/80 hover:border-indigo-500/30 transition-all"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <span className="font-semibold text-neutral-200">{item.title}</span>
                            {item.year && (
                              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-neutral-800 text-neutral-400 rounded">
                                {item.year}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-neutral-400 mt-1">{item.subtitle}</div>
                          <div className="text-xs text-neutral-500 mt-1 line-clamp-1 italic">{item.description}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Companion Configuration Modal */}
      {isCompanionOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center pt-20 px-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-lg rounded-xl shadow-2xl flex flex-col h-[550px] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-neutral-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>⏱️</span> Time Travel Companion
              </h2>
              <button
                onClick={() => setIsCompanionOpen(false)}
                className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <label className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase block mb-1">
                  Traveler Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  placeholder="Yune"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[10px] text-neutral-500 mt-1">
                  Athena will address you by this name. Other companions ignore it.
                </p>
              </div>

              <p className="text-xs text-neutral-400">
                Choose who accompanies you on your temporal journey. They will comment on historical events and help you study in the quiz training simulations.
              </p>
              
              <div className="space-y-3">
                {defaultCompanions.map(c => {
                  const isSelected = activeCompanion.id === c.id;
                  const displayName = c.id === 'custom' ? customName : c.name;
                  return (
                    <div
                      key={c.id}
                      className={`p-3 rounded-lg border transition-all ${isSelected ? 'bg-indigo-950/20 border-indigo-500/50' : 'bg-neutral-950/40 border-neutral-850 hover:bg-neutral-950/80 hover:border-neutral-800'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{c.avatar}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-neutral-200">{displayName}</h4>
                          <p className="text-xs text-neutral-400 mt-0.5">{c.description}</p>
                        </div>
                        <button
                          onClick={() => selectCompanion(c.id)}
                          className={`px-3 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${isSelected ? 'bg-indigo-600 text-white cursor-default' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'}`}
                          disabled={isSelected}
                        >
                          {isSelected ? 'Active' : 'Select'}
                        </button>
                      </div>
                      
                      {/* If custom is selected, show editing fields inline */}
                      {c.id === 'custom' && isSelected && (
                        <div className="mt-3 pt-3 border-t border-neutral-800/50 space-y-3 animate-in slide-in-from-top-2 duration-200">
                          <div>
                            <label className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase block mb-1">Companion Name</label>
                            <input
                              type="text"
                              value={customName}
                              onChange={e => setCustomName(e.target.value)}
                              placeholder="e.g. Sarcastic Time Cop"
                              className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase block mb-1">Companion Prompt / Persona Description</label>
                            <textarea
                              value={customPrompt}
                              onChange={e => setCustomPrompt(e.target.value)}
                              placeholder="Describe your companion's voice, personality, knowledge, and catchphrases..."
                              rows={3}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Companion LLM Provider */}
            <div className="px-4 py-3 border-t border-neutral-800/80 bg-neutral-950/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">AI Provider for Companion</span>
                <span className="text-[9px] text-neutral-600">falls back if unavailable</span>
              </div>
              <div className="flex gap-1.5">
                {(['minimax', 'zhipu', 'deepseek', 'google'] as const).map(pid => (
                  <button
                    key={pid}
                    onClick={() => setCompanionProvider(pid)}
                    className={`flex-1 py-1.5 text-[10px] font-semibold rounded border transition-all cursor-pointer ${
                      companionProvider === pid
                        ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-neutral-300'
                    }`}
                    title={pid === 'minimax' ? 'Cheapest — MiniMax M3' : pid === 'zhipu' ? 'Zhipu GLM' : pid === 'deepseek' ? 'DeepSeek' : 'Google Gemini (fallback)'}
                  >
                    {pid === 'minimax' ? '⚡ MiniMax' : pid === 'zhipu' ? '🧠 Zhipu' : pid === 'deepseek' ? '🐋 DeepSeek' : '🔵 Gemini'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-neutral-800/80 bg-neutral-950/20 flex justify-end">
              <Button
                onClick={() => setIsCompanionOpen(false)}
                variant="secondary"
                className="text-xs"
              >
                Close Settings
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <CompanionProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sports" element={<Lazy><SportsAlmanac /></Lazy>} />
          <Route path="/finance" element={<Lazy><FinancialAlmanac /></Lazy>} />
          <Route path="/era-guide" element={<Lazy><EraGuide /></Lazy>} />
          <Route path="/disasters" element={<Lazy><DisasterPrevention /></Lazy>} />
          <Route path="/tech-transfer" element={<Lazy><TechTransfer /></Lazy>} />
          <Route path="/medical" element={<Lazy><MedicalInterventions /></Lazy>} />
          <Route path="/butterfly" element={<Lazy><ButterflyCalculator /></Lazy>} />
          <Route path="/safety" element={<Lazy><SafetyProtocols /></Lazy>} />
          <Route path="/quiz" element={<Lazy><Quiz /></Lazy>} />
          <Route path="/timeline" element={<Lazy><TemporalMap /></Lazy>} />
          <Route path="/blueprints" element={<Lazy><BootstrapBlueprints /></Lazy>} />
        </Routes>
      </Layout>
    </CompanionProvider>
  );
}

export default App;
