import { Routes, Route, Link } from 'react-router';
import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useModalFocus } from './hooks/useModalFocus';
import { searchAll, preloadSearchData, type SearchResult } from './lib/search';
import { Search, X, Printer, Settings as SettingsIcon, Cpu } from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';
import { MobileNav } from './components/MobileNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { CompanionProvider, useCompanion } from './context/CompanionContext';
import { defaultCompanions } from './data/companions';
import { CompanionSelector } from './components/CompanionSelector';
import { Toaster } from 'sonner';
import { OfflineBanner } from './components/OfflineBanner';
import { InstallPrompt } from './components/InstallPrompt';
import { BookmarkButton } from '@/components/BookmarkButton';
import { showSuccess } from './lib/toast';
import { PageSkeleton } from './components/PageSkeleton';
import { useSpacedRepetition } from './hooks/useSpacedRepetition';
import { useProviderSettings } from './hooks/useProviderSettings';
import { useRecentlyViewed } from './hooks/useRecentlyViewed';
import { useCompetency } from './hooks/useCompetency';
import { useBookmarks } from './hooks/useBookmarks';
import { useOnlineStatus } from './hooks/useOnlineStatus';

const SportsAlmanac = lazy(() => import('./pages/SportsAlmanac').then(m => ({ default: m.SportsAlmanac })));
const EraGuide = lazy(() => import('./pages/EraGuide').then(m => ({ default: m.EraGuide })));
const Quiz = lazy(() => import('./pages/Quiz').then(m => ({ default: m.Quiz })));
const Run = lazy(() => import('./pages/Run').then(m => ({ default: m.Run })));
const FinancialAlmanac = lazy(() => import('./pages/FinancialAlmanac').then(m => ({ default: m.FinancialAlmanac })));
const DisasterPrevention = lazy(() => import('./pages/DisasterPrevention').then(m => ({ default: m.DisasterPrevention })));
const TechTransfer = lazy(() => import('./pages/TechTransfer').then(m => ({ default: m.TechTransfer })));
const MedicalInterventions = lazy(() => import('./pages/MedicalInterventions').then(m => ({ default: m.MedicalInterventions })));
const ButterflyCalculator = lazy(() => import('./pages/ButterflyCalculator').then(m => ({ default: m.ButterflyCalculator })));
const SafetyProtocols = lazy(() => import('./pages/SafetyProtocols').then(m => ({ default: m.SafetyProtocols })));
const TemporalMap = lazy(() => import('./pages/TemporalMap').then(m => ({ default: m.TemporalMap })));
const BootstrapBlueprints = lazy(() => import('./pages/BootstrapBlueprints').then(m => ({ default: m.BootstrapBlueprints })));
const Bookmarks = lazy(() => import('./pages/Bookmarks').then(m => ({ default: m.Bookmarks })));
const Progress = lazy(() => import('./pages/Progress').then(m => ({ default: m.Progress })));
const Podcasts = lazy(() => import('./pages/Podcasts').then(m => ({ default: m.Podcasts })));
const ReviewSession = lazy(() => import('./components/ReviewSession').then(m => ({ default: m.ReviewSession })));
const CompanionGallery = lazy(() => import('./pages/CompanionGallery').then(m => ({ default: m.CompanionGallery })));
const WorldEvents = lazy(() => import('./pages/WorldEvents').then(m => ({ default: m.WorldEvents })));
const PlacesToLive = lazy(() => import('./pages/PlacesToLive').then(m => ({ default: m.PlacesToLive })));
const PlacesToVisit = lazy(() => import('./pages/PlacesToVisit').then(m => ({ default: m.PlacesToVisit })));
const Engineering = lazy(() => import('./pages/Engineering').then(m => ({ default: m.Engineering })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const NotFound = lazy(() => import('./pages/NotFound'));

function Lazy({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      {children}
    </Suspense>
  );
}

export function Dashboard() {
  const { dueCount, loading } = useSpacedRepetition();
  const { providers, loading: providersLoading } = useProviderSettings();
  const { recent } = useRecentlyViewed();
  const { profile } = useCompetency();
  const { bookmarks } = useBookmarks();

  // Quick-stats for the "Your Progress" widget. profile is keyed by topic and
  // each value is { score, questionsAnswered, correctAnswers } — a topic counts
  // as "viewed" once it has any answered question, and avg competency is the
  // mean of per-topic scores (0–100).
  const modulesViewed = Object.keys(profile).filter(
    (k) => profile[k].questionsAnswered > 0,
  ).length;
  const competencyKeys = Object.keys(profile);
  const avgCompetency = competencyKeys.length > 0
    ? Math.round(competencyKeys.reduce((sum, k) => sum + profile[k].score, 0) / competencyKeys.length)
    : 0;
  const bookmarkCount = bookmarks.length;
  const reviewsDue = dueCount;
  const hasActivity = modulesViewed > 0 || bookmarkCount > 0 || reviewsDue > 0;
  const [onboardDismissed, setOnboardDismissed] = useState(() => {
    try {
      return localStorage.getItem('tt-onboard-dismissed') === '1';
    } catch {
      return false;
    }
  });

  const dismissOnboard = () => {
    setOnboardDismissed(true);
    try {
      localStorage.setItem('tt-onboard-dismissed', '1');
    } catch {
      // private mode / quota — ignore
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Welcome, Traveler.</h1>
        <p className="text-neutral-400">You are about to depart for the modern era (1970s–2001). Select a module to prepare.</p>
      </div>

      {/* Onboarding banner — shown only when no LLM provider is configured
          and the user hasn't dismissed it. Waits for providersLoading so we
          don't flash the banner for users who DO have a provider saved. */}
      {!providersLoading && providers.length === 0 && !onboardDismissed && (
        <div className="p-4 bg-indigo-950/30 border border-indigo-900/50 rounded-lg flex items-start gap-3">
          <Cpu className="size-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-neutral-100">Unlock the AI Quiz</h3>
            <p className="text-sm text-neutral-400 mt-1">
              Configure an LLM provider (OpenAI, Claude, Gemini, etc.) to chat with an AI examiner about prices, sports, slang, and more.
            </p>
            <Link
              to="/settings"
              className="inline-block mt-3 px-3 py-2 rounded bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-500 transition-colors"
            >
              Configure LLM
            </Link>
          </div>
          <button
            type="button"
            onClick={dismissOnboard}
            aria-label="Dismiss onboarding banner"
            className="text-neutral-500 hover:text-neutral-300 p-1 shrink-0 cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Quick Stats — only show once the user has any activity */}
      {hasActivity && (
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg">
            <div className="text-2xl font-bold text-white">{modulesViewed}<span className="text-sm text-neutral-500">/12</span></div>
            <div className="text-[10px] uppercase tracking-wider text-neutral-500">Modules</div>
          </div>
          <div className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg">
            <div className="text-2xl font-bold text-white">{avgCompetency}<span className="text-sm text-neutral-500">%</span></div>
            <div className="text-[10px] uppercase tracking-wider text-neutral-500">Quiz Score</div>
          </div>
          <div className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg">
            <div className="text-2xl font-bold text-white">{bookmarkCount}</div>
            <div className="text-[10px] uppercase tracking-wider text-neutral-500">Bookmarks</div>
          </div>
          <div className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg">
            <div className="text-2xl font-bold text-white">{reviewsDue}</div>
            <div className="text-[10px] uppercase tracking-wider text-neutral-500">Reviews Due</div>
          </div>
        </div>
      )}

      {/* Live region is always in the DOM so screen readers announce the
          badge when its content appears or the dueCount changes. aria-busy
          signals to assistive tech that the review queue is still loading. */}
      <div aria-live="polite" role="status" aria-busy={loading}>
        {!loading && dueCount > 0 && (
          <Link to="/review">
            <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-lg px-4 py-3 flex items-center justify-between hover:border-indigo-500/60 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-lg">🧠</span>
                <div>
                  <span className="text-sm font-semibold text-indigo-300">Review Due</span>
                  <span className="text-xs text-neutral-400 ml-2">{dueCount} topic{dueCount !== 1 ? 's' : ''} waiting</span>
                </div>
              </div>
              <span className="text-xs font-medium text-indigo-400 hover:text-indigo-300">Start Review →</span>
            </div>
          </Link>
        )}
      </div>

      {/* Recently Viewed — surfaces the last few entries the user opened,
          persisted across sessions via localStorage. Hidden until there's
          at least one entry. */}
      {recent.length > 0 && (
        <section aria-labelledby="recently-viewed-heading">
          <h2 id="recently-viewed-heading" className="text-sm font-semibold text-neutral-300 mb-3">Recently Viewed</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recent.map((entry) => (
              <Link
                key={entry.id}
                to={entry.path}
                className="block p-3 rounded-lg border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 hover:border-neutral-700 transition-colors"
              >
                <div className="text-[10px] text-neutral-500 uppercase tracking-wider">{entry.module}</div>
                <div className="text-sm font-medium text-neutral-200 mt-0.5 truncate">{entry.title}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

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

        <Card className="bg-neutral-900 border-neutral-800 hover:border-amber-500/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-white">⚡ The Run</CardTitle>
            <CardDescription className="text-neutral-400">Jump to an era with your almanac. Grow capital, keep your cover, retire rich.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/run" className={buttonVariants({ variant: "secondary", className: "w-full text-center" })}>
              Start a Run
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
  // True while an async search (first-time data load) is in flight. After the
  // datasets are cached the search modal feels synchronous again.
  const [isSearching, setIsSearching] = useState(false);
  // Tracks the latest keystroke so an in-flight search only commits its
  // results if the user hasn't typed something newer (stale-result guard).
  const searchQueryRef = useRef('');
  const [isCompanionOpen, setIsCompanionOpen] = useState(false);
  const [isShortcutHintOpen, setIsShortcutHintOpen] = useState(false);
  const { activeCompanion, selectCompanion, customName, setCustomName, customPrompt, setCustomPrompt, companionProvider, setCompanionProvider, userName, setUserName } = useCompanion();
  // Surfaced as an amber dot next to the Quiz link — the only module that
  // depends on a live LLM call, so going offline actually breaks it.
  const isOnline = useOnlineStatus();

  // Focus traps for the two modal dialogs. Each ref attaches to the dialog
  // container; the hook handles trapping Tab/Shift+Tab, focusing the first
  // element on open, and restoring focus to the trigger on close.
  const searchModalRef = useModalFocus<HTMLDivElement>(isSearchOpen);
  const companionModalRef = useModalFocus<HTMLDivElement>(isCompanionOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const isTyping = active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement;

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(open => !open);
        return;
      }

      if (e.key === 'Escape') {
        if (isSearchOpen) setIsSearchOpen(false);
        else if (isCompanionOpen) setIsCompanionOpen(false);
        else if (isShortcutHintOpen) setIsShortcutHintOpen(false);
        return;
      }

      if (e.key === '?' && !isTyping) {
        setIsShortcutHintOpen(prev => !prev);
        return;
      }

      if (e.key === 'b' && !isTyping && !isSearchOpen && !isCompanionOpen) {
        window.location.href = '/bookmarks';
        return;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, isCompanionOpen, isShortcutHintOpen]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    searchQueryRef.current = query;
    setSearchQuery(query);

    // Empty query clears results synchronously — no data load needed.
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // Kick off an async search. On the very first search this awaits the
    // one-time dataset load; afterwards the loader cache makes this instant.
    setIsSearching(true);
    void searchAll(query)
      .then(results => {
        // Only commit if the user hasn't typed a newer query since.
        if (searchQueryRef.current === query) {
          setSearchResults(results);
        }
      })
      .finally(() => {
        if (searchQueryRef.current === query) {
          setIsSearching(false);
        }
      });
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  // Warm the dataset cache the moment the search modal opens so the user's
  // first keystroke resolves from cache instead of triggering a load.
  useEffect(() => {
    if (isSearchOpen) {
      void preloadSearchData();
    }
  }, [isSearchOpen]);

  // Group search results by module
  const groupedResults = searchResults.reduce((acc, result) => {
    if (!acc[result.module]) {
      acc[result.module] = [];
    }
    acc[result.module].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <div className="min-h-[100dvh] bg-black text-neutral-50 flex flex-col font-sans">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        Skip to main content
      </a>
      <OfflineBanner />
      <header className="border-b border-neutral-800 bg-neutral-950/50 backdrop-blur-md sticky top-0 z-50 safe-area-top">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="text-xl font-extrabold tracking-tight bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent shrink-0">
            Time Traveler's Guide
          </Link>
          <div className="flex items-center gap-4 flex-1 justify-end">
            <div className="lg:hidden">
              <MobileNav
                activeCompanionAvatar={activeCompanion.avatar}
                activeCompanionName={activeCompanion.name}
                onCompanionClick={() => setIsCompanionOpen(true)}
                onSearchClick={() => setIsSearchOpen(true)}
              />
            </div>
            {/* Mobile-only search button — visible below the lg breakpoint
                where the desktop search pill is hidden. size-11 = 44px touch
                target per WCAG 2.5.5. */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="lg:hidden flex items-center justify-center size-11 rounded-md border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 text-neutral-400 hover:text-white transition-all cursor-pointer select-none"
              aria-label="Search the archive"
            >
              <Search className="size-4" />
            </button>
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
              <Link to="/quiz" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                Quiz
                {!isOnline && <span className="ml-1 text-[9px] text-amber-400" aria-label="Offline">●</span>}
              </Link>
              <Link to="/run" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                Run
                {!isOnline && <span className="ml-1 text-[9px] text-amber-400" aria-label="Offline">●</span>}
              </Link>
              <Link to="/bookmarks" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Bookmarks</Link>
              <Link to="/podcasts" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Podcasts</Link>
              <Link to="/progress" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Progress</Link>
              <Link to="/companions" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Companions</Link>
              <Link to="/world-events" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">World Events</Link>
              <Link to="/places-to-live" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Places to Live</Link>
              <Link to="/places-to-visit" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Places to Visit</Link>
              <Link to="/engineering" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Engineering</Link>
            </nav>
            <CompanionSelector />
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3 py-2.5 rounded-full border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 text-neutral-400 hover:text-white text-xs transition-all cursor-pointer select-none"
              aria-label="Search the archive"
            >
              <Search className="size-3.5" />
              <span className="hidden sm:inline">Search archive...</span>
              <kbd className="hidden sm:inline-flex ml-2 pointer-events-none h-5 select-none items-center gap-1 rounded border border-neutral-800 bg-neutral-950 px-1.5 font-mono text-[10px] font-medium text-neutral-500">
                Ctrl+K
              </kbd>
            </button>
            <Link
              to="/settings"
              className="flex items-center gap-2 px-3 py-2.5 rounded-full border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 text-neutral-400 hover:text-white text-xs transition-all cursor-pointer select-none"
              aria-label="LLM Settings"
              title="Configure LLM API keys"
            >
              <SettingsIcon className="size-3.5" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
            <ThemeToggle />
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3 py-2.5 rounded-full border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 text-neutral-400 hover:text-white text-xs transition-all cursor-pointer select-none print:hidden"
              title="Print Dossier on Acid-Free Paper"
              aria-label="Print guide"
            >
              <Printer className="size-3.5" />
              <span className="hidden sm:inline">Print Guide</span>
            </button>
          </div>
        </div>
      </header>
      <InstallPrompt />
      <main id="main-content" tabIndex={-1} className="flex-1 container mx-auto px-4 py-12 pb-20 focus:outline-none safe-area-bottom">
        {children}
      </main>

      {/* Global Search Overlay Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start sm:items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            ref={searchModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-modal-title"
            className="bg-neutral-900 border border-neutral-800 w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90dvh] overflow-hidden animate-in zoom-in-95 duration-200"
          >
            <h2 id="search-modal-title" className="sr-only">Search the Archive</h2>
            <div className="flex items-center gap-3 p-4 border-b border-neutral-800">
              <Search className="size-5 text-neutral-400 shrink-0" />
              <input
                type="text"
                placeholder="Search across all historical guides and records..."
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search the archive"
                className="bg-transparent text-white border-0 focus:outline-none focus:ring-0 w-full text-base"
                autoFocus
              />
              <button onClick={closeSearch} className="text-neutral-500 hover:text-white transition-colors cursor-pointer" aria-label="Close search">
                <X className="size-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Announce search result count to screen readers. aria-live
                  region is always present so updates are spoken as the user
                  types; aria-atomic ensures the full phrase is read each time. */}
              {searchQuery !== '' && (
                <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                  {isSearching
                    ? 'Searching the archive'
                    : Object.keys(groupedResults).length === 0
                    ? 'No results found'
                    : `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} found for ${searchQuery}`}
                </div>
              )}
              {searchQuery === '' ? (
                <div className="text-neutral-500 text-center py-20">
                  <p className="text-lg font-medium">Search the Archive</p>
                  <p className="text-sm mt-1">Type in a year, sports team, price, or disaster.</p>
                </div>
              ) : isSearching ? (
                <div className="text-neutral-500 text-center py-20" aria-busy="true">
                  <p className="text-lg font-medium animate-pulse">Searching the archive…</p>
                  <p className="text-sm mt-1">Loading historical records.</p>
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
                        <div
                          key={idx}
                          className="flex items-start gap-2 p-3 rounded-lg border border-neutral-800/50 bg-neutral-950/40 hover:bg-neutral-950/80 hover:border-indigo-500/30 transition-all"
                        >
                          <Link
                            to={item.link}
                            onClick={closeSearch}
                            className="flex-1 min-w-0"
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
                          <BookmarkButton module={item.module} entryId={item.title} title={item.title} />
                        </div>
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start sm:items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            ref={companionModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="companion-modal-title"
            className="bg-neutral-900 border border-neutral-800 w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[90dvh] overflow-hidden animate-in zoom-in-95 duration-200"
          >
            <div className="flex justify-between items-center p-4 border-b border-neutral-800">
              <h2 id="companion-modal-title" className="text-base font-bold text-white flex items-center gap-2">
                <span>⏱️</span> Time Travel Companion
              </h2>
              <button
                onClick={() => setIsCompanionOpen(false)}
                className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
                aria-label="Close companion settings"
              >
                <X className="size-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <label htmlFor="companion-user-name" className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase block mb-1">
                  Traveler Name
                </label>
                <input
                  id="companion-user-name"
                  type="text"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  placeholder="Yune"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                          onClick={() => { selectCompanion(c.id); showSuccess(`Companion changed to ${c.id === 'custom' ? customName : c.name}`); }}
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
                            <label htmlFor="companion-custom-name" className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase block mb-1">Companion Name</label>
                            <input
                              id="companion-custom-name"
                              type="text"
                              value={customName}
                              onChange={e => setCustomName(e.target.value)}
                              placeholder="e.g. Sarcastic Time Cop"
                              className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                          <div>
                            <label htmlFor="companion-custom-prompt" className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase block mb-1">Companion Prompt / Persona Description</label>
                            <textarea
                              id="companion-custom-prompt"
                              value={customPrompt}
                              onChange={e => setCustomPrompt(e.target.value)}
                              placeholder="Describe your companion's voice, personality, knowledge, and catchphrases..."
                              rows={3}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-sans leading-relaxed"
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

      {/* Shortcut Hint Overlay */}
      {isShortcutHintOpen && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl p-4 w-64 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Keyboard Shortcuts</h3>
            <button
              onClick={() => setIsShortcutHintOpen(false)}
              className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
              aria-label="Close keyboard shortcuts"
            >
              <X className="size-3.5" />
            </button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Search</span>
              <kbd className="px-1.5 py-0.5 rounded border border-neutral-800 bg-neutral-950 font-mono text-[10px] text-neutral-500">Ctrl+K</kbd>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Close dialogs</span>
              <kbd className="px-1.5 py-0.5 rounded border border-neutral-800 bg-neutral-950 font-mono text-[10px] text-neutral-500">Esc</kbd>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Bookmarks</span>
              <kbd className="px-1.5 py-0.5 rounded border border-neutral-800 bg-neutral-950 font-mono text-[10px] text-neutral-500">B</kbd>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Show shortcuts</span>
              <kbd className="px-1.5 py-0.5 rounded border border-neutral-800 bg-neutral-950 font-mono text-[10px] text-neutral-500">?</kbd>
            </div>
          </div>
        </div>
      )}

      {/* Sonner's <section> already exposes aria-live="polite",
          aria-relevant="additions text", and aria-atomic="false",
          so toasts are announced to screen readers without an extra
          wrapper (a wrapper would cause duplicate announcements). */}
      <Toaster theme="dark" />
    </div>
  );
}

function App() {
  return (
    <CompanionProvider>
      <Layout>
        <ErrorBoundary>
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
            <Route path="/run" element={<Lazy><Run /></Lazy>} />
            <Route path="/timeline" element={<Lazy><TemporalMap /></Lazy>} />
            <Route path="/blueprints" element={<Lazy><BootstrapBlueprints /></Lazy>} />
            <Route path="/bookmarks" element={<Lazy><Bookmarks /></Lazy>} />
            <Route path="/podcasts" element={<Lazy><Podcasts /></Lazy>} />
            <Route path="/progress" element={<Lazy><Progress /></Lazy>} />
            <Route path="/review" element={<Lazy><ReviewSession /></Lazy>} />
            <Route path="/companions" element={<Lazy><CompanionGallery /></Lazy>} />
            <Route path="/world-events" element={<Lazy><WorldEvents /></Lazy>} />
            <Route path="/places-to-live" element={<Lazy><PlacesToLive /></Lazy>} />
            <Route path="/places-to-visit" element={<Lazy><PlacesToVisit /></Lazy>} />
            <Route path="/engineering" element={<Lazy><Engineering /></Lazy>} />
            <Route path="/settings" element={<Lazy><Settings /></Lazy>} />
            <Route path="*" element={<Lazy><NotFound /></Lazy>} />
          </Routes>
        </ErrorBoundary>
      </Layout>
    </CompanionProvider>
  );
}

export default App;
