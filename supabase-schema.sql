-- ============================================
-- FlexiWallet — Supabase Schema (v2, tanpa admin)
-- Jalankan ini di: Supabase Dashboard > SQL Editor > New query > Run
-- ============================================

create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  budget_daily numeric default 150000,
  budget_monthly numeric default 3000000,
  created_at timestamptz default now()
);

create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  amount numeric not null check (amount > 0),
  category text not null,
  occurred_at timestamptz default now(),
  created_at timestamptz default now()
);

create index if not exists transactions_user_id_idx on public.transactions(user_id);
create index if not exists transactions_occurred_at_idx on public.transactions(occurred_at desc);

alter table public.profiles enable row level security;
alter table public.transactions enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users can view own transactions" on public.transactions for select using (auth.uid() = user_id);
create policy "Users can insert own transactions" on public.transactions for insert with check (auth.uid() = user_id);
create policy "Users can update own transactions" on public.transactions for update using (auth.uid() = user_id);
create policy "Users can delete own transactions" on public.transactions for delete using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- CATATAN: kalau kamu SEBELUMNYA sudah pernah jalankan schema v1
-- (yang ada kolom is_admin dan tabel admin), kolom is_admin dan
-- policy admin-nya nggak akan otomatis hilang. Itu tidak masalah,
-- dibiarkan saja tidak akan mengganggu. Kalau mau dibersihkan,
-- jalankan opsional ini:
--
-- alter table public.profiles drop column if exists is_admin;
-- drop policy if exists "Admins can view all profiles" on public.profiles;
-- drop policy if exists "Admins can update all profiles" on public.profiles;
-- drop policy if exists "Admins can view all transactions" on public.transactions;
-- drop policy if exists "Admins can delete any transaction" on public.transactions;
-- ============================================
