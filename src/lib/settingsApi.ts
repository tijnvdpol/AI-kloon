import type { CloneSettings, EditableSettings } from '../types';
import { supabase } from './supabase';

export async function getSettings(): Promise<CloneSettings> {
  const { data, error } = await supabase.from('clone_settings').select('*').single();
  if (error) throw new Error('Instellingen laden mislukt');
  return data;
}

export async function updateSettings(userId: string, values: EditableSettings): Promise<void> {
  const { error } = await supabase.from('clone_settings').update(values).eq('user_id', userId);
  if (error) throw new Error('Instellingen opslaan mislukt');
}
