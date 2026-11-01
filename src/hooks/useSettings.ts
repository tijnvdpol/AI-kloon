import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getSettings, updateSettings } from '../lib/settingsApi';
import type { CloneSettings, EditableSettings } from '../types';

export function useSettings() {
  const { user } = useAuth();
  const { notify } = useToast();
  const [settings, setSettings] = useState<CloneSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch((error: unknown) => notify('error', error instanceof Error ? error.message : 'Onbekende fout'))
      .finally(() => setLoading(false));
  }, [notify]);

  const save = useCallback(async (values: EditableSettings) => {
    if (!user) return;
    setSaving(true);
    try {
      await updateSettings(user.id, values);
      setSettings((current) => (current ? { ...current, ...values } : current));
      notify('success', 'Instellingen opgeslagen');
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Onbekende fout');
    } finally {
      setSaving(false);
    }
  }, [user, notify]);

  return { settings, loading, saving, save };
}
