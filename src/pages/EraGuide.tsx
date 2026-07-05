import { useState, useEffect } from 'react';
import { loadEraGuide } from '@/data/loader';
import type { EraGuideEntry } from '@/data/era-guide';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AthenaCommentary } from '@/components/AthenaCommentary';
import { ChatAboutThis } from '@/components/ChatAboutThis';
import { PalaceHook } from '@/components/PalaceHook';
import { PalaceLink } from '@/components/PalaceLink';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useURLState } from '../hooks/useURLState';

const SLANG_DICTIONARY: Record<string, { replacement: string; explanation: string; risk: 'low' | 'high' }> = {
  'sus': { replacement: 'sketchy', explanation: 'Use "sketchy" or "shady". "Sus" raises immediate eyebrows.', risk: 'low' },
  'rizz': { replacement: 'smooth talk', explanation: 'Use "charm", "smooth talker", or "fast talker".', risk: 'low' },
  'bet': { replacement: 'deal', explanation: 'Use "deal", "count me in", or "sounds good".', risk: 'low' },
  'no cap': { replacement: 'no lie', explanation: 'Use "no lie", "for real", or "honest to God".', risk: 'low' },
  'cap': { replacement: 'lying', explanation: 'Use "lying" or "fibbing".', risk: 'low' },
  'google': { replacement: 'look it up in the library', explanation: 'CRITICAL: Google does not exist. Use "library", "encyclopedia", or "microfiche".', risk: 'high' },
  'wifi': { replacement: 'telephone wires', explanation: 'CRITICAL: WiFi does not exist. Use "modem link" or "telephone line".', risk: 'high' },
  'internet': { replacement: 'ARPANET / bulletin boards', explanation: 'The public web does not exist. Refer to ARPANET or BBS systems.', risk: 'high' },
  'cellphone': { replacement: 'payphone', explanation: 'Refer to "payphones" or "car phones" (rare).', risk: 'high' },
  'smartphone': { replacement: 'car phone', explanation: 'Refer to "payphones" or "booth".', risk: 'high' },
  'cringe': { replacement: 'uncool', explanation: 'Use "uncool", "dorky", or "embarrassing".', risk: 'low' },
  'mid': { replacement: 'so-so', explanation: 'Use "so-so", "average", or "mediocre".', risk: 'low' },
  'flex': { replacement: 'show off', explanation: 'Use "show off" or "grandstand".', risk: 'low' },
  'ghost': { replacement: 'ditch', explanation: 'Use "ditch" or "blow off".', risk: 'low' },
  'skibidi': { replacement: 'weird', explanation: 'WARNING: Brainrot slang is absolute gibberish and causes immediate timeline threat.', risk: 'high' },
  'gyatt': { replacement: 'golly', explanation: 'Gibberish term. Use "golly" or "gosh".', risk: 'high' },
};

