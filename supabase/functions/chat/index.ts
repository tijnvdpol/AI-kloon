import { createClient } from 'npm:@supabase/supabase-js@2';
import { type ChatTurn, embedQuery, generateAnswer } from './gemini.ts';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const MAX_HISTORY_TURNS = 10;

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

  try {
    const client = createClient(env('SUPABASE_URL'), env('SUPABASE_ANON_KEY'), {
      global: { headers: { Authorization: authorization } },
    });
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData.user) return reply({ error: 'Niet ingelogd' }, 401);

    const { messages } = await req.json() as { messages?: ChatTurn[] };
    const turns = (messages ?? []).slice(-MAX_HISTORY_TURNS);
    const question = turns[turns.length - 1];
    if (!question || question.role !== 'user' || !question.content.trim()) {
      return reply({ error: 'Laatste bericht moet een vraag zijn' }, 400);
    }

    const { data: settings, error: settingsError } = await client
      .from('clone_settings').select('*').single();
    if (settingsError || !settings) throw new Error('clone_settings ontbreekt voor deze gebruiker');

    const apiKey = env('GEMINI_API_KEY');
    const queryEmbedding = await embedQuery(apiKey, settings.embedding_model, question.content);
    const { data: matches, error: matchError } = await client.rpc('match_chunks', {
      query_embedding: JSON.stringify(queryEmbedding),
      match_count: settings.match_count,
    });
    if (matchError) throw new Error('Zoeken in bronnen mislukt');

    const context = matches.length
      ? matches.map((match, i) => `[${i + 1}] ${match.title}\n${match.content}`).join('\n\n')
      : '(geen relevante bronnen gevonden)';
    const systemInstruction = `${settings.system_prompt}\n\nBronnen:\n${context}\n\nVerwijs naar bronnen met hun nummer, bijvoorbeeld [1].`;

    const answer = await generateAnswer(apiKey, settings.chat_model, systemInstruction, turns);
    const sources = matches.map((match, i) => ({
      index: i + 1,
      document_id: match.document_id,
      title: match.title,
      content: match.content,
      similarity: match.similarity,
    }));
    return reply({ answer, sources });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Onbekende fout';
    return reply({ error: message }, 500);
  }
});
