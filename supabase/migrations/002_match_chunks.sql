create function public.match_chunks(query_embedding extensions.vector(768), match_count int default 5)
returns table (id uuid, document_id uuid, title text, content text, similarity double precision)
language sql stable security invoker
set search_path = public, extensions
as $$
  select c.id, c.document_id, d.title, c.content, 1 - (c.embedding <=> query_embedding) as similarity
  from public.chunks c
  join public.documents d on d.id = c.document_id
  order by c.embedding <=> query_embedding
  limit match_count;
$$;

revoke execute on function public.match_chunks(extensions.vector, int) from public, anon;
grant execute on function public.match_chunks(extensions.vector, int) to authenticated;
