import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';

interface Message {
  id: number;
  role: 'user' | 'ai' | 'time';
  content: string;
}

interface AIPanelProps {
  open: boolean;
  onClose: () => void;
  contextTicketId?: string;
}

let msgId = 0;

export function AIPanel({ open, onClose, contextTicketId }: AIPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: ++msgId, role: 'time', content: 'Today' },
    { id: ++msgId, role: 'ai', content: "Hello! I'm your AI support assistant powered by Strands Agent. I can help you analyze tickets, suggest triage actions, and assess SLA risks. What would you like to know?" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showContext, setShowContext] = useState(!!contextTicketId);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setShowContext(!!contextTicketId);
  }, [contextTicketId]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [open]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    setShowSuggestions(false);
    const userMsg: Message = { id: ++msgId, role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const payload = contextTicketId
        ? { prompt: text.trim(), ticketId: contextTicketId }
        : { prompt: text.trim() };
      const res = await api.aiAssistant(payload);
      const aiMsg: Message = { id: ++msgId, role: 'ai', content: res.response };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errMsg: Message = {
        id: ++msgId,
        role: 'ai',
        content: `Error: ${err instanceof Error ? err.message : 'Failed to get response'}`,
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  }, [loading, contextTicketId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const suggestions = [
    'What are the current open critical tickets?',
    'Analyze SLA breach risk for today',
    'Suggest triage for unassigned tickets',
  ];

  return (
    <>
      <div
        className={`ai-overlay ${open ? 'open' : ''}`}
        onClick={onClose}
      />
      <div className={`ai-panel ${open ? 'open' : ''}`}>
        <div className="ai-header">
          <div className="ai-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93L12 22"/>
              <path d="M12 2a4 4 0 0 0-4 4c0 1.95 1.4 3.58 3.25 3.93"/>
            </svg>
          </div>
          <div>
            <div className="ai-header-title">AI Assistant</div>
            <div className="ai-header-subtitle">Strands Agent &middot; Bedrock</div>
          </div>
          <button className="ai-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {showContext && contextTicketId && (
          <div className="ai-context">
            <div className="context-chip">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              </svg>
              {contextTicketId} context
              <button onClick={() => setShowContext(false)}>&times;</button>
            </div>
          </div>
        )}

        <div className="ai-messages" ref={messagesRef}>
          {messages.map(msg => {
            if (msg.role === 'time') {
              return <div key={msg.id} className="msg-time">{msg.content}</div>;
            }
            return (
              <div
                key={msg.id}
                className={`msg ${msg.role === 'user' ? 'msg-user' : 'msg-ai'}`}
                dangerouslySetInnerHTML={{ __html: formatAIMessage(msg.content) }}
              />
            );
          })}

          {showSuggestions && (
            <div className="ai-suggestions">
              {suggestions.map(s => (
                <button
                  key={s}
                  className="suggestion-card"
                  onClick={() => sendMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="typing-indicator">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          )}
        </div>

        <div className="ai-input-area">
          <textarea
            ref={inputRef}
            rows={1}
            placeholder="Ask about your tickets..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className={`ai-send ${input.trim() ? 'ready' : ''}`}
            onClick={() => sendMessage(input)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22,2 15,22 11,13 2,9"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

function formatAIMessage(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}
