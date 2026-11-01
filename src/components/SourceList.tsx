import { excerpt } from '../lib/text';
import type { Source } from '../types';

interface Props {
  sources: Source[];
  activeIndex: number | null;
  variant: 'inline' | 'panel';
}

const QUOTE_LENGTH = { inline: 160, panel: 420 } as const;

export function SourceList({ sources, activeIndex, variant }: Props) {
  if (sources.length === 0) {
    return <p className={`muted sources sources--${variant}`}>Geen bronnen gevonden.</p>;
  }
  return (
    <section className={`sources sources--${variant}`} aria-label="Bronnen">
      {variant === 'inline' && <h2 className="sources__heading">Bronnen</h2>}
      <ol className="sources__list">
        {sources.map((source) => (
          <li key={source.index} className={`source${activeIndex === source.index ? ' source--active' : ''}`}>
            <span className="source__num">{source.index}</span>
            <span className="source__body">
              <span className="source__title">{source.title}</span>
              <span className="source__quote">“{excerpt(source.content, QUOTE_LENGTH[variant])}”</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
