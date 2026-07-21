'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

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

  return (
    <div className="flex flex-col justify-center px-6 py-8 min-h-dvh relative overflow-hidden">
      <div className="bg-blob bg-primary" style={{ top: -80, right: -80, width: 280, height: 280 }} />
      <div className="bg-blob bg-primary-dark" style={{ bottom: 60, left: -100, width: 220, height: 220 }} />

      <div className="text-center mb-7 relative z-10">
        <div className="w-16 h-16 rounded-[18px] mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark">
          <span className="text-2xl">💳</span>
        </div>
        <h1 className="font-display text-2xl font-black text-slate-900">
          Flexi<span className="text-primary">Wallet</span>
        </h1>
        <p className="text-[13px] text-slate-500 mt-1">Catat pengeluaran kamu, di mana saja</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative z-10">
        <div className="flex mb-5 border-b border-slate-100">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 pb-2.5 text-center text-[13px] font-semibold border-b-2 transition-all ${
              tab === 'login' ? 'text-primary border-primary' : 'text-slate-400 border-transparent'
            }`}
          >
            Masuk
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`flex-1 pb-2.5 text-center text-[13px] font-semibold border-b-2 transition-all ${
              tab === 'signup' ? 'text-primary border-primary' : 'text-slate-400 border-transparent'
            }`}
          >
            Daftar
          </button>
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="mb-3.5">
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Email</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="kamu@email.com"
                className="w-full px-3.5 py-3 border-[1.5px] border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
              />
            </div>
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Password kamu"
                className="w-full px-3.5 py-3 border-[1.5px] border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
              />
            </div>
            <button
              disabled={busy}
              className="w-full py-3.5 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white text-[15px] font-semibold active:scale-95 transition disabled:opacity-70"
            >
              {busy ? <span className="spinner mr-2" /> : null}
              Masuk
            </button>
            {error && <p className="text-red-500 text-xs mt-2.5 text-center">{error}</p>}
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <div className="mb-3.5">
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Nama Lengkap</label>
              <input
                type="text"
                required
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                placeholder="Nama kamu"
                className="w-full px-3.5 py-3 border-[1.5px] border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
              />
            </div>
            <div className="mb-3.5">
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Email</label>
              <input
                type="email"
                required
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="kamu@email.com"
                className="w-full px-3.5 py-3 border-[1.5px] border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
              />
            </div>
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full px-3.5 py-3 border-[1.5px] border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
              />
            </div>
            <button
              disabled={busy}
              className="w-full py-3.5 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white text-[15px] font-semibold active:scale-95 transition disabled:opacity-70"
            >
              {busy ? <span className="spinner mr-2" /> : null}
              Buat Akun
            </button>
            {error && <p className="text-red-500 text-xs mt-2.5 text-center">{error}</p>}
            {success && <p className="text-green-600 text-xs mt-2.5 text-center">{success}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
