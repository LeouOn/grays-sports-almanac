/* eslint-disable react-hooks/set-state-in-effect */
import { useChat, type UIMessage } from '@ai-sdk/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRef, useEffect, useState } from 'react';
import { Cpu, AlertTriangle, Play, HelpCircle, UserCheck, ShieldAlert, ChevronDown, Search, RefreshCw } from 'lucide-react';
import { useCompanion } from '../context/CompanionContext';
import { useCompetency } from '../hooks/useCompetency';
import { defaultCompanions } from '../data/companions';
import { AthenaQuizReaction } from '../components/AthenaQuizReaction';
import { useSearchParams } from 'react-router';

type Tier = 'tier1' | 'tier2' | 'tier3';
type ProviderId = 'google' | 'deepseek' | 'zhipu' | 'minimax' | 'openrouter';

const PROVIDERS: { id: ProviderId; label: string; icon: string; defaultModel: string }[] = [
  { id: 'google',     label: 'Gemini',    icon: '🔵', defaultModel: 'gemini-2.5-flash' },
  { id: 'deepseek',   label: 'DeepSeek',  icon: '🐋', defaultModel: 'deepseek-v4-pro' },
  { id: 'zhipu',      label: 'Zhipu',     icon: '🧠', defaultModel: 'GLM-4' },
  { id: 'minimax',    label: 'MiniMax',   icon: '⚡', defaultModel: 'MiniMax-M3' },
  { id: 'openrouter', label: 'OpenRouter', icon: '🔀', defaultModel: 'google/gemini-2.5-flash' },
];

const ALL_ERAS = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', 'global'];
const CATEGORY_TREE = {
  culture: ['sports', 'slang'],
  science: ['tech', 'blueprints', 'medical'],
  economics: ['prices', 'finance'],
  events: ['disasters', 'safety'],
  engineering: ['cnc_machining', 'semiconductors', 'metallurgy', 'aerospace', 'telecommunications']
};
const ALL_CATEGORIES = Object.keys(CATEGORY_TREE);
const ALL_SUBCATEGORIES = Object.values(CATEGORY_TREE).flat();

