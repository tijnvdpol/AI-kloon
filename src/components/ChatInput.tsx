import { ArrowUp } from 'lucide-react';
import { useState, type FormEvent, type KeyboardEvent } from 'react';

interface Props {
  disabled: boolean;
  onSend: (text: string) => void;
}

export function ChatInput({ disabled, onSend }: Props) {
  const [text, setText] = useState('');

  function submit() {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <form className="composer" onSubmit={(event: FormEvent) => { event.preventDefault(); submit(); }}>
      <div className="composer__box">
        <label htmlFor="question" className="sr-only">Stel een vraag</label>
        <textarea
          id="question"
          className="composer__input"
          rows={1}
          placeholder="Stel een vraag…"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button type="submit" className="button button--round composer__send" disabled={disabled || !text.trim()} aria-label="Versturen">
          <ArrowUp size={20} aria-hidden />
        </button>
      </div>
    </form>
  );
}
