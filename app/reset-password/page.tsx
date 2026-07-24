'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Button from '@/components/Button';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [validSession, setValidSession] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Supabase otomatis membaca token pemulihan dari URL (hash) dan bikin
    // session sementara begitu halaman ini dibuka lewat link di email.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setValidSession(!!session);
      setChecking(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        setValidSession(true);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak sama.');
      return;
    }

    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);

    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
    setTimeout(() => router.replace('/'), 1800);
  }

  const inputClass =
    'w-full px-3.5 py-3 border-[1.5px] border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:border-primary dark:focus:border-blue-400 focus:ring-4 focus:ring-primary/10 dark:focus:ring-blue-400/10 transition-colors duration-300';

  return (
    <div className="flex flex-col justify-center px-6 py-8 min-h-dvh relative overflow-hidden">
      <div className="bg-blob bg-primary" style={{ top: -80, right: -80, width: 280, height: 280 }} />
      <div className="bg-blob bg-primary-dark" style={{ bottom: 60, left: -100, width: 220, height: 220 }} />

      <div className="text-center mb-7 relative z-10">
        <img src="/logo-icon.png" alt="FlexiWallet" className="w-20 h-20 rounded-2xl mx-auto mb-4 object-cover shadow-[0_8px_24px_rgba(37,99,235,0.35)]" />
        <h1 className="font-display text-2xl font-black text-slate-900 dark:text-white">Buat Password Baru</h1>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">Masukkan password baru untuk akun kamu</p>
      </div>

      <div className="md-surface md-elevated p-6 relative z-10 balance-card">
        {checking ? (
          <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-4">Memeriksa link reset...</p>
        ) : !validSession ? (
          <div className="text-center py-2">
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">Link reset password tidak valid atau sudah kedaluwarsa.</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Coba minta link baru lewat halaman login.</p>
            <Button variant="filled" onClick={() => router.replace('/login')}>
              Kembali ke Login
            </Button>
          </div>
        ) : done ? (
          <div className="text-center py-2">
            <p className="text-sm font-semibold text-green-600 dark:text-green-400 mb-1">Password berhasil diganti!</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Mengalihkan ke dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">Password Baru</label>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 6 karakter" className={inputClass} />
            </div>
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">Konfirmasi Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru"
                className={inputClass}
              />
            </div>
            <Button type="submit" variant="filled" fullWidth loading={busy}>
              Simpan Password Baru
            </Button>
            {error && <p className="text-red-500 text-xs mt-2.5 text-center">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
