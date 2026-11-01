import type { DocumentItem, DocumentRow } from '../types';
import { storageName } from './documentFiles';
import { readFunctionError } from './functionError';
import { supabase } from './supabase';

export async function listDocuments(): Promise<DocumentItem[]> {
  const { data, error } = await supabase
    .from('documents')
    .select('*, chunks(count)')
    .order('created_at', { ascending: false });
  if (error) throw new Error('Documenten laden mislukt');
  return data.map(({ chunks, ...doc }) => ({ ...doc, chunk_count: chunks[0]?.count ?? 0 }));
}

export async function uploadDocument(file: File, userId: string): Promise<DocumentRow> {
  const storagePath = `${userId}/${storageName(file)}`;
  const { error: uploadError } = await supabase.storage.from('documents').upload(storagePath, file);
  if (uploadError) throw new Error(`${file.name}: uploaden mislukt`);

  const { data, error } = await supabase
    .from('documents')
    .insert({ title: file.name, storage_path: storagePath })
    .select()
    .single();
  if (error) {
    await supabase.storage.from('documents').remove([storagePath]);
    throw new Error(`${file.name}: opslaan mislukt`);
  }
  return data;
}

export async function ingestDocument(documentId: string): Promise<void> {
  const { error } = await supabase.functions.invoke('ingest', { body: { document_id: documentId } });
  if (error) throw new Error(await readFunctionError(error));
}

export async function deleteDocument(doc: DocumentRow): Promise<void> {
  const { error: storageError } = await supabase.storage.from(doc.storage_bucket).remove([doc.storage_path]);
  if (storageError) throw new Error('Bestand verwijderen mislukt');
  const { error } = await supabase.from('documents').delete().eq('id', doc.id);
  if (error) throw new Error('Document verwijderen mislukt');
}
