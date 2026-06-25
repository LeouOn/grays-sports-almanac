import { useState, useEffect } from 'react';
import { loadSafety } from '@/data/loader';
import type { SafetyProtocol } from '@/data/safety';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AthenaCommentary } from '@/components/AthenaCommentary';
import { ChatAboutThis } from '@/components/ChatAboutThis';
import { PalaceHook } from '@/components/PalaceHook';
import { PalaceLink } from '@/components/PalaceLink';
import { useURLState } from '../hooks/useURLState';

const categoryIcons: Record<string, string> = {
  'Identity': '🪪',
  'Banking': '🏦',
  'Housing': '🏠',
  'Medical': '🏥',
  'Communication': '📞',
  'Dead Drops': '📮',
};

export function SafetyProtocols() {
  // useURLState must run unconditionally (Rules of Hooks), so it is called
  // before the data-load early return. The default is resolved after data
  // loads via `activeTab` reconciliation below.
  const [searchTerm, setSearchTerm] = useURLState('search', '');
  const [urlTab, setUrlTab] = useURLState('tab', '');
  const [protocols, setProtocols] = useState<SafetyProtocol[] | null>(null);

  useEffect(() => {
    void loadSafety().then(setProtocols);
  }, []);

  if (!protocols) {
    return (
      <div className="space-y-6 animate-pulse" role="status" aria-live="polite">
        <div className="h-9 w-72 bg-neutral-900 rounded" />
        <div className="h-10 max-w-sm bg-neutral-900 rounded" />
        <div className="h-80 bg-neutral-900/50 rounded-lg border border-neutral-800" />
        <span className="sr-only">Loading safety protocols…</span>
      </div>
    );
  }

  const categories = Array.from(new Set(protocols.map(e => e.category)));
  // Fall back to the first category when the URL has no (or a stale) value.
  const activeTab = categories.includes(urlTab) ? urlTab : categories[0];

  const filtered = protocols.filter(e =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Personal Safety &amp; Dead Drops</h1>
        <p className="text-neutral-400 mt-2">Identity, banking, housing, medical preparedness, and methods for communicating across time.</p>
      </div>

      <div className="max-w-sm">
        <Input
          type="text"
          placeholder="Search protocols..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          aria-label="Search safety protocols"
          className="bg-neutral-900 border-neutral-800 focus-visible:ring-indigo-500"
        />
      </div>

      {searchTerm ? (
        <Accordion className="w-full space-y-3">
          {filtered.length === 0 ? (
            <p className="text-neutral-500 text-center py-8">No protocols match your search.</p>
          ) : (
            filtered.map((e, idx) => (
              <AccordionItem key={e.id} value={`safety-${idx}`} className="border border-neutral-800 rounded-lg px-4 bg-neutral-900/50">
                <AccordionTrigger className="hover:no-underline hover:text-indigo-400 transition-colors py-4">
                  <div className="flex items-center gap-3 text-left">
                    <span className="text-lg">{categoryIcons[e.category]}</span>
                    <div>
                      <div className="font-semibold text-base">{e.title}</div>
                      <div className="text-xs text-neutral-500">{e.category}</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-neutral-400 pb-4 space-y-4">
                  <p className="text-sm">{e.description}</p>
                  <div className="bg-neutral-950 p-4 rounded-md border border-neutral-800/50 border-l-4 border-l-indigo-500">
                    <strong className="text-indigo-400 block mb-2">Protocol</strong>
                    <p className="text-sm leading-relaxed whitespace-pre-line">{e.protocol}</p>
                  </div>
                  <div className="bg-neutral-950 p-3 rounded-md border border-neutral-800/50">
                    <strong className="text-amber-400/80 block mb-1 text-xs">Era-Specific Note</strong>
                    <p className="text-xs text-neutral-400">{e.eraNote}</p>
                  </div>
                  <PalaceHook routeId={e.id} />
                  <AthenaCommentary entryId={e.id} />
                  <ChatAboutThis entryId={e.id} module="safety" fields={{ title: e.title }} />
                  {e.tags && e.tags.length > 0 && (
                    <PalaceLink tags={e.tags} contextItem={`Safety: ${e.title} (${e.category})`} excludeId={e.id} />
                  )}
                </AccordionContent>
              </AccordionItem>
            ))
          )}
        </Accordion>
      ) : (
        <Tabs value={activeTab} onValueChange={setUrlTab} className="w-full">
          <TabsList className="bg-neutral-900 border border-neutral-800 flex-wrap h-auto">
            {categories.map(cat => (
              <TabsTrigger key={cat} value={cat} className="data-[state=active]:bg-neutral-800 data-[state=active]:text-white text-neutral-400">
                {categoryIcons[cat]} {cat}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map(cat => (
            <TabsContent key={cat} value={cat} className="mt-6">
              <Accordion className="w-full space-y-3">
                {protocols.filter(e => e.category === cat).map((e, idx) => (
                  <AccordionItem key={e.id} value={`safety-${cat}-${idx}`} className="border border-neutral-800 rounded-lg px-4 bg-neutral-900/50">
                    <AccordionTrigger className="hover:no-underline hover:text-indigo-400 transition-colors py-4">
                      <div className="flex items-center gap-3 text-left">
                        <span className="text-lg">{categoryIcons[e.category]}</span>
                        <div>
                          <div className="font-semibold text-base">{e.title}</div>
                          <div className="text-xs text-neutral-500">{e.category}</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-neutral-400 pb-4 space-y-4">
                      <p className="text-sm">{e.description}</p>
                      <div className="bg-neutral-950 p-4 rounded-md border border-neutral-800/50 border-l-4 border-l-indigo-500">
                        <strong className="text-indigo-400 block mb-2">Protocol</strong>
                        <p className="text-sm leading-relaxed whitespace-pre-line">{e.protocol}</p>
                      </div>
                      <div className="bg-neutral-950 p-3 rounded-md border border-neutral-800/50">
                        <strong className="text-amber-400/80 block mb-1 text-xs">Era-Specific Note</strong>
                        <p className="text-xs text-neutral-400">{e.eraNote}</p>
                      </div>
                      <PalaceHook routeId={e.id} />
                      <AthenaCommentary entryId={e.id} />
                  <ChatAboutThis entryId={e.id} module="safety" fields={{ title: e.title }} />
                      {e.tags && e.tags.length > 0 && (
                        <PalaceLink tags={e.tags} contextItem={`Safety: ${e.title} (${e.category})`} excludeId={e.id} />
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
