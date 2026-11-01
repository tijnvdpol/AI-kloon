import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { validateFile } from '../lib/documentFiles';
import { deleteDocument, ingestDocument, listDocuments, uploadDocument } from '../lib/documentsApi';
import type { DocumentItem, DocumentRow } from '../types';

const errorMessage = (error: unknown) => (error instanceof Error ? error.message : 'Onbekende fout');

export function useDocuments() {
  const { user } = useAuth();
  const { notify } = useToast();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setDocuments(await listDocuments());
    } catch (error) {
      notify('error', errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const process = useCallback(async (documentId: string, title: string) => {
    try {
      await ingestDocument(documentId);
      notify('success', `${title} is verwerkt`);
    } catch (error) {
      notify('error', `${title}: ${errorMessage(error)}`);
    }
    await refresh();
  }, [notify, refresh]);

  const upload = useCallback(async (files: File[]) => {
    if (!user) return;
    setBusy(true);
    for (const file of files) {
      const problem = validateFile(file);
      if (problem) {
        notify('error', problem);
        continue;
      }
      try {
        const doc = await uploadDocument(file, user.id);
        await refresh();
        await process(doc.id, doc.title);
      } catch (error) {
        notify('error', errorMessage(error));
      }
    }
    setBusy(false);
  }, [user, notify, refresh, process]);

  const retry = useCallback(async (doc: DocumentRow) => {
    setBusy(true);
    await process(doc.id, doc.title);
    setBusy(false);
  }, [process]);

  const remove = useCallback(async (doc: DocumentRow) => {
    try {
      await deleteDocument(doc);
      notify('success', `${doc.title} is verwijderd`);
    } catch (error) {
      notify('error', errorMessage(error));
    }
    await refresh();
  }, [notify, refresh]);

  return { documents, loading, busy, upload, retry, remove };
}
