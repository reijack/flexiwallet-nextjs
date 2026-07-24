'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import Button from '@/components/Button';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  useEffect(() => {
    if (!loading && user) router.replace('/');
  }, [user, loading, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
    setBusy(false);
    if (error) {
      setError(error.message === 'Invalid login credentials' ? 'Email atau password salah.' : error.message);
      return;
    }
    router.replace('/');
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: {
        data: { full_name: signupName },
        emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data.session) {
      router.replace('/');
    } else {
      setSuccess('Akun dibuat! Cek email kamu untuk verifikasi, lalu login.');
    }
  }

  const inputClass =
    'w-full px-3.5 py-3 border-[1.5px] border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:border-primary dark:focus:border-blue-400 focus:ring-4 focus:ring-primary/10 dark:focus:ring-blue-400/10 transition-colors duration-300';

  return (
    <div className="flex flex-col justify-center px-6 py-8 min-h-dvh relative overflow-hidden">
      <div className="bg-blob bg-primary" style={{ top: -80, right: -80, width: 280, height: 280 }} />
      <div className="bg-blob bg-primary-dark" style={{ bottom: 60, left: -100, width: 220, height: 220 }} />

      <div className="text-center mb-7 relative z-10">
        <img src="/logo-icon.png" alt="FlexiWallet" className="w-20 h-20 rounded-2xl mx-auto mb-4 object-cover shadow-[0_8px_24px_rgba(37,99,235,0.35)]" />
        <h1 className="font-display text-2xl font-black text-slate-900 dark:text-white">
          Flexi<span className="text-primary dark:text-blue-400">Wallet</span>
        </h1>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">Catat pengeluaran kamu, di mana saja</p>
      </div>

      <div className="md-surface md-elevated p-6 relative z-10 balance-card">
        <div className="flex mb-5 border-b border-slate-100 dark:border-slate-700">
          <button
            onClick={() => setTab('login')}
            className={`md-btn flex-1 pb-2.5 text-center text-[13px] font-semibold border-b-2 ${
              tab === 'login' ? 'text-primary dark:text-blue-400 border-primary dark:border-blue-400' : 'text-slate-400 dark:text-slate-500 border-transparent'
            }`}
          >
            Masuk
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`md-btn flex-1 pb-2.5 text-center text-[13px] font-semibold border-b-2 ${
              tab === 'signup' ? 'text-primary dark:text-blue-400 border-primary dark:border-blue-400' : 'text-slate-400 dark:text-slate-500 border-transparent'
            }`}
          >
            Daftar
          </button>
        </div>

        {tab === 'login' ? (
          <form key="login-form" onSubmit={handleLogin} className="soft-fade-in">
            <div className="mb-3.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">Email</label>
              <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="kamu@email.com" className={inputClass} />
            </div>
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">Password</label>
              <input type="password" required minLength={6} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Password kamu" className={inputClass} />
            </div>
            <Button type="submit" variant="filled" fullWidth loading={busy}>
              Masuk
            </Button>
            {error && <p className="text-red-500 text-xs mt-2.5 text-center">{error}</p>}
          </form>
        ) : (
          <form key="signup-form" onSubmit={handleSignup} className="soft-fade-in">
            <div className="mb-3.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">Nama Lengkap</label>
              <input type="text" required value={signupName} onChange={(e) => setSignupName(e.target.value)} placeholder="Nama kamu" className={inputClass} />
            </div>
            <div className="mb-3.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">Email</label>
              <input type="email" required value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="kamu@email.com" className={inputClass} />
            </div>
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">Password</label>
              <input type="password" required minLength={6} value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder="Minimal 6 karakter" className={inputClass} />
            </div>
            <Button type="submit" variant="filled" fullWidth loading={busy}>
              Buat Akun
            </Button>
            {error && <p className="text-red-500 text-xs mt-2.5 text-center">{error}</p>}
            {success && <p className="text-green-600 dark:text-green-400 text-xs mt-2.5 text-center">{success}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
