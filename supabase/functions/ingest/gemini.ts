const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const EMBEDDING_DIMENSIONS = 768;
const BATCH_SIZE = 100;
const MAX_ATTEMPTS = 4;

async function postWithRetry(url: string, apiKey: string, body: unknown): Promise<Response> {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify(body),
    });
    // Het gratis quotum rekent per minuut, dus wachten helpt.
    if (res.status !== 429 || attempt === MAX_ATTEMPTS) return res;
    await new Promise((resolve) => setTimeout(resolve, 5000 * attempt));
  }
}

export async function embedDocuments(apiKey: string, model: string, texts: string[]): Promise<number[][]> {
  const vectors: number[][] = [];
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const res = await postWithRetry(`${BASE_URL}/models/${model}:batchEmbedContents`, apiKey, {
      requests: batch.map((text) => ({
        model: `models/${model}`,
        content: { parts: [{ text }] },
        taskType: 'RETRIEVAL_DOCUMENT',
        outputDimensionality: EMBEDDING_DIMENSIONS,
      })),
    });
    if (!res.ok) throw new Error(`Gemini embeddings mislukt (status ${res.status})`);
    const data = await res.json() as { embeddings: { values: number[] }[] };
    vectors.push(...data.embeddings.map((e) => e.values));
  }
  return vectors;
}
