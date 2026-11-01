import { useEffect, useState, type FormEvent } from 'react';
import type { useSettings } from '../hooks/useSettings';
import { PageHeader } from './PageHeader';

type Props = ReturnType<typeof useSettings>;

export function SettingsView({ settings, loading, saving, save }: Props) {
  const [displayName, setDisplayName] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [chatModel, setChatModel] = useState('');
  const [matchCount, setMatchCount] = useState(5);

  useEffect(() => {
    if (!settings) return;
    setDisplayName(settings.display_name ?? '');
    setSystemPrompt(settings.system_prompt);
    setChatModel(settings.chat_model);
    setMatchCount(settings.match_count);
  }, [settings]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void save({
      display_name: displayName.trim() || null,
      system_prompt: systemPrompt,
      chat_model: chatModel,
      match_count: matchCount,
    });
  }

  return (
    <div className="page">
      <PageHeader title="Instellingen" subtitle="Bepaal hoe je kloon zich gedraagt" />
      {loading && <p className="muted">Laden…</p>}
      {!loading && !settings && <p className="muted">Instellingen niet beschikbaar.</p>}
      {settings && (
        <form className="card settings" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field__label">Naam van de kloon</span>
            <input className="input" value={displayName} placeholder="Bijvoorbeeld jouw voornaam" onChange={(e) => setDisplayName(e.target.value)} />
            <span className="field__hint">Wordt getoond als "AI-kloon van …" en in de chat.</span>
          </label>
          <label className="field">
            <span className="field__label">Systeemprompt</span>
            <textarea className="input" rows={8} required value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} />
            <span className="field__hint">Bepaalt hoe de kloon antwoordt. De bronnen worden automatisch toegevoegd.</span>
          </label>
          <label className="field">
            <span className="field__label">Chatmodel (Gemini)</span>
            <input className="input" required value={chatModel} onChange={(e) => setChatModel(e.target.value)} />
          </label>
          <label className="field">
            <span className="field__label">Aantal bronnen per vraag</span>
            <input className="input" type="number" min={1} max={20} required value={matchCount} onChange={(e) => setMatchCount(Number(e.target.value))} />
          </label>
          <p className="field__hint">Embeddingmodel: {settings.embedding_model} (vast, want bestaande documenten gebruiken dit model).</p>
          <button type="submit" className="button" disabled={saving}>Opslaan</button>
        </form>
      )}
    </div>
  );
}
