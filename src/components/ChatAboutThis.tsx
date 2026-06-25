import { useNavigate } from 'react-router';
import { MessageCircle } from 'lucide-react';

interface ChatAboutThisProps {
  entryId: string;
  module: string;
  /** Key-value pairs from the entry used to build the auto-question */
  fields: Record<string, string | number>;
}

const QUESTION_TEMPLATES: Record<string, (f: Record<string, string | number>) => string> = {
  sports: (f) => `What happened in the ${f.event} (${f.year}) and why was it significant?`,
  disasters: (f) => `Walk me through the ${f.event} — what caused it and how could it have been prevented?`,
  finance: (f) => `Explain the ${f.event} on ${f.date}. What were the key signals and what happened next?`,
  medical: (f) => `Tell me about ${f.condition} — what was the breakthrough and who was involved?`,
  safety: (f) => `How does the '${f.title}' protocol work and why does it matter for a time traveler?`,
  'tech-transfer': (f) => `Explain the ${f.concept} transfer plan. What's the butterfly risk?`,
  blueprints: (f) => `Walk me through the ${f.title} blueprint. What are the critical tolerances?`,
  engineering: (f) => `What was the state of ${f.conceptName} in the ${f.era} and what were the key specs?`,
  'era-guide': (f) => `What should I know about ${f.item} in the ${f.era}? Give me the survival essentials.`,
};

// eslint-disable-next-line react-refresh/only-export-components
export function generateChatQuestion(module: string, fields: Record<string, string | number>): string {
  const template = QUESTION_TEMPLATES[module] ?? (() => `Tell me about ${fields.title ?? fields.item ?? fields.event ?? 'this entry'}.`);
  return template(fields);
}

export function ChatAboutThis({ entryId, module, fields }: ChatAboutThisProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    const question = generateChatQuestion(module, fields);
    const params = new URLSearchParams({ entryId, q: question });
    navigate(`/quiz?${params.toString()}`);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] text-indigo-300/70 border border-indigo-500/20 bg-indigo-950/10 rounded-lg hover:bg-indigo-950/20 hover:border-indigo-500/30 hover:text-indigo-200 transition-all cursor-pointer select-none"
    >
      <MessageCircle className="size-3" />
      <span>Chat about this</span>
    </button>
  );
}
