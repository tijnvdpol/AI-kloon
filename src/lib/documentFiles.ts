export const SUPPORTED_EXTENSIONS = ['pdf', 'docx', 'pptx', 'txt', 'md', 'csv', 'json'] as const;
export const MAX_FILE_BYTES = 20 * 1024 * 1024;

export function fileExtension(name: string): string {
  return name.split('.').pop()?.toLowerCase() ?? '';
}

/** Geeft een foutmelding terug, of null als het bestand geaccepteerd wordt. */
export function validateFile(file: File): string | null {
  const extension = fileExtension(file.name);
  if (!(SUPPORTED_EXTENSIONS as readonly string[]).includes(extension)) {
    return `${file.name}: .${extension} wordt niet ondersteund`;
  }
  if (file.size > MAX_FILE_BYTES) return `${file.name}: groter dan 20 MB`;
  if (file.size === 0) return `${file.name}: bestand is leeg`;
  return null;
}

export function storageName(file: File): string {
  const safe = file.name.replace(/[^A-Za-z0-9._-]/g, '_');
  return `${crypto.randomUUID()}-${safe}`;
}