export function Quiz() {
  const { activeCompanion, selectCompanion, customName } = useCompanion();
  const [selectedTier, setSelectedTier] = useState<Tier>('tier1');
  const [providerId, setProviderId] = useState<ProviderId>('zhipu');
  const [selectedModel, setSelectedModel] = useState('');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [modelSearch, setModelSearch] = useState('');
  const [selectedEras, setSelectedEras] = useState<string[]>(ALL_ERAS);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(ALL_CATEGORIES);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(ALL_SUBCATEGORIES);
  const [showProfile, setShowProfile] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const { profile, updateCompetency, resetCompetency } = useCompetency();
  
  const processedToolCalls = useRef<Set<string>>(new Set());
  const [searchParams] = useSearchParams();
  const initialEntryId = searchParams.get('entryId');
  const initialQuestion = searchParams.get('q');
  const hasSentInitial = useRef(false);

  const { messages, sendMessage, status, setMessages } = useChat({
    id: `${selectedTier}-${providerId}-${selectedModel}`
  });

  useEffect(() => {
    messages.forEach(m => {
      const toolInvocations = (m as { toolInvocations?: { toolName: string; toolCallId: string; state: string; args: { topic: string; isCorrect: boolean; competenceDelta: number; feedback: string } }[] }).toolInvocations;
      if (toolInvocations && Array.isArray(toolInvocations)) {
        toolInvocations.forEach((tool) => {
          // Process when tool is executed on server or client
          if (tool.toolName === 'evaluateAnswer' && !processedToolCalls.current.has(tool.toolCallId)) {
            const args = tool.args;
            if (args) {
              updateCompetency(args.topic, args.isCorrect, args.competenceDelta);
              processedToolCalls.current.add(tool.toolCallId);
            }
          }
        });
      }
    });
  }, [messages, updateCompetency]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch available models when provider changes
  useEffect(() => {
    setAvailableModels([]);
    setSelectedModel('');
    setModelsLoading(true);
    setModelDropdownOpen(false);
    const controller = new AbortController();
    fetch(`/api/models?provider=${providerId}`, { signal: controller.signal })
      .then(r => r.json())
      .then(data => {
        if (data.models && Array.isArray(data.models)) {
          setAvailableModels(data.models);
          // Auto-select the default model if it exists in the list, otherwise use first
          const def = PROVIDERS.find(p => p.id === providerId)!.defaultModel;
          if (data.models.includes(def)) setSelectedModel(def);
          else if (data.models.length > 0) setSelectedModel(data.models[0]);
          else setSelectedModel(def);
        } else {
          setSelectedModel(PROVIDERS.find(p => p.id === providerId)!.defaultModel);
        }
      })
      .catch(() => {
        setSelectedModel(PROVIDERS.find(p => p.id === providerId)!.defaultModel);
      })
      .finally(() => setModelsLoading(false));
    return () => controller.abort();
  }, [providerId]);

  const isLoading = status === 'streaming' || status === 'submitted';

  const getRequestBody = () => ({
    tier: selectedTier,
    provider: providerId,
    model: selectedModel || undefined,
    companionName: activeCompanion.name,
    companionPrompt: activeCompanion.prompt,
    eras: selectedEras,
    categories: selectedCategories,
    subcategories: selectedSubcategories,
    sessionId,
  });

  // Auto-send question from "Chat about this" navigation
  useEffect(() => {
    if (initialQuestion && initialEntryId && !hasSentInitial.current && messages.length === 0) {
      hasSentInitial.current = true;
      sendMessage({ text: initialQuestion }, { body: getRequestBody() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuestion, initialEntryId, messages.length, sendMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage({ text: input }, { body: getRequestBody() });
      setInput('');
    }
  };

  const getMessageText = (m: UIMessage): string => {
    if (!m.parts) return '';
    return m.parts
      .map((part) => {
        if (part.type === 'text') return part.text;
        return '';
      })
      .join('');
  };

  const handleTierChange = (tier: Tier) => {
    setSelectedTier(tier);
    setMessages([]);
  };

  // Helper to extract suspicion percentage from messages
  const extractSuspicion = (): number | null => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') {
        const text = getMessageText(messages[i]);
        const match = text.match(/\[Suspicion:\s*(\d+)%\]/i);
        if (match) {
          return Math.min(100, Math.max(0, parseInt(match[1], 10)));
        }
      }
    }
    // Return a default initial suspicion for Tier 3, or null for Tier 1
    if (selectedTier === 'tier3' && messages.length > 0) return 10;
    if (selectedTier === 'tier2' && messages.length > 0) return 0;
    return null;
  };

  const suspicion = extractSuspicion();

  // Helper to split examiner and companion text
  const parseMessage = (text: string) => {
    const companionRegex = /\[Companion:\s*(?:"([^"]*)"|([^\]]*?))\]/i;
    const match = text.match(companionRegex);
    
    let mainText = text;
    let companionText = '';
    
    if (match) {
      mainText = text.replace(companionRegex, '').trim();
      companionText = (match[1] || match[2] || '').trim();
    }
    
    mainText = mainText.replace(/\[Suspicion:\s*\d+%\]/i, '').trim();
    
    return { mainText, companionText };
  };



  const getSuspicionColor = (value: number) => {
    if (value < 30) return 'bg-green-500 text-green-400';
    if (value < 70) return 'bg-yellow-500 text-yellow-400';
    return 'bg-red-500 text-red-400';
  };

  const toggleSelection = (setter: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setter(prev => {
      if (prev.includes(item)) {
        return prev.filter(i => i !== item);
      }
      return [...prev, item];
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">LLM Testing Module</h1>
        <p className="text-neutral-400 mt-2">Prove your factual recall, judgment, and roleplay skills across the modern era.</p>
      </div>
      <div className="flex gap-2 p-1 bg-neutral-900 border border-neutral-800 rounded-lg max-w-md mx-auto" role="radiogroup" aria-label="Quiz tier">
        <button
          onClick={() => handleTierChange('tier1')}
          role="radio"
          aria-checked={selectedTier === 'tier1'}
          className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${selectedTier === 'tier1' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'}`}
        >
          Tier 1: Recall
        </button>
        <button
          onClick={() => handleTierChange('tier2')}
          role="radio"
          aria-checked={selectedTier === 'tier2'}
          className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${selectedTier === 'tier2' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'}`}
        >
          Tier 2: Judgment
        </button>
        <button
          onClick={() => handleTierChange('tier3')}
          role="radio"
          aria-checked={selectedTier === 'tier3'}
          className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${selectedTier === 'tier3' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'}`}
        >
          Tier 3: Roleplay
        </button>
      </div>

      {/* Provider Selector */}
      <div className="flex items-center justify-center gap-2">
        <Cpu className="size-3.5 text-neutral-600" />
        <div className="flex gap-1 p-0.5 bg-neutral-900 border border-neutral-800/60 rounded-md" role="radiogroup" aria-label="LLM provider">
          {PROVIDERS.map(p => (
            <button
              key={p.id}
              onClick={() => setProviderId(p.id)}
              role="radio"
              aria-checked={providerId === p.id}
              className={`px-2.5 py-1 text-[11px] font-medium rounded transition-all cursor-pointer ${
                providerId === p.id
                  ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title={`${p.label} — ${p.id === 'google' ? 'gemini-2.0-flash' : p.id === 'deepseek' ? 'deepseek-chat' : p.id === 'zhipu' ? 'glm-4-flash' : p.id === 'minimax' ? 'MiniMax-Text-01' : 'via OpenRouter'}`}
            >
              {p.icon}
            </button>
          ))}
        </div>
        <span className="text-[10px] text-neutral-600 ml-1 hidden sm:inline">
          {PROVIDERS.find(p => p.id === providerId)?.label}
        </span>
      </div>

      {/* Model Selector */}
      <div className="relative max-w-xs mx-auto w-full">
        <button
          onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
          className="w-full flex items-center justify-between gap-2 px-3 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded-md text-neutral-300 hover:border-neutral-700 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2 min-w-0">
            {modelsLoading ? (
              <RefreshCw className="size-3 animate-spin text-neutral-500" />
            ) : (
              <span className="text-[10px] text-neutral-500">model</span>
            )}
            <span className="truncate font-mono text-[11px]">
              {modelsLoading ? 'Loading...' : (selectedModel || 'default')}
            </span>
          </span>
          <ChevronDown className={`size-3 text-neutral-500 transition-transform ${modelDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {modelDropdownOpen && (
          <div className="absolute top-full mt-1 w-full bg-neutral-900 border border-neutral-800 rounded-md shadow-lg z-50 max-h-60 overflow-hidden flex flex-col">
            {/* Search */}
            <div className="p-2 border-b border-neutral-800 flex items-center gap-2">
              <Search className="size-3 text-neutral-500 shrink-0" />
              <input
                type="text"
                value={modelSearch}
                onChange={e => setModelSearch(e.target.value)}
                placeholder="Search or type custom model..."
                aria-label="Filter models"
                className="flex-1 bg-transparent text-xs text-neutral-200 outline-none placeholder:text-neutral-600"
                autoFocus
              />
            </div>
            {/* Filtered list */}
            <div className="overflow-y-auto flex-1">
              {availableModels
                .filter(m => !modelSearch || m.toLowerCase().includes(modelSearch.toLowerCase()))
                .map(m => (
                  <button
                    key={m}
                    onClick={() => { setSelectedModel(m); setModelDropdownOpen(false); setModelSearch(''); }}
                    className={`w-full text-left px-3 py-1.5 text-[11px] font-mono transition-colors cursor-pointer ${
                      m === selectedModel
                        ? 'bg-indigo-900/40 text-indigo-300'
                        : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              {/* Custom model input — always shown as an option */}
              {modelSearch && !availableModels.some(m => m.toLowerCase() === modelSearch.toLowerCase()) && (
                <button
                  onClick={() => { setSelectedModel(modelSearch.trim()); setModelDropdownOpen(false); setModelSearch(''); }}
                  className="w-full text-left px-3 py-1.5 text-[11px] text-amber-400 hover:bg-neutral-800 cursor-pointer border-t border-neutral-800"
                >
                  Use custom: <span className="font-mono">{modelSearch.trim()}</span>
                </button>
              )}
              {!modelSearch && availableModels.length === 0 && !modelsLoading && (
                <div className="px-3 py-4 text-[11px] text-neutral-500 text-center">
                  No models fetched — using default
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Era and Topic Selectors */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 space-y-3">
        <div>
          <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Eras</div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Eras to include in quiz">
            {ALL_ERAS.map(era => {
              const isSelected = selectedEras.includes(era);
              return (
                <button
                  key={era}
                  onClick={() => toggleSelection(setSelectedEras, era)}
                  aria-pressed={isSelected}
                  className={`px-2 py-0.5 text-[11px] rounded border transition-colors cursor-pointer ${
                    isSelected 
                      ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300' 
                      : 'bg-neutral-950 border-neutral-800 text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {era}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div>
              <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Domains</div>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Domains to include in quiz">
                {ALL_CATEGORIES.map(cat => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleSelection(setSelectedCategories, cat)}
                      aria-pressed={isSelected}
                      className={`px-2 py-0.5 text-[11px] rounded border transition-colors cursor-pointer capitalize ${
                        isSelected 
                          ? 'bg-amber-600/20 border-amber-500/50 text-amber-300' 
                          : 'bg-neutral-950 border-neutral-800 text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
            {selectedCategories.length > 0 && (
              <div>
                <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Sub-domains</div>
                <div className="flex flex-wrap gap-1.5" role="group" aria-label="Sub-domains to include in quiz">
                  {selectedCategories.flatMap(cat => CATEGORY_TREE[cat as keyof typeof CATEGORY_TREE]).map(sub => {
                    const isSelected = selectedSubcategories.includes(sub);
                    return (
                      <button
                        key={sub}
                        onClick={() => toggleSelection(setSelectedSubcategories, sub)}
                        aria-pressed={isSelected}
                        className={`px-2 py-0.5 text-[11px] rounded border transition-colors cursor-pointer capitalize ${
                          isSelected 
                            ? 'bg-teal-600/20 border-teal-500/50 text-teal-300' 
                            : 'bg-neutral-950 border-neutral-800 text-neutral-500 hover:text-neutral-300'
                        }`}
                      >
                        {sub}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold border transition-all shrink-0 cursor-pointer ${
              showProfile 
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' 
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <UserCheck className="size-3.5" />
            Competency Profile
          </button>
        </div>
      </div>

      {/* Competency Profile Overlay */}
      {showProfile && (
        <div className="bg-neutral-900 border border-amber-900/40 rounded-lg p-4 space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-amber-500 uppercase tracking-wider">Learner Mastery Profile</h2>
            <button 
              onClick={resetCompetency}
              className="text-xs text-neutral-500 hover:text-red-400 cursor-pointer underline"
            >
              Reset Data
            </button>
          </div>
          
          {Object.keys(profile).length === 0 ? (
            <p className="text-sm text-neutral-500 italic">No competency data recorded yet. Answer questions in the Quiz to build your profile!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(profile).map(([topic, stats]) => (
                <div key={topic} className="bg-neutral-950 p-3 rounded-md border border-neutral-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-neutral-300 capitalize">{topic}</span>
                    <span className="text-xs font-bold text-indigo-400">{stats.score}%</span>
                  </div>
                  <div className="w-full bg-neutral-900 rounded-full h-2 mb-2 overflow-hidden border border-neutral-800">
                    <div 
                      className={`h-2 rounded-full ${stats.score >= 80 ? 'bg-emerald-500' : stats.score >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} 
                      style={{ width: `${stats.score}%` }}
                    ></div>
                  </div>
                  <div className="text-[10px] text-neutral-500 flex justify-between">
                    <span>{stats.correctAnswers} / {stats.questionsAnswered} correct</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader className="border-b border-neutral-800/50 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-white flex items-center gap-2">
              {selectedTier === 'tier1' && '🧠 Tier 1: Factual Recall'}
              {selectedTier === 'tier2' && '⚖️ Tier 2: Situational Judgment'}
              {selectedTier === 'tier3' && '🎭 Tier 3: Immersive Roleplay'}
            </CardTitle>
            <CardDescription className="text-neutral-400">
              {selectedTier === 'tier1' && 'Prove your factual knowledge of prices, sports scores, slang timelines, and technologies.'}
              {selectedTier === 'tier2' && 'Choose actions in historic scenarios. Balance timeline preservation against butterflies.'}
              {selectedTier === 'tier3' && 'Converse in character with post-era residents. Avoid using future terms or modern slang.'}
            </CardDescription>
          </div>
          <div className="shrink-0 flex items-center gap-2 p-1 rounded-md border border-neutral-800 bg-neutral-950/40">
            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider pl-2 hidden md:inline">Partner</span>
            <div className="flex gap-1 pr-1">
              {defaultCompanions.map(c => {
                const isSelected = activeCompanion.id === c.id;
                const displayName = c.id === 'custom' ? customName : c.name;
                return (
                  <button
                    key={c.id}
                    onClick={() => selectCompanion(c.id)}
                    type="button"
                    className={`size-7 rounded flex items-center justify-center text-sm transition-all hover:bg-neutral-800 cursor-pointer ${isSelected ? 'bg-indigo-600 border border-indigo-500 scale-105 shadow-sm' : 'opacity-40'}`}
                    title={`Journey with ${displayName}`}
                  >
                    {c.avatar}
                  </button>
                );
              })}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4 h-[550px] flex flex-col">
            {/* Suspicion Meter Indicator */}
            {suspicion !== null && (
              <div className="bg-neutral-950/80 p-3 rounded-lg border border-neutral-800/80 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center gap-1.5 text-neutral-300">
                    <ShieldAlert className="size-4 text-indigo-400" />
                    Timeline Suspicion Meter
                  </span>
                  <span className={`font-bold ${getSuspicionColor(suspicion).split(' ')[1]}`}>
                    {suspicion}%
                  </span>
                </div>
                <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${getSuspicionColor(suspicion).split(' ')[0]}`}
                    style={{ width: `${suspicion}%` }}
                  />
                </div>
                {suspicion >= 70 && (
                  <p className="text-[10px] text-red-400/90 flex items-center gap-1">
                    <AlertTriangle className="size-3 animate-pulse" />
                    Critical cover threat: local residents suspect timeline interference!
                  </p>
                )}
              </div>
            )}

            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto space-y-4 p-4 border border-neutral-800 rounded-md bg-neutral-950/50"
            >
              {messages.length === 0 ? (
                <div className="text-neutral-500 text-center py-20 flex flex-col items-center justify-center gap-4">
                  <div className="p-4 rounded-full bg-neutral-900 border border-neutral-800">
                    {selectedTier === 'tier1' && <HelpCircle className="size-8 text-indigo-400" />}
                    {selectedTier === 'tier2' && <AlertTriangle className="size-8 text-amber-400" />}
                    {selectedTier === 'tier3' && <Play className="size-8 text-emerald-400 animate-pulse" />}
                  </div>
                  <div>
                    <p className="text-neutral-300 font-semibold">Start your training session</p>
                    <p className="text-sm mt-1 text-neutral-500">
                      {selectedTier === 'tier1' && 'Send a message or type "start" to test your knowledge.'}
                      {selectedTier === 'tier2' && 'Type "start" to enter situational judgment simulations.'}
                      {selectedTier === 'tier3' && 'Type "start" to launch interactive roleplay.'}
                    </p>
                  </div>
                  <Button
                    onClick={() => sendMessage({ text: 'start' }, { body: getRequestBody() })}
                    variant="outline"
                    className="mt-2 text-xs border-neutral-800 hover:bg-neutral-800 hover:text-white cursor-pointer"
                  >
                    Initialize AI Examiner
                  </Button>
                </div>
              ) : (
                messages.map(m => {
                  const rawText = getMessageText(m);
                  if (m.role === 'user') {
                    if (!rawText.trim()) return null;
                    return (
                      <div key={m.id} className="flex justify-end animate-in fade-in slide-in-from-right-1 duration-200">
                        <div className="max-w-[85%] p-3 rounded-lg bg-indigo-600/90 text-white shadow-sm whitespace-pre-wrap">
                          {rawText}
                        </div>
                      </div>
                    );
                  }
                  
                  const { mainText, companionText } = parseMessage(rawText);
                  
                  return (
                    <div key={m.id} className="space-y-3">
                      {mainText.trim() && (
                        <div className="flex justify-start animate-in fade-in slide-in-from-left-1 duration-200">
                          <div className="max-w-[85%] p-3 rounded-lg bg-neutral-800 text-neutral-200 shadow-sm whitespace-pre-wrap">
                            {mainText}
                          </div>
                        </div>
                      )}
                      
                      {((m as { toolInvocations?: { toolName: string; args: { topic: string; feedback: string; isCorrect: boolean; competenceDelta: number }; toolCallId: string }[] }).toolInvocations || []).map((tool) => {
                        if (tool.toolName === 'evaluateAnswer' && tool.args) {
                          const args = tool.args;
                          const isCorrect = args.isCorrect;
                          const delta = args.competenceDelta;
                          return (
                            <div key={tool.toolCallId} className="flex justify-start animate-in fade-in zoom-in duration-300">
                              <div className={`max-w-[85%] px-3 py-2 rounded-lg border ${isCorrect ? 'bg-emerald-950/40 border-emerald-900/50' : 'bg-rose-950/40 border-rose-900/50'}`}>
                                <div className="flex items-center gap-2">
                                  <div className={`flex items-center justify-center size-6 rounded-full ${isCorrect ? 'bg-emerald-600/20 text-emerald-400' : 'bg-rose-600/20 text-rose-400'}`}>
                                    {isCorrect ? '✓' : '✗'}
                                  </div>
                                  <div className="flex-1">
                                    <p className={`text-xs font-semibold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                                      {isCorrect ? 'Correct!' : 'Incorrect'} <span className="opacity-70 font-normal">| {args.topic} {delta > 0 ? `+${delta}` : delta} pts</span>
                                    </p>
                                    {args.feedback && <p className="text-[11px] text-neutral-400 mt-0.5">{args.feedback}</p>}
                                  </div>
                                </div>
                              </div>
                              <AthenaQuizReaction
                                tier={selectedTier === 'tier1' ? 1 : selectedTier === 'tier2' ? 2 : 3}
                                performance={delta >= 8 ? 'high' : delta >= 4 ? 'mid' : 'low'}
                                category={args.topic}
                              />
                            </div>
                          );
                        }
                        return null;
                      })}

                      {companionText.trim() && (
                        <div className="flex justify-start gap-2.5 items-start mt-2">
                          <div className="flex items-center justify-center size-8 rounded-full bg-indigo-950 border border-indigo-800 shrink-0 text-lg shadow-sm" title={activeCompanion.name}>
                            {activeCompanion.avatar}
                          </div>
                          <div className="max-w-[80%] p-3 rounded-lg bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border border-indigo-900/60 text-neutral-200 shadow-md relative animate-in fade-in slide-in-from-left-2 duration-300">
                            <div className="text-[10px] font-bold tracking-wider text-indigo-400 uppercase mb-1">
                              {activeCompanion.name}
                            </div>
                            <div className="text-sm italic leading-relaxed">
                              "{companionText}"
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] p-3 rounded-lg bg-neutral-800 text-neutral-400 animate-pulse shadow-sm">
                    AI is processing...
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder={isLoading ? "AI is typing..." : "Type your message or choice (e.g. A, B)..."}
                aria-label="Quiz answer or message"
                className="bg-neutral-900 border-neutral-800 text-white focus-visible:ring-indigo-500"
                disabled={isLoading}
              />
              <Button type="submit" variant="secondary" disabled={isLoading || !input.trim()}>
                Send
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
