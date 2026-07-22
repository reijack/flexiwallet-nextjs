'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/Toast';
import Button from '@/components/Button';
import Switch from '@/components/Switch';
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
  const isDark = theme === 'dark';
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
    <div className="pb-28 px-4 pt-4">
      <div className="text-center mb-6">
        <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl font-extrabold text-white bg-gradient-to-br from-primary to-primary-dark">
          {name.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{name}</h2>
        <p className="text-[13px] text-slate-500 dark:text-slate-400">{user.email}</p>
      </div>

      <div className="md-surface p-4 mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-primary-light dark:bg-blue-500/20 flex items-center justify-center text-primary dark:text-blue-400 shrink-0">
            {isDark ? <MoonIcon size={17} /> : <SunIcon size={17} />}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Mode Gelap</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">{isDark ? 'Aktif' : 'Nonaktif'}</p>
          </div>
        </div>
        <Switch checked={isDark} onChange={toggleTheme} />
      </div>

      <div className="md-surface p-4 mb-4">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">Budget Harian (Rp)</label>
        <input type="number" value={budgetDaily} onChange={(e) => setBudgetDaily(e.target.value)} className={`${inputClass} mb-3`} />
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">Budget Bulanan (Rp)</label>
        <input type="number" value={budgetMonthly} onChange={(e) => setBudgetMonthly(e.target.value)} className={`${inputClass} mb-4`} />
        <Button variant="filled" fullWidth loading={saving} onClick={saveBudget}>
          Simpan Budget
        </Button>
      </div>

      <Button variant="danger-outlined" fullWidth icon={<LogoutIcon size={16} />} onClick={handleLogout}>
        Logout
      </Button>

      <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 mt-4">FlexiWallet v2.1 — Next.js</p>

    </div>
  );
}
