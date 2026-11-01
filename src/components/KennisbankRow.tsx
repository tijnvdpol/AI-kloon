import { LoaderCircle } from 'lucide-react';
import { badgeOf, formatDate } from '../lib/documentKinds';
import type { DocumentItem } from '../types';
import { DeleteButton } from './DeleteButton';

interface Props {
  doc: DocumentItem;
  onDelete: (doc: DocumentItem) => void;
}

export function KennisbankRow({ doc, onDelete }: Props) {
  const processing = doc.status === 'pending' || doc.status === 'processing';
  return (
    <li className="row">
      <div className="row__info">
        <span className="row__name">{doc.title}</span>
        <span className="muted row__meta">{doc.chunk_count} fragmenten · {formatDate(doc.created_at)}</span>
        {processing && <span className="upload__status upload__status--busy"><LoaderCircle size={14} className="spin" aria-hidden /> Wordt verwerkt</span>}
        {doc.status === 'error' && <span className="upload__status upload__status--error">Mislukt · {doc.error_message ?? 'onbekende fout'}</span>}
      </div>
      <span className="tag">{badgeOf(doc.title)}</span>
      <DeleteButton title={doc.title} onConfirm={() => onDelete(doc)} />
    </li>
  );
}
