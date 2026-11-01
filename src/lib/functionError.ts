import { FunctionsHttpError } from '@supabase/supabase-js';

export async function readFunctionError(error: unknown): Promise<string> {
  if (error instanceof FunctionsHttpError) {
    const body: unknown = await error.context.json().catch(() => null);
    if (body && typeof body === 'object' && 'error' in body && typeof body.error === 'string') {
      return body.error;
    }
  }
  return error instanceof Error ? error.message : 'Onbekende fout';
}
