import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PreviewMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface CompanionPreviewChatProps {
  companion: { name: string; prompt: string };
  onClose: () => void;
}

const MAX_MESSAGES = 5;

export function CompanionPreviewChat({
  companion,
  onClose,
}: CompanionPreviewChatProps) {
  const [messages, setMessages] = useState<PreviewMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const messageCount = messages.length;
  const canSend =
    input.trim() && !streaming && messageCount < MAX_MESSAGES;

  const handleSend = async () => {
    if (!canSend) return;

    const userMessage: PreviewMessage = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setStreaming(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
            parts: [{ type: 'text', text: m.content }],
          })),
          companionName: companion.name,
          companionPrompt: companion.prompt,
          tier: 'tier1',
          provider: 'google',
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      // Read the streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let assistantContent = '';

      // Add an empty assistant message that we'll update
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // Parse SSE chunks — look for text deltas
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('0:')) {
            try {
              const jsonStr = line.slice(2).trim();
              if (!jsonStr) continue;
              const parsed = JSON.parse(jsonStr);
              if (parsed.type === 'text-delta' && parsed.textDelta) {
                assistantContent += parsed.textDelta;
                setMessages((prev) => {
                  const copy = [...prev];
                  copy[copy.length - 1] = { role: 'assistant', content: assistantContent };
                  return copy;
                });
              }
            } catch {
              // Skip unparseable chunks
            }
          }
        }
      }

      // If no content was parsed from the stream, use a fallback
      if (!assistantContent) {
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: 'assistant', content: '(No response received)' };
          return copy;
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to connect to chat server';
      setError(msg);
      // Remove the empty assistant placeholder if we added one
      setMessages((prev) => {
        if (prev.length > 0 && prev[prev.length - 1].content === '') {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const limitReached = messageCount >= MAX_MESSAGES;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start sm:items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-chat-title"
        className="bg-neutral-900 border border-neutral-800 w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-lg" aria-hidden="true">💬</span>
            <h2 id="preview-chat-title" className="text-sm font-semibold text-white">
              Preview: {companion.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
            aria-label="Close preview"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="text-4xl mb-3">{companion.name.charAt(0) === '🤖' ? '🤖' : '💭'}</span>
              <p className="text-sm text-neutral-400 max-w-xs">
                Chat with <span className="text-neutral-300 font-medium">{companion.name}</span> to test your companion&apos;s personality.
              </p>
              <p className="text-xs text-neutral-600 mt-1">Limited to {MAX_MESSAGES} messages.</p>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-neutral-800 text-neutral-200'
                }`}
              >
                {m.content || (
                  <span className="inline-flex items-center gap-1 text-neutral-400">
                    <Loader2 className="size-3 animate-spin" />
                    Thinking...
                  </span>
                )}
              </div>
            </div>
          ))}

          {error && (
            <div className="text-center">
              <p className="text-xs text-red-400 bg-red-950/20 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            </div>
          )}

          {limitReached && (
            <div className="text-center pt-2">
              <p className="text-xs text-neutral-500">
                Preview limit reached ({MAX_MESSAGES} messages max).
              </p>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-neutral-800 shrink-0">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                limitReached
                  ? 'Preview complete'
                  : streaming
                  ? 'Waiting for response...'
                  : 'Say something...'
              }
              disabled={limitReached || streaming}
              className="flex-1 h-9 rounded-lg border border-neutral-800 bg-neutral-900 px-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500/50 transition-colors disabled:opacity-50"
              aria-label="Chat message input"
            />
            <Button
              onClick={handleSend}
              disabled={!canSend}
              variant="default"
              size="icon"
              aria-label="Send message"
            >
              {streaming ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
