import Markdown from 'react-markdown';

interface Props {
  text: string;
  sourceCount: number;
  onCite: (index: number) => void;
}

const CITATION = /\[(\d+)\]/g;

export function CitedAnswer({ text, sourceCount, onCite }: Props) {
  // [n] wordt een markdown-link zodat we er een klikbare bronbadge van kunnen maken.
  const linked = text.replace(CITATION, (match, n: string) => (Number(n) >= 1 && Number(n) <= sourceCount ? `[${n}](#bron-${n})` : match));
  return (
    <div className="answer__text">
      <Markdown
        components={{
          a: ({ href, children }) => {
            if (href?.startsWith('#bron-')) {
              const index = Number(href.slice(6));
              return <button type="button" className="cite" aria-label={`Toon bron ${index}`} onClick={() => onCite(index)}>{children}</button>;
            }
            return <a href={href} target="_blank" rel="noreferrer">{children}</a>;
          },
        }}
      >
        {linked}
      </Markdown>
    </div>
  );
}
