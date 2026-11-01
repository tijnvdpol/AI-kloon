import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Toast, ToastKind } from '../types';

const TOAST_DURATION_MS = 5000;

interface ToastContextValue {
  toasts: Toast[];
  notify: (kind: ToastKind, message: string) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);
let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback((kind: ToastKind, message: string) => {
    const id = nextId++;
    setToasts((current) => [...current, { id, kind, message }]);
    window.setTimeout(() => dismiss(id), TOAST_DURATION_MS);
  }, [dismiss]);

  const value = useMemo(() => ({ toasts, notify, dismiss }), [toasts, notify, dismiss]);
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast(): ToastContextValue {
  const value = useContext(ToastContext);
  if (!value) throw new Error('useToast buiten ToastProvider gebruikt');
  return value;
}
