import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/newsreader/400.css';
import '@fontsource/newsreader/500.css';
import '@fontsource/newsreader/400-italic.css';
import '@fontsource/public-sans/400.css';
import '@fontsource/public-sans/500.css';
import '@fontsource/public-sans/600.css';
import './index.css';

async function main() {
  const container = document.getElementById('root');
  if (!container) throw new Error('#root ontbreekt in index.html');
  const root = createRoot(container);

  const missing = (['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'] as const)
    .filter((name) => !import.meta.env[name]);

  // App wordt pas geladen als de config compleet is, want de Supabase-client faalt zonder.
  if (missing.length > 0) {
    const { ConfigError } = await import('./components/ConfigError');
    root.render(<ConfigError missing={missing} />);
    return;
  }
  const { default: App } = await import('./App');
  root.render(<StrictMode><App /></StrictMode>);
}

void main();
