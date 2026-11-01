const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const EMBEDDING_DIMENSIONS = 768;

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

async function post(path: string, apiKey: string, body: unknown): Promise<Response> {
  return fetch(`${BASE_URL}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify(body),
  });
}

export async function embedQuery(apiKey: string, model: string, text: string): Promise<number[]> {
  const res = await post(`models/${model}:embedContent`, apiKey, {
    model: `models/${model}`,
    content: { parts: [{ text }] },
    taskType: 'RETRIEVAL_QUERY',
    outputDimensionality: EMBEDDING_DIMENSIONS,
  });
  if (!res.ok) throw new Error(`Gemini embeddings mislukt (status ${res.status})`);
  const data = await res.json() as { embedding: { values: number[] } };
  return data.embedding.values;
}

export async function generateAnswer(
  apiKey: string,
  model: string,
  systemInstruction: string,
  turns: ChatTurn[],
): Promise<string> {
  const res = await post(`models/${model}:generateContent`, apiKey, {
    systemInstruction: { parts: [{ text: systemInstruction }] },
    contents: turns.map((turn) => ({
      role: turn.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: turn.content }],
    })),
  });
  if (!res.ok) throw new Error(`Gemini antwoord mislukt (status ${res.status})`);
  const data = await res.json() as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('') ?? '';
  if (!text) throw new Error('Gemini gaf een leeg antwoord');
  return text;
}
