alter table public.clone_settings alter column chat_model set default 'gemini-3.5-flash';
update public.clone_settings set chat_model = 'gemini-3.5-flash' where chat_model = 'gemini-2.5-flash';