function SlangTranslator() {
  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState<{ translatedText: string; warnings: string[] }>({
    translatedText: '',
    warnings: []
  });

  const handleTranslate = (text: string) => {
    setInputText(text);
    if (!text.trim()) {
      setTranslation({ translatedText: '', warnings: [] });
      return;
    }

    let current = text;
    const warnings: string[] = [];

    Object.entries(SLANG_DICTIONARY).forEach(([word, info]) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      if (regex.test(current)) {
        current = current.replace(regex, `"${info.replacement}"`);
        if (info.risk === 'high') {
          warnings.push(`Anachronism check failed: "${word}" — ${info.explanation}`);
        }
      }
    });

    setTranslation({ translatedText: current, warnings });
  };

  return (
    <Card className="mb-6 bg-neutral-950 border-neutral-850 border-l-4 border-l-purple-500 animate-in fade-in slide-in-from-top-2 duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold text-purple-400 flex items-center gap-2">
          <span>💬</span> Slang Safety Checker &amp; Translator
        </CardTitle>
        <CardDescription className="text-xs text-neutral-400">
          Scan your dialogue for modern anachronisms before talking to past residents to prevent timeline suspicion.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="slang-input" className="text-[10px] font-bold text-neutral-500 uppercase">Input Dialogue</label>
          <input
            id="slang-input"
            type="text"
            value={inputText}
            onChange={e => handleTranslate(e.target.value)}
            placeholder="Type your phrase (e.g., that guy is sus, I will google it on my cellphone no cap)"
            className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {inputText.trim() && (
          <div className="space-y-2.5 pt-2 border-t border-neutral-900 animate-in fade-in duration-200">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase">Safe Era-Appropriate Phrase</label>
              <div className="p-2.5 bg-neutral-900/60 border border-neutral-800 rounded text-xs text-neutral-200 italic leading-relaxed">
                {translation.translatedText}
              </div>
            </div>

            {translation.warnings.length > 0 && (
              <div className="space-y-1 bg-red-950/20 border border-red-900/40 p-2.5 rounded text-xs text-red-405">
                <div className="font-bold flex items-center gap-1 text-red-400">
                  <span>🚨</span> Anachronism Warnings:
                </div>
                <ul className="list-disc list-inside space-y-0.5 mt-1 text-[11px] text-red-400/90 leading-relaxed">
                  {translation.warnings.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {translation.warnings.length === 0 && (
              <div className="text-[11px] text-green-400 flex items-center gap-1">
                <span>✅</span> Dialogue scanned. Standard colloquial equivalents generated. Risk: LOW.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function EraGuide() {
  const [entries, setEntries] = useState<EraGuideEntry[] | null>(null);
  // useURLState must run unconditionally (Rules of Hooks), so it is called
  // before the data-load early return. The default is resolved after data
  // loads via `activeCategory` reconciliation below.
  const [urlCategory, setUrlCategory] = useURLState('category', '');

  useEffect(() => {
    void loadEraGuide().then(setEntries);
  }, []);

  if (!entries) {
    return (
      <div className="space-y-6 animate-pulse" role="status" aria-live="polite">
        <div className="h-9 w-72 bg-neutral-900 rounded" />
        <div className="h-12 bg-neutral-900 rounded" />
        <div className="h-80 bg-neutral-900/50 rounded-lg border border-neutral-800" />
        <span className="sr-only">Loading era guide…</span>
      </div>
    );
  }

  const categories = Array.from(new Set(entries.map(e => e.category)));
  // Fall back to the first category when the URL has no (or a stale) value.
  const activeCategory = categories.includes(urlCategory) ? urlCategory : categories[0];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Era Integration Guide</h1>
        <p className="text-neutral-400 mt-2">Essential knowledge to blend in without altering the timeline.</p>
      </div>

      <Tabs value={activeCategory} onValueChange={setUrlCategory} className="w-full">
        <TabsList className="bg-neutral-900 border border-neutral-800">
          {categories.map(cat => (
            <TabsTrigger key={cat} value={cat} className="data-[state=active]:bg-neutral-800 data-[state=active]:text-white text-neutral-400">
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map(cat => (
          <TabsContent key={cat} value={cat} className="mt-6">
            {cat === 'Slang' && <SlangTranslator />}
            <Accordion className="w-full space-y-4">
              {entries.filter(e => e.category === cat).map((entry, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} className="border border-neutral-800 rounded-lg px-4 bg-neutral-900/50">
                  <AccordionTrigger className="hover:no-underline hover:text-indigo-400 transition-colors py-4">
                    <div className="flex items-center gap-4 text-left">
                      <span className="font-semibold text-lg">{entry.item}</span>
                      <span className="px-2 py-1 text-xs font-medium bg-neutral-800 text-neutral-300 rounded-md">
                        {entry.era}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-400 pb-4 space-y-4">
                    <div>
                      <strong className="text-neutral-200 block mb-1">Description</strong>
                      <p>{entry.description}</p>
                    </div>
                    <div className="bg-neutral-950 p-4 rounded-md border border-neutral-800/50 border-l-4 border-l-indigo-500">
                      <strong className="text-indigo-400 block mb-1">Traveler's Advice</strong>
                      <p>{entry.advice}</p>
                    </div>
                    <PalaceHook routeId={entry.id} />
                    <AthenaCommentary entryId={entry.id} />
                    <ChatAboutThis entryId={entry.id} module="era-guide" fields={{ item: entry.item, era: entry.era }} />
                    {entry.tags && entry.tags.length > 0 && (
                      <PalaceLink tags={entry.tags} contextItem={`Era: ${entry.item} (${entry.era})`} excludeId={entry.id} />
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
