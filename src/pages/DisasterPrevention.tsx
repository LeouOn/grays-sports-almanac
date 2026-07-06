import { useState, useEffect } from 'react';
import { loadDisasters } from '@/data/loader';
import type { DisasterEvent } from '@/data/disasters';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AthenaCommentary } from '@/components/AthenaCommentary';
import { ChatAboutThis } from '@/components/ChatAboutThis';
import { PalaceHook } from '@/components/PalaceHook';
import { PalaceLink } from '@/components/PalaceLink';
import { RelatedEntries } from '@/components/RelatedEntries';
import { ButterflyImpact } from '@/components/ButterflyImpact';
import { RiskBadge } from '@/components/RiskBadge';
import { useURLState } from '../hooks/useURLState';

const categoryIcons: Record<DisasterEvent['category'], string> = {
  'Aviation': '✈️',
  'Industrial': '🏭',
  'Natural': '🌪️',
  'Terrorism': '⚠️',
  'Public Health': '🦠',
};

export function DisasterPrevention() {
  const [searchTerm, setSearchTerm] = useURLState('search', '');
  const [disasters, setDisasters] = useState<DisasterEvent[] | null>(null);

  useEffect(() => {
    void loadDisasters().then(setDisasters);
  }, []);

  if (!disasters) {
    return (
      <div className="space-y-6 animate-pulse" role="status" aria-live="polite">
        <div className="h-9 w-80 bg-neutral-900 rounded" />
        <div className="h-10 max-w-sm bg-neutral-900 rounded" />
        <div className="h-80 bg-neutral-900/50 rounded-lg border border-neutral-800" />
        <span className="sr-only">Loading disaster prevention…</span>
      </div>
    );
  }

  const filtered = disasters.filter(e =>
    e.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.intervention.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Disaster Prevention &amp; Mitigation</h1>
        <p className="text-neutral-400 mt-2">Preventable tragedies with low-profile intervention strategies. Prioritize events with the best lives-saved-to-butterfly-risk ratio.</p>
      </div>

      <div className="max-w-sm">
        <Input
          type="text"
          placeholder="Search by event, location, or category..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          aria-label="Search disasters"
          className="bg-neutral-900 border-neutral-800 focus-visible:ring-indigo-500"
        />
      </div>

      <Accordion className="w-full space-y-3">
        {filtered.length === 0 ? (
          <p className="text-neutral-500 text-center py-8">No disasters matching your search.</p>
        ) : (
          filtered.map((e, idx) => (
            <AccordionItem
              key={e.id}
              value={`disaster-${idx}`}
              className="border border-neutral-800 rounded-lg px-4 bg-neutral-900/50"
            >
              <AccordionTrigger className="hover:no-underline hover:text-indigo-400 transition-colors py-4">
                <div className="flex items-center gap-3 text-left flex-1">
                  <span className="text-lg">{categoryIcons[e.category]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-base">{e.event}</div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-neutral-500">{e.date}</span>
                      <span className="text-xs text-neutral-500">·</span>
                      <span className="text-xs text-neutral-500">{e.location}</span>
                      <span className="text-xs text-neutral-500">·</span>
                      <span className="text-xs text-red-400/80">{e.casualties}</span>
                    </div>
                  </div>
                  <RiskBadge level={e.butterflyRisk} className="border" />
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-neutral-400 pb-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong className="text-neutral-200 block mb-1">Cause</strong>
                    <p className="text-sm">{e.cause}</p>
                  </div>
                  <div>
                    <strong className="text-neutral-200 block mb-1">Lives at Stake</strong>
                    <p className="text-sm text-red-400/80 font-semibold">{e.estimatedLivesSaved}</p>
                  </div>
                </div>

                <div className="bg-neutral-950 p-4 rounded-md border border-neutral-800/50 border-l-4 border-l-indigo-500">
                  <strong className="text-indigo-400 block mb-2">Intervention Protocol</strong>
                  <p className="text-sm leading-relaxed">{e.intervention}</p>
                </div>

                <div className="bg-neutral-950 p-4 rounded-md border border-neutral-800/50 border-l-4 border-l-amber-500">
                  <strong className="text-amber-400 block mb-2">Delivery Method</strong>
                  <p className="text-sm leading-relaxed">{e.deliveryMethod}</p>
                </div>
                {e.butterflyCascade || e.historicalConfidence ? (
                  <ButterflyImpact cascade={e.butterflyCascade} confidence={e.historicalConfidence} butterflyRisk={e.butterflyRisk} />
                ) : null}
                <PalaceHook routeId={e.id} />
                <AthenaCommentary entryId={e.id} />
                <ChatAboutThis entryId={e.id} module="disasters" fields={{ event: e.event }} />
                {e.tags && e.tags.length > 0 && (
                  <>
                    <PalaceLink tags={e.tags} contextItem={`Disaster: ${e.event} on ${e.date}`} excludeId={e.id} />
                    <RelatedEntries tags={e.tags} excludeId={e.id} />
                  </>
                )}
              </AccordionContent>
            </AccordionItem>
          ))
        )}
      </Accordion>
    </div>
  );
}
