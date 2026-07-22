'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase, Transaction } from '@/lib/supabase';
import { categories, formatRupiah } from '@/lib/utils';
import { exportTransactionsToExcel } from '@/lib/export';
import { useToast } from '@/components/Toast';
import { ReceiptIcon, DownloadIcon } from '@/components/Icons';
import { useRipple } from '@/lib/useRipple';

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const { ref, onPointerDown } = useRipple<HTMLButtonElement>();
  return (
    <button
      ref={ref}
      onMouseDown={onPointerDown}
      onClick={onClick}
      className={`relative overflow-hidden px-4 py-1.5 rounded-full border-[1.5px] text-xs font-medium whitespace-nowrap transition-all duration-300 active:scale-95 ${
        active
          ? 'bg-primary dark:bg-blue-600 text-white border-primary dark:border-blue-600 scale-105'
          : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
      }`}
    >
      {label}
    </button>
  );
}

function TxRow({ tx, onDelete }: { tx: Transaction; onDelete: (id: string) => void }) {
  const { ref, onPointerDown } = useRipple<HTMLDivElement>();
  const cat = categories[tx.category] || categories.lainnya;
  const time = new Date(tx.occurred_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      ref={ref}
      onMouseDown={onPointerDown}
      onClick={() => onDelete(tx.id)}
      className="relative overflow-hidden flex items-center gap-3 px-4 py-3 border-b border-slate-50 dark:border-slate-700 last:border-none cursor-pointer transition-transform duration-150 active:scale-[0.99]"
    >
      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: cat.bg }}>
        <cat.Icon size={15} style={{ color: cat.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-slate-900 dark:text-white">{tx.name}</p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          {cat.label} • {time}
        </p>
      </div>
      <p className="text-[13px] font-bold text-red-500 dark:text-red-400">-{formatRupiah(tx.amount)}</p>
    </div>
  );
}

export default function HistoryPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState('all');
  const [exporting, setExporting] = useState(false);
  const exportRipple = useRipple<HTMLButtonElement>();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('transactions').select('*').order('occurred_at', { ascending: false }).limit(300);
    setTransactions((data as Transaction[]) || []);
  }, [user]);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  if (loading || !user) return null;

  const filtered = filter === 'all' ? transactions : transactions.filter((t) => t.category === filter);
  const grouped: Record<string, Transaction[]> = {};
  filtered.forEach((tx) => {
    const d = tx.occurred_at.split('T')[0];
    if (!grouped[d]) grouped[d] = [];
    grouped[d].push(tx);
  });
  const todayStr = new Date().toISOString().split('T')[0];

  async function handleDelete(id: string) {
    if (!confirm('Hapus transaksi ini?')) return;
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) {
      showToast('Gagal menghapus: ' + error.message, 'error');
      return;
    }
    setTransactions((t) => t.filter((x) => x.id !== id));
    showToast('Transaksi dihapus', 'success');
  }

  function handleExport() {
    if (filtered.length === 0) {
      showToast('Tidak ada transaksi untuk diekspor', 'info');
      return;
    }
    setExporting(true);
    try {
      const name = profile?.full_name || user?.email?.split('@')[0] || 'User';
      exportTransactionsToExcel(filtered, name);
      showToast('Laporan Excel berhasil diunduh!', 'success');
    } catch (err) {
      showToast('Gagal membuat file Excel', 'error');
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="pb-28 px-4 pt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Riwayat</h2>
        <button
          ref={exportRipple.ref}
          onMouseDown={exportRipple.onPointerDown}
          onClick={handleExport}
          disabled={exporting || filtered.length === 0}
          className="relative overflow-hidden inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-green-600 text-white text-xs font-semibold transition-transform duration-150 active:scale-95 disabled:opacity-40"
        >
          {exporting ? <span className="spinner" /> : <DownloadIcon size={14} />}
          Export Excel
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
        {['all', ...Object.keys(categories)].map((f) => (
          <FilterChip key={f} label={f === 'all' ? 'Semua' : categories[f].label} active={filter === f} onClick={() => setFilter(f)} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <ReceiptIcon size={40} className="mx-auto mb-3 text-slate-200 dark:text-slate-700" />
          <p className="text-sm text-slate-400 dark:text-slate-500">Belum ada transaksi di kategori ini</p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, txs]) => {
          const total = txs.reduce((s, t) => s + Number(t.amount), 0);
          const label = date === todayStr ? 'Hari ini' : new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
          return (
            <div key={date} className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[13px] font-semibold text-slate-900 dark:text-white">{label}</p>
                <p className="text-xs font-semibold text-red-500 dark:text-red-400">-{formatRupiah(total)}</p>
              </div>
              <div className="md-surface overflow-hidden">
                {txs.map((tx) => (
                  <TxRow key={tx.id} tx={tx} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          );
        })
      )}

    </div>
  );
}
