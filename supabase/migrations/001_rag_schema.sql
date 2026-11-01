create extension if not exists vector with schema extensions;

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  storage_bucket text not null default 'documents',
  storage_path text not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'ready', 'error')),
  error_message text,
  created_at timestamptz not null default now()
);

create table public.chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  chunk_index int not null,
  content text not null,
  embedding extensions.vector(768) not null
);

create table public.clone_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  system_prompt text not null default 'Je bent een behulpzame AI-kloon. Beantwoord vragen uitsluitend op basis van de aangeleverde bronnen. Staat het antwoord niet in de bronnen, zeg dat dan eerlijk. Antwoord in het Nederlands.',
  chat_model text not null default 'gemini-2.5-flash',
  embedding_model text not null default 'gemini-embedding-001',
  match_count int not null default 5 check (match_count between 1 and 20)
);

create index documents_user_id_idx on public.documents (user_id);
create index chunks_document_id_idx on public.chunks (document_id);
create index chunks_embedding_idx on public.chunks using hnsw (embedding extensions.vector_cosine_ops);

alter table public.documents enable row level security;
alter table public.chunks enable row level security;
alter table public.clone_settings enable row level security;

create policy documents_select_own on public.documents for select to authenticated using (user_id = (select auth.uid()));
create policy documents_insert_own on public.documents for insert to authenticated with check (user_id = (select auth.uid()));
create policy documents_delete_own on public.documents for delete to authenticated using (user_id = (select auth.uid()));

create policy chunks_select_own on public.chunks for select to authenticated using (user_id = (select auth.uid()));

create policy settings_select_own on public.clone_settings for select to authenticated using (user_id = (select auth.uid()));
create policy settings_update_own on public.clone_settings for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

grant select, insert, delete on public.documents to authenticated;
grant select, insert, update, delete on public.documents to service_role;
grant select on public.chunks to authenticated;
grant select, insert, update, delete on public.chunks to service_role;
grant select on public.clone_settings to authenticated;
grant update (system_prompt, chat_model, match_count) on public.clone_settings to authenticated;
grant select, insert, update on public.clone_settings to service_role;

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.clone_settings (user_id) values (new.id);
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

insert into public.clone_settings (user_id) select id from auth.users on conflict do nothing;
