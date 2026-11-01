alter table public.clone_settings add column display_name text;

grant update (display_name) on public.clone_settings to authenticated;
