import { fileExtension } from './documentFiles';

export type KindFilter = 'all' | 'pdf' | 'word' | 'presentation' | 'text';

export const KIND_FILTERS: { id: KindFilter; label: string }[] = [
  { id: 'all', label: 'Alles' },
  { id: 'pdf', label: 'PDF' },
  { id: 'word', label: 'Word' },
  { id: 'presentation', label: 'Presentatie' },
  { id: 'text', label: 'Tekst' },
];

export function kindOf(title: string): Exclude<KindFilter, 'all'> {
  const extension = fileExtension(title);
  if (extension === 'pdf') return 'pdf';
  if (extension === 'docx') return 'word';
  if (extension === 'pptx') return 'presentation';
  return 'text';
}

/** Korte badge zoals PDF of DOCX. */
export function badgeOf(title: string): string {
  return fileExtension(title).toUpperCase().slice(0, 4);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
}
