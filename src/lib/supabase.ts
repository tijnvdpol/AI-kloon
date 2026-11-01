import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

function required(name: 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY'): string {
  const value = import.meta.env[name];
  if (!value) throw new Error(`Config ontbreekt: ${name}. Zie .env.example.`);
  return value;
}

export const supabase = createClient<Database>(
  required('VITE_SUPABASE_URL'),
  required('VITE_SUPABASE_ANON_KEY'),
);
