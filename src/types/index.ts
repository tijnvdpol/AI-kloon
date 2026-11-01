import type { Database } from './database';

export type DocumentRow = Database['public']['Tables']['documents']['Row'];
export type CloneSettings = Database['public']['Tables']['clone_settings']['Row'];
export type EditableSettings = Pick<CloneSettings, 'display_name' | 'system_prompt' | 'chat_model' | 'match_count'>;

export interface DocumentItem extends DocumentRow {
  chunk_count: number;
}

export type DocumentStatus = 'pending' | 'processing' | 'ready' | 'error';

export interface Source {
  index: number;
  document_id: string;
  title: string;
  content: string;
  similarity: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
}

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  answer: string;
  sources: Source[];
}

export type ToastKind = 'success' | 'error';

export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}
