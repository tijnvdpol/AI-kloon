import { CircleAlert, Clock, Check, LoaderCircle } from 'lucide-react';
import { badgeOf } from '../lib/documentKinds';
import type { DocumentItem } from '../types';
import { DeleteButton } from './DeleteButton';

interface Props {
  doc: DocumentItem;
  busy: boolean;
  onRetry: (doc: DocumentItem) => void;
  onDelete: (doc: DocumentItem) => void;
}

const STEPS = ['Geüpload', 'Verwerken', 'Klaar'] as const;

function StatusLine({ doc }: { doc: DocumentItem }) {
  switch (doc.status) {
    case 'ready':
      return <span className="upload__status upload__status--ready"><Check size={14} aria-hidden /> Verwerkt · {doc.chunk_count} fragmenten</span>;
    case 'error':
      return <span className="upload__status upload__status--error"><CircleAlert size={14} aria-hidden /> Mislukt · {doc.error_message ?? 'onbekende fout'}</span>;
    case 'processing':
      return <span className="upload__status upload__status--busy"><LoaderCircle size={14} className="spin" aria-hidden /> Bezig met verwerken</span>;
    default:
      return <span className="upload__status"><Clock size={14} aria-hidden /> In de wachtrij</span>;
  }
}

export function UploadItem({ doc, busy, onRetry, onDelete }: Props) {
  const active = doc.status === 'pending' || doc.status === 'processing';
  const reached = doc.status === 'processing' ? 2 : 1;
  return (
    <li className="card upload">
      <div className="upload__row">
        <span className="badge">{badgeOf(doc.title)}</span>
        <div className="upload__info">
          <span className="upload__name">{doc.title}</span>
          <StatusLine doc={doc} />
        </div>
      </div>
      {active && (
        <>
          <div role="progressbar" aria-label={`Voortgang ${doc.title}`} className="progress"><div className="progress__bar" /></div>
          <ol className="steps">
            {STEPS.map((step, index) => (
              <li key={step} className={`steps__item${index < reached ? ' steps__item--done' : ''}${index === reached - 1 && doc.status === 'processing' ? ' steps__item--active' : ''}`}>
                <span className="steps__bar" />
                {step}
              </li>
            ))}
          </ol>
        </>
      )}
      {doc.status === 'error' && (
        <div className="upload__actions">
          <button type="button" className="button button--secondary" disabled={busy} onClick={() => onRetry(doc)}>Opnieuw proberen</button>
          <DeleteButton title={doc.title} onConfirm={() => onDelete(doc)} />
        </div>
      )}
    </li>
  );
}
