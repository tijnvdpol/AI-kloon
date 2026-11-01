import { useState } from 'react';
import './components/layout.css';
import { AppNav, type Tab } from './components/AppNav';
import { AuthForm } from './components/AuthForm';
import { ChatView } from './components/ChatView';
import { KennisbankView } from './components/KennisbankView';
import { SettingsView } from './components/SettingsView';
import { ToastHost } from './components/ToastHost';
import { UploadView } from './components/UploadView';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { useDocuments } from './hooks/useDocuments';
import { useSettings } from './hooks/useSettings';

function Authed() {
  const [tab, setTab] = useState<Tab>('chat');
  const documents = useDocuments();
  const settings = useSettings();
  const displayName = settings.settings?.display_name?.trim() || null;

  // Alle tabs blijven gemount zodat het gesprek niet verdwijnt bij wisselen.
  return (
    <div className="shell">
      <AppNav tab={tab} onTabChange={setTab} displayName={displayName} />
      <main className="shell__main">
        <section hidden={tab !== 'knowledge'} className="shell__section">
          <KennisbankView documents={documents.documents} loading={documents.loading} onAdd={() => setTab('upload')} onDelete={(doc) => void documents.remove(doc)} />
        </section>
        <section hidden={tab !== 'upload'} className="shell__section">
          <UploadView documents={documents.documents} busy={documents.busy} onFiles={(files) => void documents.upload(files)} onRetry={(doc) => void documents.retry(doc)} onDelete={(doc) => void documents.remove(doc)} />
        </section>
        <section hidden={tab !== 'chat'} className="shell__section shell__section--chat">
          <ChatView displayName={displayName} documentCount={documents.documents.filter((doc) => doc.status === 'ready').length} />
        </section>
        <section hidden={tab !== 'settings'} className="shell__section">
          <SettingsView {...settings} />
        </section>
      </main>
    </div>
  );
}

function Gate() {
  const { user, loading } = useAuth();
  if (loading) return <p className="shell__loading muted">Laden…</p>;
  return user ? <Authed /> : <AuthForm />;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Gate />
        <ToastHost />
      </AuthProvider>
    </ToastProvider>
  );
}
