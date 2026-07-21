# FlexiWallet (Next.js)

Aplikasi pencatat pengeluaran pribadi — Next.js + Supabase (auth & database gratis) + OCR scan struk asli (Tesseract.js, jalan di browser, gratis, tanpa API key).

## Fitur
- Login & daftar akun (email/password), data online per user
- Dashboard: saldo, budget harian/bulanan, grafik kategori
- Riwayat transaksi dengan filter & hapus
- **Scan struk beneran** — foto/upload struk, teksnya dibaca otomatis (OCR), nominal & kategori ditebak otomatis, bisa diedit sebelum disimpan
- Halaman profil untuk atur budget & logout

Panel admin sudah dihapus (project ini untuk pemakaian pribadi).

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Siapkan Supabase (kalau belum)
1. Buat project gratis di https://supabase.com
2. Buka **SQL Editor**, jalankan isi file `supabase-schema.sql`
3. Buka **Settings → API**, copy **Project URL** dan **anon/publishable key**

### 3. Isi environment variable
Copy `.env.local.example` jadi `.env.local`, lalu isi:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxxxxxxxxxxxxx
```

### 4. Jalankan secara lokal
```bash
npm run dev
```
Buka http://localhost:3000

## Deploy gratis (Vercel — direkomendasikan untuk Next.js)
1. Push project ini ke GitHub
2. Buka https://vercel.com → New Project → import repo GitHub kamu
3. Di bagian **Environment Variables**, tambahkan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` (isi sama seperti `.env.local`)
4. Deploy — nanti dapat link `https://nama-project.vercel.app` yang bisa dibuka dari HP mana saja

> Catatan: GitHub Pages **tidak bisa** dipakai untuk Next.js versi ini karena butuh server-side rendering ringan. Pakai Vercel (gratis, dibuat oleh tim yang sama dengan Next.js, setup-nya tinggal klik-klik).

## Cara kerja OCR scan struk
- Pakai **Tesseract.js**, library OCR open-source yang jalan langsung di browser pengguna (client-side), jadi gratis tanpa batas dan tanpa perlu API key/server tambahan
- Setelah teks terbaca, sistem mencari angka yang paling mungkin jadi "Total" (mencari baris dengan kata "total"/"jumlah", kalau tidak ada, ambil angka terbesar di struk)
- Kategori ditebak otomatis dari kata kunci di teks struk (nama resto, nama toko, dll)
- User tetap bisa edit nominal, nama, dan kategori sebelum disimpan — jadi walau OCR salah baca, tetap bisa dikoreksi manual

## Tumpukan Teknologi
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Supabase (Postgres + Auth)
- Tesseract.js (OCR)
- Chart.js + react-chartjs-2
