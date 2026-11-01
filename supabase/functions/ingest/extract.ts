import { strFromU8, unzipSync } from 'npm:fflate@0.8.2';
import { extractText as extractPdfText, getDocumentProxy } from 'npm:unpdf@0.12.1';

const PLAIN_EXTENSIONS = ['txt', 'md', 'markdown', 'csv', 'json', 'log'];

const XML_ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
};

function xmlToText(xml: string, paragraphEnd: string): string {
  return xml
    .replace(/<w:tab\/>/g, '\t')
    .replace(/<(w:br|a:br)\/>/g, '\n')
    .replaceAll(paragraphEnd, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&(amp|lt|gt|quot|apos);/g, (entity) => XML_ENTITIES[entity] ?? entity);
}

function docxToText(bytes: Uint8Array): string {
  const files = unzipSync(bytes, { filter: (file) => file.name === 'word/document.xml' });
  const xml = files['word/document.xml'];
  if (!xml) throw new Error('Ongeldig docx-bestand');
  return xmlToText(strFromU8(xml), '</w:p>');
}

const slideNumber = (name: string) => Number(name.match(/(\d+)\.xml$/)?.[1] ?? 0);

function pptxToText(bytes: Uint8Array): string {
  const files = unzipSync(bytes, {
    filter: (file) => /^ppt\/(slides|notesSlides)\/[^/]+\.xml$/.test(file.name),
  });
  const slides = Object.keys(files).filter((name) => name.startsWith('ppt/slides/')).sort((a, b) => slideNumber(a) - slideNumber(b));
  if (slides.length === 0) throw new Error('Ongeldig pptx-bestand');

  return slides.map((name) => {
    const number = slideNumber(name);
    const body = xmlToText(strFromU8(files[name]!), '</a:p>').trim();
    const notesXml = files[`ppt/notesSlides/notesSlide${number}.xml`];
    const notes = notesXml ? xmlToText(strFromU8(notesXml), '</a:p>').trim() : '';
    return `Dia ${number}\n${body}${notes ? `\nNotities: ${notes}` : ''}`;
  }).join('\n\n');
}

export async function extractText(bytes: Uint8Array, path: string): Promise<string> {
  const extension = path.split('.').pop()?.toLowerCase() ?? '';
  if (extension === 'pdf') {
    const pdf = await getDocumentProxy(bytes);
    const { text } = await extractPdfText(pdf, { mergePages: true });
    return text;
  }
  if (extension === 'docx') return docxToText(bytes);
  if (extension === 'pptx') return pptxToText(bytes);
  if (PLAIN_EXTENSIONS.includes(extension)) return new TextDecoder().decode(bytes);
  throw new Error(`Bestandstype .${extension} wordt niet ondersteund`);
}
