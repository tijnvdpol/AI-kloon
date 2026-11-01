import { Copy } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import type { ChatMessage } from '../types';
import { CitedAnswer } from './CitedAnswer';
import { SourceList } from './SourceList';

interface Props {
  message: ChatMessage;
  activeIndex: number | null;
  onCite: (index: number) => void;
}

export function MessageBubble({ message, activeIndex, onCite }: Props) {
  const { notify } = useToast();

  if (message.role === 'user') {
    return <div className="bubble-user">{message.content}</div>;
  }

  const sources = message.sources ?? [];

  async function copy() {
    try {
      await navigator.clipboard.writeText(message.content);
      notify('success', 'Antwoord gekopieerd');
    } catch {
      notify('error', 'Kopiëren is niet gelukt');
    }
  }

  return (
    <article className="answer" aria-label="Antwoord van de kloon">
      <CitedAnswer text={message.content} sourceCount={sources.length} onCite={onCite} />
      <SourceList sources={sources} activeIndex={activeIndex} variant="inline" />
      <div>
        <button type="button" className="button button--ghost button--icon" onClick={() => void copy()} aria-label="Kopiëren">
          <Copy size={18} aria-hidden />
        </button>
      </div>
    </article>
  );
}
