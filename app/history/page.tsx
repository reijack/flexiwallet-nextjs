'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase, Transaction } from '@/lib/supabase';
import { categories, formatRupiah } from '@/lib/utils';
import BottomNav from '@/components/BottomNav';
import { useToast } from '@/components/Toast';

export default function HistoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState('all');

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

  return (
    <div className="page-enter pb-28 px-4 pt-4">
      <h2 className="text-xl font-extrabold text-slate-900 mb-4">Riwayat</h2>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
        {['all', ...Object.keys(categories)].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full border-[1.5px] text-xs font-medium whitespace-nowrap transition ${
              filter === f ? 'bg-primary text-white border-primary scale-105' : 'bg-white text-slate-500 border-slate-200'
            }`}
          >
            {f === 'all' ? 'Semua' : categories[f].label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">🧾</p>
          <p className="text-sm text-slate-400">Belum ada transaksi di kategori ini</p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, txs]) => {
          const total = txs.reduce((s, t) => s + Number(t.amount), 0);
          const label = date === todayStr ? 'Hari ini' : new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
          return (
            <div key={date} className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[13px] font-semibold text-slate-900">{label}</p>
                <p className="text-xs font-semibold text-red-500">-{formatRupiah(total)}</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {txs.map((tx) => {
                  const cat = categories[tx.category] || categories.lainnya;
                  const time = new Date(tx.occurred_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                  return (
                    <div key={tx.id} onClick={() => handleDelete(tx.id)} className="flex items-center gap-3 px-4 py-3 border-b border-slate-50 last:border-none cursor-pointer active:bg-slate-50 transition">
                      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-sm shrink-0" style={{ backgroundColor: cat.bg }}>
                        {cat.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-slate-900">{tx.name}</p>
                        <p className="text-[11px] text-slate-400">
                          {cat.label} • {time}
                        </p>
                      </div>
                      <p className="text-[13px] font-bold text-red-500">-{formatRupiah(tx.amount)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}

      <BottomNav />
    </div>
  );
}
