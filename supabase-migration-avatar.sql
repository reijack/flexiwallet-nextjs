-- ============================================
-- FlexiWallet — Migration: Foto Profil
-- Jalankan ini di: Supabase Dashboard > SQL Editor > New query > Run
-- (Aman dijalankan meski sebagian sudah pernah ada, pakai "if not exists")
-- ============================================

-- 1. Tambah kolom avatar_url di tabel profiles
alter table public.profiles add column if not exists avatar_url text;

-- 2. Buat storage bucket "avatars" (public, biar foto bisa ditampilkan tanpa perlu token)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 3. Policy: siapapun bisa LIHAT foto avatar (karena bucket public & untuk ditampilkan di app)
drop policy if exists "Avatar images are publicly accessible" on storage.objects;
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- 4. Policy: user cuma bisa upload/update/hapus foto miliknya sendiri
--    (nama file harus diawali dengan folder user_id mereka, cth: {user_id}/avatar.jpg)
drop policy if exists "Users can upload own avatar" on storage.objects;
create policy "Users can upload own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can update own avatar" on storage.objects;
create policy "Users can update own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can delete own avatar" on storage.objects;
create policy "Users can delete own avatar"
  on storage.objects for delete
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
