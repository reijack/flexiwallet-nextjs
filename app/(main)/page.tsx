'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useAuth } from '@/lib/auth-context';
import { supabase, Transaction } from '@/lib/supabase';
import { categories, formatRupiah } from '@/lib/utils';
import { useToast } from '@/components/Toast';
import { WalletIcon, PiggyBankIcon, ChartPieIcon, PlusIcon, XIcon } from '@/components/Icons';
import Button from '@/components/Button';
import { useRipple } from '@/lib/useRipple';
import Link from 'next/link';

ChartJS.register(ArcElement, Tooltip);

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const fabRipple = useRipple<HTMLButtonElement>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [txName, setTxName] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  const loadTransactions = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('transactions').select('*').order('occurred_at', { ascending: false }).limit(200);
    setTransactions((data as Transaction[]) || []);
  }, [user]);

  useEffect(() => {
    if (user) loadTransactions();
  }, [user, loadTransactions]);

  if (loading || !user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-primary-bg dark:bg-slate-950">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark animate-pulse flex items-center justify-center text-white">
          <WalletIcon size={22} />
        </div>
      </div>
    );
  }

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const monthStr = todayStr.slice(0, 7);
  const todayTx = transactions.filter((t) => t.occurred_at.startsWith(todayStr));
  const monthTx = transactions.filter((t) => t.occurred_at.startsWith(monthStr));
  const todayTotal = todayTx.reduce((s, t) => s + Number(t.amount), 0);
  const monthTotal = monthTx.reduce((s, t) => s + Number(t.amount), 0);

  const bd = profile?.budget_daily || 150000;
  const bm = profile?.budget_monthly || 3000000;
  const pctD = Math.min(100, Math.round((todayTotal / bd) * 100));
  const pctM = Math.min(100, Math.round((monthTotal / bm) * 100));

  const catTotals: Record<string, number> = {};
  transactions.forEach((t) => {
    catTotals[t.category] = (catTotals[t.category] || 0) + Number(t.amount);
  });
  const sortedCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  const chartData = {
    labels: sortedCats.map(([k]) => (categories[k] || categories.lainnya).label),
    datasets: [
      {
        data: sortedCats.map(([, v]) => v),
        backgroundColor: sortedCats.map(([k]) => (categories[k] || categories.lainnya).color),
        borderWidth: 0,
        borderRadius: 4,
        spacing: 2,
      },
    ],
  };
  const catTotal = sortedCats.reduce((s, [, v]) => s + v, 0);

  async function addTransaction(e: React.FormEvent) {
    e.preventDefault();
    if (!txName.trim() || !txAmount || !txCategory) return;
    setSaving(true);
    const { data, error } = await supabase
      .from('transactions')
      .insert({ user_id: user!.id, name: txName.trim(), amount: parseInt(txAmount), category: txCategory })
      .select()
      .single();
    setSaving(false);
    if (error) {
      showToast('Gagal menyimpan: ' + error.message, 'error');
      return;
    }
    setTransactions((t) => [data as Transaction, ...t]);
    setShowAddModal(false);
    setTxName('');
    setTxAmount('');
    setTxCategory('');
    showToast('Sip, udah kecatet!', 'success');
  }

  const name = profile?.full_name || user.email?.split('@')[0] || '';
  const inputClass =
    'w-full px-3.5 py-3 border-[1.5px] border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:border-primary dark:focus:border-blue-400 transition-colors duration-300';

  return (
    <div className="pb-28 px-4 pt-4">

      <div className="mb-4 md-stagger">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Selamat datang,</p>
          <h1 className="text-[22px] font-extrabold text-slate-900 dark:text-white">Hai, {name}!</h1>
        </div>
      </div>

      <div className="balance-card rounded-[20px] p-6 text-white relative overflow-hidden mb-5 bg-gradient-to-br from-primary to-primary-dark">
        <p className="text-[13px] opacity-80 mb-1">Pengeluaran Bulan Ini</p>
        <p className="text-[30px] font-extrabold tracking-tight">{formatRupiah(monthTotal)}</p>
        <div className="h-px bg-white/20 my-3.5" />
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[11px] opacity-70">Pengeluaran hari ini</p>
            <p className="text-base font-bold">{formatRupiah(todayTotal)}</p>
          </div>
          <div className="bg-white/15 px-3 py-1.5 rounded-xl text-xs font-semibold">{transactions.length} transaksi</div>
        </div>
      </div>

      <div className="md-surface p-4 mb-4">
        <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-3.5 flex items-center gap-2">
          <PiggyBankIcon size={17} className="text-primary dark:text-blue-400" /> Budget
        </h3>
        <div className="mb-3.5">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-500 dark:text-slate-400">Hari ini</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {formatRupiah(todayTotal)} / {formatRupiah(bd)}
            </span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="budget-fill h-full rounded-full" style={{ width: pctD + '%', backgroundColor: pctD >= 90 ? '#ef4444' : '#f59e0b' }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-500 dark:text-slate-400">Bulan ini</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {formatRupiah(monthTotal)} / {formatRupiah(bm)}
            </span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="budget-fill h-full rounded-full" style={{ width: pctM + '%', backgroundColor: pctM >= 90 ? '#ef4444' : '#2563EB' }} />
          </div>
        </div>
      </div>

      <div className="md-surface p-4 mb-4">
        <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-3.5 flex items-center gap-2">
          <ChartPieIcon size={17} className="text-primary dark:text-blue-400" /> Pengeluaran per Kategori
        </h3>
        {sortedCats.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500">Belum ada data</p>
        ) : (
          <div className="flex items-center gap-4 flex-wrap">
            <div className="w-[150px] h-[150px] shrink-0">
              <Doughnut
                data={chartData}
                options={{ cutout: '62%', plugins: { tooltip: { callbacks: { label: (ctx) => ' ' + ctx.label + ': ' + formatRupiah(ctx.parsed) } } }, animation: { animateRotate: true, duration: 900 } }}
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
              {sortedCats.map(([k, v]) => {
                const cat = categories[k] || categories.lainnya;
                const pct = Math.round((v / catTotal) * 100);
                return (
                  <div key={k} className="flex items-center gap-2 text-[11px]">
                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-slate-500 dark:text-slate-400 flex-1">{cat.label}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="md-surface p-4 mb-4">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Transaksi Terbaru</h3>
          <Link href="/history" className="text-primary dark:text-blue-400 text-xs font-semibold">
            Lihat Semua
          </Link>
        </div>
        {transactions.length === 0 ? (
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 py-5">Belum ada transaksi. Tap tombol tambah untuk catat pengeluaran pertama kamu.</p>
        ) : (
          transactions.slice(0, 6).map((tx) => {
            const cat = categories[tx.category] || categories.lainnya;
            const time = new Date(tx.occurred_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            return (
              <div key={tx.id} className="flex items-center gap-3 py-3.5 border-b border-slate-100 dark:border-slate-700 last:border-none">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: cat.bg }}>
                  <cat.Icon size={17} style={{ color: cat.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-slate-900 dark:text-white truncate">{tx.name}</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    {cat.label} • {time}
                  </p>
                </div>
                <p className="text-[13px] font-bold text-red-500 dark:text-red-400 whitespace-nowrap">-{formatRupiah(tx.amount)}</p>
              </div>
            );
          })
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] pointer-events-none z-40">
        <button
          ref={fabRipple.ref}
          onMouseDown={fabRipple.onPointerDown}
          onClick={() => setShowAddModal(true)}
          className="fab-pop-in overflow-hidden pointer-events-auto absolute bottom-[90px] right-5 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center shadow-[0_8px_24px_rgba(37,99,235,0.45)] dark:shadow-[0_8px_28px_rgba(59,130,246,0.55)] transition-transform duration-200 active:scale-90 hover:scale-105"
        >
          <PlusIcon size={26} />
        </button>
      </div>

      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end justify-center"
          onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}
        >
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl w-full max-w-[480px] max-h-[85vh] overflow-y-auto p-6" style={{ animation: 'slideUp .45s cubic-bezier(.22,1,.36,1)' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Catat Pengeluaran</h3>
              <button onClick={() => setShowAddModal(false)} className="md-btn text-slate-400 dark:text-slate-500">
                <XIcon size={20} />
              </button>
            </div>
            <form onSubmit={addTransaction}>
              <div className="mb-3.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">Nama Transaksi</label>
                <input value={txName} onChange={(e) => setTxName(e.target.value)} required placeholder="Contoh: Kopi Kenangan" className={inputClass} />
              </div>
              <div className="mb-3.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">Nominal (Rp)</label>
                <input type="number" value={txAmount} onChange={(e) => setTxAmount(e.target.value)} required min={1} placeholder="Contoh: 28000" className={inputClass} />
              </div>
              <div className="mb-4">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">Kategori</label>
                <select value={txCategory} onChange={(e) => setTxCategory(e.target.value)} required className={inputClass}>
                  <option value="">Pilih kategori</option>
                  {Object.entries(categories).map(([k, c]) => (
                    <option key={k} value={k}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit" variant="filled" fullWidth loading={saving}>
                Sip, Catet!
              </Button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
