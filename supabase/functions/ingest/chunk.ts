// ± 500 tokens ≈ 2000 tekens; overlap voorkomt dat een antwoord op een chunkgrens wegvalt.
const CHUNK_SIZE = 2000;
const CHUNK_OVERLAP = 300;

export function chunkText(raw: string): string[] {
  const text = raw
    .replace(/\r\n/g, '\n')
    .replace(/\u0000/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(start + CHUNK_SIZE, text.length);
    if (end < text.length) {
      const window = text.slice(start, end);
      const cut = Math.max(window.lastIndexOf('\n\n'), window.lastIndexOf('. '), window.lastIndexOf('\n'));
      if (cut > CHUNK_SIZE * 0.5) end = start + cut + 1;
    }
    const piece = text.slice(start, end).trim();
    if (piece) chunks.push(piece);
    if (end >= text.length) break;
    start = Math.max(end - CHUNK_OVERLAP, start + 1);
  }
  return chunks;
}
