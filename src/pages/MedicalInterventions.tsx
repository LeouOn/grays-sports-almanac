import { useState } from 'react';
import { medicalInterventions } from '@/data/medical';
import type { MedicalIntervention } from '@/data/medical';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AthenaCommentary } from '@/components/AthenaCommentary';
import { ChatAboutThis } from '@/components/ChatAboutThis';
import { PalaceHook } from '@/components/PalaceHook';
import { PalaceLink } from '@/components/PalaceLink';
import { RelatedEntries } from '@/components/RelatedEntries';

const riskColors: Record<MedicalIntervention['butterflyRisk'], string> = {
  'Low': 'bg-green-950/60 text-green-400 border-green-800',
  'Medium': 'bg-amber-950/60 text-amber-400 border-amber-800',
  'High': 'bg-orange-950/60 text-orange-400 border-orange-800',
  'Extreme': 'bg-red-950/60 text-red-400 border-red-800',
};

export function MedicalInterventions() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = medicalInterventions.filter(e =>
    e.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.targetRecipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Medical Interventions</h2>
        <p className="text-neutral-400 mt-2">High-impact, low-butterfly medical knowledge that saves lives without rewriting history.</p>
      </div>

      <div className="max-w-sm">
        <Input
          type="text"
          placeholder="Search by condition, target, or details..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="bg-neutral-900 border-neutral-800 focus-visible:ring-indigo-500"
        />
      </div>

      <Accordion className="w-full space-y-3">
        {filtered.length === 0 ? (
          <p className="text-neutral-500 text-center py-8">No matches.</p>
        ) : (
          filtered.map((e, idx) => (
            <AccordionItem
              key={e.id}
              value={`med-${idx}`}
              className="border border-neutral-800 rounded-lg px-4 bg-neutral-900/50"
            >
              <AccordionTrigger className="hover:no-underline hover:text-rose-400 transition-colors py-4">
                <div className="flex items-center gap-3 text-left flex-1">
                  <span className="text-lg">💊</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-base">{e.condition}</div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-neutral-500">Intervene by {e.optimalYear}</span>
                      <span className="text-xs text-neutral-500">·</span>
                      <span className="text-xs text-green-400/80">{e.estimatedLivesSaved}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${riskColors[e.butterflyRisk]}`}>
                    {e.butterflyRisk} 🦋
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-neutral-400 pb-4 space-y-4">
                <p className="text-sm leading-relaxed">{e.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong className="text-neutral-200 block mb-1">Target Recipient</strong>
                    <p className="text-sm">{e.targetRecipient}</p>
                  </div>
                  <div>
                    <strong className="text-neutral-200 block mb-1">Lives at Stake</strong>
                    <p className="text-sm text-red-400/80 font-semibold">{e.estimatedLivesSaved}</p>
                  </div>
                </div>

                <div className="bg-neutral-950 p-4 rounded-md border border-neutral-800/50 border-l-4 border-l-rose-500">
                  <strong className="text-rose-400 block mb-2">Delivery Method</strong>
                  <p className="text-sm leading-relaxed">{e.deliveryMethod}</p>
                </div>

                <div className="bg-neutral-950 p-4 rounded-md border border-neutral-800/50">
                  <strong className="text-neutral-200 block mb-2">Context & Details</strong>
                  <p className="text-sm leading-relaxed">{e.details}</p>
                </div>
                <PalaceHook routeId={e.id} />
                <AthenaCommentary entryId={e.id} />
                <ChatAboutThis entryId={e.id} module="medical" fields={{ condition: e.condition }} />
                {e.tags && e.tags.length > 0 && (
                  <>
                    <PalaceLink tags={e.tags} contextItem={`Medical: ${e.condition} (${e.optimalYear})`} excludeId={e.id} />
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
