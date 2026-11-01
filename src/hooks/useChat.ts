import { useCallback, useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { askClone } from '../lib/chatApi';
import type { ChatMessage } from '../types';

export function useChat() {
  const { notify } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);

  const send = useCallback(async (text: string) => {
    const question: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text };
    const history = [...messages, question];
    setMessages(history);
    setSending(true);
    try {
      const { answer, sources } = await askClone(history.map(({ role, content }) => ({ role, content })));
      setMessages([...history, { id: crypto.randomUUID(), role: 'assistant', content: answer, sources }]);
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Onbekende fout');
    } finally {
      setSending(false);
    }
  }, [messages, notify]);

  const reset = useCallback(() => setMessages([]), []);

  return { messages, sending, send, reset };
}
