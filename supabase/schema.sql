-- Supabase SQL: 在 SQL Editor 中执行

create type wish_status as enum ('red', 'yellow', 'blue', 'green');

create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) >= 2),
  description text not null check (char_length(description) >= 10),
  status wish_status not null default 'red',
  ai_path smallint check (ai_path between 1 and 5),
  ai_analysis jsonb,
  owner_reply text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists wishes_status_idx on public.wishes(status);
create index if not exists wishes_created_idx on public.wishes(created_at desc);

alter table public.wishes enable row level security;

-- 所有人可读（公开许愿墙）
create policy "wishes_select_public"
  on public.wishes for select
  using (true);

-- 登录用户可创建自己的许愿
create policy "wishes_insert_own"
  on public.wishes for insert
  with check (auth.uid() = user_id);

-- 用户只能更新自己的 ai_analysis（HF 分析结果写回）
create policy "wishes_update_own_analysis"
  on public.wishes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 管理员通过 service role 或单独 admin 策略更新 status/owner_reply
-- 生产环境建议用 Edge Function + service key，或设置 admin user_id 白名单

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger wishes_updated_at
  before update on public.wishes
  for each row execute function public.set_updated_at();
