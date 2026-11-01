import { BookOpen } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import './auth.css';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export function AuthForm() {
  const { signIn, signUp } = useAuth();
  const { notify } = useToast();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const isLogin = mode === 'login';

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else if (await signUp(email, password)) {
        notify('success', 'Bevestig je e-mailadres via de mail die we stuurden, en log daarna in.');
        setMode('login');
      }
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Onbekende fout');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth">
      <aside className="auth__panel">
        <div className="auth__brand">
          <span className="logo auth__logo"><BookOpen size={22} aria-hidden /></span>
          <span className="auth__brand-name">AI-kloon</span>
        </div>
        <div className="auth__pitch">
          <p className="auth__headline">Een kloon die antwoordt vanuit je eigen documenten.</p>
          <p className="auth__lead">Voeg je bronnen toe en elk antwoord laat zien waar het vandaan komt.</p>
        </div>
      </aside>
      <section className="auth__main">
        <div className="auth__content">
          <div className="auth__brand auth__brand--mobile">
            <span className="logo"><BookOpen size={22} aria-hidden /></span>
            <span className="auth__brand-name">AI-kloon</span>
          </div>
          <div className="auth__intro">
            <h1 className="auth__title">{isLogin ? 'Welkom terug' : 'Account maken'}</h1>
            <p className="muted">
              {isLogin
                ? 'Log in om documenten toe te voegen en te bepalen wat je kloon weet.'
                : 'Maak een account om je eigen kennisbank en kloon te beginnen.'}
            </p>
          </div>
          <form className="auth__form" onSubmit={(event) => void handleSubmit(event)}>
            <label className="field">
              <span className="field__label">E-mailadres</span>
              <input className="input" type="email" autoComplete="email" placeholder="naam@student.nl" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <div className="field">
              <label className="field__label" htmlFor="password">Wachtwoord</label>
              <div className="auth__password">
                <input
                  id="password"
                  className="auth__password-input"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  minLength={6}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" className="auth__toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? 'Verbergen' : 'Tonen'}
                </button>
              </div>
            </div>
            <button className="button auth__submit" type="submit" disabled={submitting}>
              {isLogin ? 'Inloggen' : 'Account maken'}
            </button>
          </form>
          <p className="auth__switch muted">
            {isLogin ? 'Nog geen account?' : 'Heb je al een account?'}{' '}
            <button type="button" className="auth__link" onClick={() => setMode(isLogin ? 'signup' : 'login')}>
              {isLogin ? 'Maak er een' : 'Log in'}
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}
