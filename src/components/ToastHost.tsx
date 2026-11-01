import { CircleAlert, CircleCheck, X } from 'lucide-react';
import './toast.css';
import { useToast } from '../contexts/ToastContext';

export function ToastHost() {
  const { toasts, dismiss } = useToast();
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.kind}`}>
          {toast.kind === 'success' ? <CircleCheck size={20} aria-hidden /> : <CircleAlert size={20} aria-hidden />}
          <span className="toast__message">{toast.message}</span>
          <button type="button" className="toast__close" onClick={() => dismiss(toast.id)} aria-label="Sluiten">
            <X size={18} aria-hidden />
          </button>
        </div>
      ))}
    </div>
  );
}
