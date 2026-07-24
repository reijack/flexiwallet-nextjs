'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/Toast';
import Button from '@/components/Button';
import Switch from '@/components/Switch';
import { LogoutIcon, SunIcon, MoonIcon, CameraIcon } from '@/components/Icons';

export default function ProfilePage() {
  const { user, profile, loading, refreshProfile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [budgetDaily, setBudgetDaily] = useState('');
  const [budgetMonthly, setBudgetMonthly] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

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

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      showToast('File harus berupa gambar', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran gambar maksimal 5MB', 'error');
      return;
    }

    setUploadingAvatar(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, {
        upsert: true,
        cacheControl: '3600',
      });
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(path);
      // Tambahkan cache-buster biar foto baru langsung kelihatan, nggak kena cache browser lama
      const avatarUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('id', user.id);
      if (updateError) throw updateError;

      await refreshProfile();
      showToast('Foto profil berhasil diperbarui!', 'success');
    } catch (err: any) {
      showToast('Gagal mengunggah foto: ' + (err.message || 'terjadi kesalahan'), 'error');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

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
        <div className="relative w-20 h-20 mx-auto mb-3">
          {profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt={name} className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-extrabold text-white bg-gradient-to-br from-primary to-primary-dark">
              {name.charAt(0).toUpperCase()}
            </div>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingAvatar}
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary dark:bg-blue-600 text-white flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-md transition-transform duration-150 active:scale-90 disabled:opacity-60"
            aria-label="Ubah foto profil"
          >
            {uploadingAvatar ? <span className="spinner" style={{ width: 11, height: 11 }} /> : <CameraIcon size={13} />}
          </button>

          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{name}</h2>
        <p className="text-[13px] text-slate-500 dark:text-slate-400">{user.email}</p>
      </div>

      <div className="md-stagger">
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
      </div>

      <Button variant="danger-outlined" fullWidth icon={<LogoutIcon size={16} />} onClick={handleLogout}>
        Logout
      </Button>

      <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 mt-4">FlexiWallet v2.2 — Next.js</p>
    </div>
  );
}
