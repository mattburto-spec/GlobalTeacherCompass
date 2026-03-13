'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  'Should I use my school\'s financial advisor?',
  'How do I invest as an expat?',
  'Is a tax-free salary always better?',
  'What\'s a good savings rate for international teachers?',
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: text.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!res.ok) throw new Error('Chat failed');

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No stream');

      let assistantContent = '';
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                assistantContent += parsed.text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: 'assistant', content: assistantContent };
                  return updated;
                });
              }
            } catch {
              // Skip malformed chunks
            }
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Disclaimer */}
      <div className="bg-gold/5 border border-gold/15 rounded-xl p-3 mb-4 flex items-start gap-2.5">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gold shrink-0 mt-0.5">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M8 5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="8" cy="11" r="0.75" fill="currentColor"/>
        </svg>
        <p className="text-xs text-navy/50 leading-relaxed">
          <span className="font-semibold text-gold-dark">Educational guidance only</span> — not regulated financial advice.
          Always consult a qualified, fee-only financial advisor before making investment decisions.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 min-h-0">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 bg-navy/5 rounded-2xl flex items-center justify-center mb-6">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-navy/25">
                <path d="M6 8H22C23.1 8 24 8.9 24 10V20C24 21.1 23.1 22 22 22H10L6 26V10C6 8.9 6.9 8 8 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11 14H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M11 17H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-navy/40 mb-2">
              Ask anything about expat finances
            </h3>
            <p className="text-sm text-navy/30 mb-8 max-w-sm">
              Get guidance on investing abroad, evaluating packages, navigating tax situations, and building wealth as an international educator.
            </p>

            {/* Suggestion chips */}
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                  className="text-sm text-navy/50 bg-white border border-sand-dark/20 px-4 py-2 rounded-full hover:border-gold/30 hover:text-navy hover:bg-gold/5 transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-message flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 ${
              msg.role === 'user'
                ? 'bg-navy text-sand-light rounded-br-md'
                : 'bg-white border border-sand-dark/15 text-navy/80 rounded-bl-md'
            }`}>
              {msg.role === 'assistant' ? (
                <div className="text-sm leading-relaxed whitespace-pre-wrap space-y-2">
                  {msg.content || (
                    <div className="flex items-center gap-1.5 py-1">
                      <div className="typing-dot w-2 h-2 bg-navy/30 rounded-full" />
                      <div className="typing-dot w-2 h-2 bg-navy/30 rounded-full" />
                      <div className="typing-dot w-2 h-2 bg-navy/30 rounded-full" />
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm leading-relaxed">{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="pt-4 border-t border-sand-dark/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about expat finances, investing, packages..."
            className="form-input flex-1 !bg-white"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-navy hover:bg-navy-light disabled:opacity-30 text-sand-light px-5 py-2.5 rounded-xl transition-colors shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9L15 3L9 15L8 10L3 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
