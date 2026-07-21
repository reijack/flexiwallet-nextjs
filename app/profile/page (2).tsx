'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { supabase } from '@/lib/supabase';
import BottomNav from '@/components/BottomNav';
import { useToast } from '@/components/Toast';
import { LogoutIcon, SunIcon, MoonIcon } from '@/components/Icons';

export default function ProfilePage() {
  const { user, profile, loading, refreshProfile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const { showToast } = useToast();
  const [budgetDaily, setBudgetDaily] = useState('');
  const [budgetMonthly, setBudgetMonthly] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (profile) {
      setBudgetDaily(String(profile.budget_daily));
      setBudgetMonthly(String(profile.budget_monthly));
    }
  }, [profile]);

  if (loading || !user) return null;

  const name = profile?.full_name || user.email?.split('@')[0] || '';
  const inputClass =
    'w-full px-3.5 py-3 border-[1.5px] border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:border-primary dark:focus:border-blue-400 transition-colors duration-300';

  async function saveBudget() {
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ budget_daily: parseInt(budgetDaily) || 0, budget_monthly: parseInt(budgetMonthly) || 0 })
      .eq('id', user!.id);
    setSaving(false);
    if (error) {
      showToast('Gagal menyimpan: ' + error.message, 'error');
      return;
    }
    await refreshProfile();
    showToast('Budget berhasil disimpan!', 'success');
  }

  async function handleLogout() {
    await signOut();
    router.replace('/login');
  }

  return (
    <div className="page-enter pb-28 px-4 pt-4">
      <div className="text-center mb-6">
        <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl font-extrabold text-white bg-gradient-to-br from-primary to-primary-dark">
          {name.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{name}</h2>
        <p className="text-[13px] text-slate-500 dark:text-slate-400">{user.email}</p>
      </div>

      <div className="md-surface p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-light dark:bg-blue-500/20 flex items-center justify-center text-primary dark:text-blue-400">
            {theme === 'dark' ? <MoonIcon size={17} /> : <SunIcon size={17} />}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Mode Gelap</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">{theme === 'dark' ? 'Aktif' : 'Nonaktif'}</p>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className={`md-btn relative w-12 h-7 rounded-full transition-colors duration-300 ${theme === 'dark' ? 'bg-primary dark:bg-blue-600' : 'bg-slate-300'}`}
        >
          <span
            className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </button>
      </div>

      <div className="md-surface p-4 mb-4">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">Budget Harian (Rp)</label>
        <input type="number" value={budgetDaily} onChange={(e) => setBudgetDaily(e.target.value)} className={`${inputClass} mb-3`} />
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">Budget Bulanan (Rp)</label>
        <input type="number" value={budgetMonthly} onChange={(e) => setBudgetMonthly(e.target.value)} className={`${inputClass} mb-4`} />
        <button
          onClick={saveBudget}
          disabled={saving}
          className="md-btn md-ripple w-full py-3 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white text-sm font-semibold disabled:opacity-70"
        >
          {saving ? <span className="spinner mr-2" /> : null}
          Simpan Budget
        </button>
      </div>

      <button
        onClick={handleLogout}
        className="md-btn md-ripple w-full py-3.5 rounded-2xl border-2 border-red-100 dark:border-red-900/50 bg-white dark:bg-slate-800 text-red-500 dark:text-red-400 text-sm font-semibold flex items-center justify-center gap-2"
      >
        <LogoutIcon size={16} />
        Logout
      </button>
      <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 mt-4">FlexiWallet v2.1 — Next.js</p>

      <BottomNav />
    </div>
  );
}
