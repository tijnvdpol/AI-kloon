import { Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import './documents.css';
import { KIND_FILTERS, formatTime, kindOf, type KindFilter } from '../lib/documentKinds';
import type { DocumentItem } from '../types';
import { KennisbankRow } from './KennisbankRow';
import { PageHeader } from './PageHeader';

interface Props {
  documents: DocumentItem[];
  loading: boolean;
  onAdd: () => void;
  onDelete: (doc: DocumentItem) => void;
}

export function KennisbankView({ documents, loading, onAdd, onDelete }: Props) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<KindFilter>('all');

  const visible = useMemo(() => documents.filter((doc) =>
    (filter === 'all' || kindOf(doc.title) === filter) && doc.title.toLowerCase().includes(query.trim().toLowerCase()),
  ), [documents, filter, query]);

  const fragments = documents.reduce((sum, doc) => sum + doc.chunk_count, 0);
  const latest = documents[0];

  return (
    <div className="page">
      <PageHeader
        title="Kennisbank"
        subtitle="Alles waaruit je kloon antwoordt"
        action={<button type="button" className="button" onClick={onAdd}><Plus size={20} aria-hidden /> Document toevoegen</button>}
      />
      <dl className="stats">
        <div className="stats__item"><dt>Documenten</dt><dd>{documents.length}</dd></div>
        <div className="stats__item"><dt>Fragmenten</dt><dd>{fragments}</dd></div>
        <div className="stats__item"><dt>Bijgewerkt</dt><dd>{latest ? formatTime(latest.created_at) : '–'}</dd></div>
      </dl>
      <div className="filters">
        <label className="search">
          <span className="sr-only">Zoek in je documenten</span>
          <Search size={20} aria-hidden />
          <input type="search" placeholder="Zoek in je documenten" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <div className="pills" role="group" aria-label="Filter op soort">
          {KIND_FILTERS.map(({ id, label }) => (
            <button key={id} type="button" className="pill" aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>
          ))}
        </div>
      </div>
      <section aria-labelledby="docs-title" className="section">
        <h2 id="docs-title" className="sr-only">Documenten</h2>
        {loading ? (
          <p className="muted">Laden…</p>
        ) : visible.length === 0 ? (
          <p className="muted">{documents.length === 0 ? 'Nog geen documenten. Voeg er een toe om te beginnen.' : 'Geen documenten gevonden.'}</p>
        ) : (
          <ul className="rows">
            {visible.map((doc) => <KennisbankRow key={doc.id} doc={doc} onDelete={onDelete} />)}
          </ul>
        )}
        <p className="muted note">Verwijder je een document, dan gebruikt de kloon het niet meer in antwoorden.</p>
      </section>
    </div>
  );
}
