import type { ChatResponse, ChatTurn } from '../types';
import { readFunctionError } from './functionError';
import { supabase } from './supabase';

export async function askClone(messages: ChatTurn[]): Promise<ChatResponse> {
  const { data, error } = await supabase.functions.invoke<ChatResponse>('chat', { body: { messages } });
  if (error) throw new Error(await readFunctionError(error));
  if (!data) throw new Error('Leeg antwoord van de kloon');
  return data;
}
