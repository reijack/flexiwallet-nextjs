import * as XLSX from 'xlsx';
import { Transaction } from './supabase';
import { categories, formatRupiah } from './utils';

/**
 * Export daftar transaksi jadi file .xlsx dan langsung download di browser.
 * Berisi 2 sheet: "Transaksi" (detail per baris) dan "Ringkasan" (total per kategori).
 */
export function exportTransactionsToExcel(transactions: Transaction[], userName: string) {
  if (transactions.length === 0) return;

  // Urutkan dari yang terlama ke terbaru biar enak dibaca di laporan
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime()
  );

  // Sheet 1: detail transaksi
  const detailRows = sorted.map((tx) => {
    const cat = categories[tx.category] || categories.lainnya;
    const date = new Date(tx.occurred_at);
    return {
      Tanggal: date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      Waktu: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      'Nama Transaksi': tx.name,
      Kategori: cat.label,
      'Nominal (Rp)': Number(tx.amount),
    };
  });

  const totalAll = sorted.reduce((s, t) => s + Number(t.amount), 0);
  detailRows.push({
    Tanggal: '',
    Waktu: '',
    'Nama Transaksi': '',
    Kategori: 'TOTAL',
    'Nominal (Rp)': totalAll,
  });

  const detailSheet = XLSX.utils.json_to_sheet(detailRows);
  detailSheet['!cols'] = [{ wch: 12 }, { wch: 8 }, { wch: 28 }, { wch: 16 }, { wch: 16 }];

  // Sheet 2: ringkasan per kategori
  const catTotals: Record<string, { count: number; total: number }> = {};
  sorted.forEach((tx) => {
    if (!catTotals[tx.category]) catTotals[tx.category] = { count: 0, total: 0 };
    catTotals[tx.category].count++;
    catTotals[tx.category].total += Number(tx.amount);
  });

  const summaryRows = Object.entries(catTotals)
    .sort((a, b) => b[1].total - a[1].total)
    .map(([key, v]) => ({
      Kategori: (categories[key] || categories.lainnya).label,
      'Jumlah Transaksi': v.count,
      'Total (Rp)': v.total,
      Persentase: totalAll > 0 ? Math.round((v.total / totalAll) * 100) + '%' : '0%',
    }));

  summaryRows.push({
    Kategori: 'TOTAL',
    'Jumlah Transaksi': sorted.length,
    'Total (Rp)': totalAll,
    Persentase: '100%',
  });

  const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
  summarySheet['!cols'] = [{ wch: 20 }, { wch: 16 }, { wch: 16 }, { wch: 12 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, detailSheet, 'Transaksi');
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Ringkasan');

  const periodLabel = getPeriodLabel(sorted);
  const fileName = `FlexiWallet_Laporan_${userName.replace(/\s+/g, '_')}_${periodLabel}.xlsx`;

  XLSX.writeFile(workbook, fileName);
}

function getPeriodLabel(sorted: Transaction[]): string {
  if (sorted.length === 0) return 'kosong';
  const first = new Date(sorted[0].occurred_at);
  const last = new Date(sorted[sorted.length - 1].occurred_at);
  const fmt = (d: Date) => d.toISOString().split('T')[0];
  return first.toDateString() === last.toDateString() ? fmt(first) : `${fmt(first)}_sd_${fmt(last)}`;
}
