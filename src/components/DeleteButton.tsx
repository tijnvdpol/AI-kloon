import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
  title: string;
  onConfirm: () => void;
}

export function DeleteButton({ title, onConfirm }: Props) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button type="button" className="button button--ghost" onClick={() => setConfirming(true)} aria-label={`Verwijderen: ${title}`}>
        <Trash2 size={18} aria-hidden />
        <span className="delete__label">Verwijderen</span>
      </button>
    );
  }
  return (
    <span className="delete__confirm" role="group" aria-label={`Verwijderen bevestigen: ${title}`}>
      <button type="button" className="button button--secondary delete__yes" onClick={() => { setConfirming(false); onConfirm(); }}>
        Ja, verwijder
      </button>
      <button type="button" className="button button--ghost" onClick={() => setConfirming(false)}>
        Annuleer
      </button>
    </span>
  );
}
