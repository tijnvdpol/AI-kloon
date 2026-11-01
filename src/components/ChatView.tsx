import { Info, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import './chat.css';
import { useChat } from '../hooks/useChat';
import { ChatInput } from './ChatInput';
import { MessageBubble } from './MessageBubble';
import { SourceList } from './SourceList';

interface Props {
  displayName: string | null;
  documentCount: number;
}

export function ChatView({ displayName, documentCount }: Props) {
  const { messages, sending, send, reset } = useChat();
  const [activeCitation, setActiveCitation] = useState<number | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const lastAnswer = [...messages].reverse().find((message) => message.role === 'assistant');
  const title = displayName ? `${displayName} · AI-kloon` : 'AI-kloon';

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, sending]);

  function handleSend(text: string) {
    setActiveCitation(null);
    void send(text);
  }

  return (
    <div className="chat">
      <div className="chat__main">
        <header className="chat__header">
          <span className="chat__avatar" aria-hidden>{(displayName ?? 'K').charAt(0).toUpperCase()}</span>
          <div className="chat__heading">
            <h1 className="chat__title">{title}</h1>
            <span className="muted chat__sub">Antwoordt op basis van {documentCount} {documentCount === 1 ? 'document' : 'documenten'}</span>
          </div>
          <button type="button" className="button button--ghost" onClick={() => { reset(); setActiveCitation(null); }} disabled={messages.length === 0 || sending}>
            <RotateCcw size={18} aria-hidden />
            <span className="chat__reset">Nieuw gesprek</span>
          </button>
        </header>
        <div className="chat__scroll">
          <div className="chat__thread">
            <p className="notice">
              <Info size={16} aria-hidden />
              <span>
                {displayName ? `Je praat met een AI-kloon, niet met ${displayName} zelf.` : 'Je praat met een AI-kloon.'}{' '}
                Antwoorden kunnen fouten bevatten — controleer de bronnen.
              </span>
            </p>
            {messages.length === 0 && (
              <p className="muted chat__empty">
                {documentCount === 0 ? 'Voeg eerst documenten toe onder Uploaden, dan kun je er vragen over stellen.' : 'Stel een vraag over je documenten.'}
              </p>
            )}
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                activeIndex={message.id === lastAnswer?.id ? activeCitation : null}
                onCite={setActiveCitation}
              />
            ))}
            {sending && (
              <div className="thinking" role="status">
                <span className="dots" aria-hidden><span /><span /><span /></span>
                Zoekt in {documentCount} {documentCount === 1 ? 'document' : 'documenten'}…
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>
        <ChatInput disabled={sending} onSend={handleSend} />
      </div>
      <aside className="chat__panel" aria-labelledby="panel-title">
        <div>
          <h2 id="panel-title" className="chat__panel-title">Bronnen</h2>
          <p className="muted chat__panel-sub">Bij het laatste antwoord · klik een nummer in de tekst</p>
        </div>
        {lastAnswer ? (
          <SourceList sources={lastAnswer.sources ?? []} activeIndex={activeCitation} variant="panel" />
        ) : (
          <p className="muted">Hier verschijnen de bronnen zodra de kloon antwoordt.</p>
        )}
      </aside>
    </div>
  );
}
