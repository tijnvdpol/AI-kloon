import { CircleAlert } from 'lucide-react';
import './layout.css';

export function ConfigError({ missing }: { missing: readonly string[] }) {
  return (
    <div className="page">
      <div className="card" role="alert">
        <h1><CircleAlert aria-hidden /> Config ontbreekt</h1>
        <p>Zet deze variabelen in <code>.env.local</code> (zie <code>.env.example</code>):</p>
        <ul>{missing.map((name) => <li key={name}><code>{name}</code></li>)}</ul>
      </div>
    </div>
  );
}
