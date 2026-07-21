'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import BottomNav from '@/components/BottomNav';
import { useToast } from '@/components/Toast';

export default function ProfilePage() {
  const { user, profile, loading, refreshProfile, signOut } = useAuth();
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
        <h2 className="text-xl font-extrabold text-slate-900">{name}</h2>
        <p className="text-[13px] text-slate-500">{user.email}</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4">
        <label className="text-xs font-semibold text-slate-500 block mb-1.5">Budget Harian (Rp)</label>
        <input
          type="number"
          value={budgetDaily}
          onChange={(e) => setBudgetDaily(e.target.value)}
          className="w-full px-3.5 py-3 border-[1.5px] border-slate-200 rounded-xl text-sm outline-none focus:border-primary mb-3"
        />
        <label className="text-xs font-semibold text-slate-500 block mb-1.5">Budget Bulanan (Rp)</label>
        <input
          type="number"
          value={budgetMonthly}
          onChange={(e) => setBudgetMonthly(e.target.value)}
          className="w-full px-3.5 py-3 border-[1.5px] border-slate-200 rounded-xl text-sm outline-none focus:border-primary mb-4"
        />
        <button
          onClick={saveBudget}
          disabled={saving}
          className="w-full py-3 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white text-sm font-semibold active:scale-95 transition disabled:opacity-70"
        >
          {saving ? <span className="spinner mr-2" /> : null}
          Simpan Budget
        </button>
      </div>

      <button
        onClick={handleLogout}
        className="w-full py-3.5 rounded-2xl border-2 border-red-100 bg-white text-red-500 text-sm font-semibold flex items-center justify-center gap-2 active:scale-95 transition"
      >
        Logout
      </button>
      <p className="text-center text-[11px] text-slate-400 mt-4">FlexiWallet v2.0 — Next.js</p>

      <BottomNav />
    </div>
  );
}
