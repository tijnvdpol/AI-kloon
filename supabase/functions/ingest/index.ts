import { createClient } from 'npm:@supabase/supabase-js@2';
import { chunkText } from './chunk.ts';
import { extractText } from './extract.ts';
import { embedDocuments } from './gemini.ts';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const INSERT_BATCH_SIZE = 200;

function env(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Config ontbreekt: ${name}`);
  return value;
}

function reply(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: CORS_HEADERS });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });

  const authorization = req.headers.get('Authorization');
  if (!authorization) return reply({ error: 'Niet ingelogd' }, 401);

  const url = env('SUPABASE_URL');
  const userClient = createClient(url, env('SUPABASE_ANON_KEY'), {
    global: { headers: { Authorization: authorization } },
  });
  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData.user) return reply({ error: 'Niet ingelogd' }, 401);

  const { document_id: documentId } = await req.json() as { document_id?: string };
  if (!documentId) return reply({ error: 'document_id ontbreekt' }, 400);

  const { data: doc } = await userClient.from('documents').select('*').eq('id', documentId).maybeSingle();
  if (!doc) return reply({ error: 'Document niet gevonden' }, 404);

  const admin = createClient(url, env('SUPABASE_SERVICE_ROLE_KEY'));
  const setStatus = (status: string, errorMessage: string | null = null) =>
    admin.from('documents').update({ status, error_message: errorMessage }).eq('id', documentId);

  try {
    await setStatus('processing');

    const { data: settings, error: settingsError } = await userClient
      .from('clone_settings').select('embedding_model').single();
    if (settingsError || !settings) throw new Error('clone_settings ontbreekt voor deze gebruiker');

    const { data: file, error: downloadError } = await userClient.storage
      .from(doc.storage_bucket).download(doc.storage_path);
    if (downloadError || !file) throw new Error('Bestand niet gevonden in Storage');

    const text = await extractText(new Uint8Array(await file.arrayBuffer()), doc.storage_path);
    const pieces = chunkText(text);
    if (pieces.length === 0) throw new Error('Geen leesbare tekst in dit bestand');

    const vectors = await embedDocuments(env('GEMINI_API_KEY'), settings.embedding_model, pieces);

    await admin.from('chunks').delete().eq('document_id', documentId);
    const rows = pieces.map((content, index) => ({
      document_id: documentId,
      user_id: doc.user_id,
      chunk_index: index,
      content,
      embedding: JSON.stringify(vectors[index]),
    }));
    for (let i = 0; i < rows.length; i += INSERT_BATCH_SIZE) {
      const { error } = await admin.from('chunks').insert(rows.slice(i, i + INSERT_BATCH_SIZE));
      if (error) throw new Error('Chunks opslaan mislukt');
    }

    await setStatus('ready');
    return reply({ status: 'ready', chunks: rows.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Onbekende fout';
    await setStatus('error', message);
    return reply({ status: 'error', error: message }, 500);
  }
});
