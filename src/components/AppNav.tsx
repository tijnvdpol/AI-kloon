import { BookOpen, Library, LogOut, MessageSquare, Settings, Upload, type LucideIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export type Tab = 'knowledge' | 'upload' | 'chat' | 'settings';

const ITEMS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'knowledge', label: 'Kennisbank', icon: Library },
  { id: 'upload', label: 'Uploaden', icon: Upload },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'settings', label: 'Instellingen', icon: Settings },
];

interface Props {
  tab: Tab;
  displayName: string | null;
  onTabChange: (tab: Tab) => void;
}

export function AppNav({ tab, displayName, onTabChange }: Props) {
  const { signOut } = useAuth();
  return (
    <nav className="nav" aria-label="Hoofdmenu">
      <div className="nav__brand">
        <span className="logo"><BookOpen size={22} aria-hidden /></span>
        <span className="nav__brand-text">
          <span className="nav__brand-name">{displayName ? `AI-kloon van ${displayName}` : 'AI-kloon'}</span>
          <span className="muted nav__brand-sub">Beheeromgeving</span>
        </span>
      </div>
      <ul className="nav__list">
        {ITEMS.map(({ id, label, icon: Icon }) => (
          <li key={id}>
            <button type="button" className="nav__item" aria-current={tab === id ? 'page' : undefined} onClick={() => onTabChange(id)}>
              <Icon size={22} aria-hidden />
              {label}
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="nav__signout" onClick={() => void signOut()}>
        <LogOut size={18} aria-hidden />
        Uitloggen
      </button>
    </nav>
  );
}
