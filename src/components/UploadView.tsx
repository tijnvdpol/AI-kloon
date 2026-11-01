import './documents.css';
import type { DocumentItem } from '../types';
import { PageHeader } from './PageHeader';
import { UploadDropzone } from './UploadDropzone';
import { UploadItem } from './UploadItem';

const RECENT_COUNT = 8;

interface Props {
  documents: DocumentItem[];
  busy: boolean;
  onFiles: (files: File[]) => void;
  onRetry: (doc: DocumentItem) => void;
  onDelete: (doc: DocumentItem) => void;
}

export function UploadView({ documents, busy, onFiles, onRetry, onDelete }: Props) {
  const recent = documents.slice(0, RECENT_COUNT);
  return (
    <div className="page">
      <PageHeader title="Documenten" subtitle="Voeg bronnen toe aan je kennisbank" />
      <UploadDropzone busy={busy} onFiles={onFiles} />
      <section className="section" aria-labelledby="uploads-title">
        <div className="section__head">
          <h2 id="uploads-title" className="section__title">Recente uploads</h2>
          <span className="muted">{documents.length} {documents.length === 1 ? 'bestand' : 'bestanden'}</span>
        </div>
        {recent.length === 0 ? (
          <p className="muted">Nog niets geüpload.</p>
        ) : (
          <ul className="list">
            {recent.map((doc) => <UploadItem key={doc.id} doc={doc} busy={busy} onRetry={onRetry} onDelete={onDelete} />)}
          </ul>
        )}
      </section>
    </div>
  );
}
