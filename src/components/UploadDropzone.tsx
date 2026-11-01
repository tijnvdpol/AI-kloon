import { LoaderCircle, Upload } from 'lucide-react';
import { useRef, useState, type DragEvent } from 'react';
import { SUPPORTED_EXTENSIONS } from '../lib/documentFiles';

interface Props {
  busy: boolean;
  onFiles: (files: File[]) => void;
}

const FORMATS = SUPPORTED_EXTENSIONS.map((extension) => extension.toUpperCase()).join(', ');

export function UploadDropzone({ busy, onFiles }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    setDragging(false);
    if (!busy) onFiles(Array.from(event.dataTransfer.files));
  }

  return (
    <div
      className={`dropzone${dragging ? ' dropzone--active' : ''}`}
      onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <span className="dropzone__icon">
        {busy ? <LoaderCircle className="spin" aria-hidden /> : <Upload aria-hidden />}
      </span>
      <div className="dropzone__text">
        <span className="dropzone__title">{busy ? 'Bezig met verwerken…' : 'Kies bestanden om te uploaden'}</span>
        <span className="muted">{FORMATS} · max. 20 MB per bestand</span>
      </div>
      <button type="button" className="button" disabled={busy} onClick={() => inputRef.current?.click()}>
        Bestand kiezen
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        accept={SUPPORTED_EXTENSIONS.map((extension) => `.${extension}`).join(',')}
        onChange={(event) => {
          onFiles(Array.from(event.target.files ?? []));
          event.target.value = '';
        }}
      />
    </div>
  );
}
