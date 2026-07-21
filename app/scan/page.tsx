'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { categories, formatRupiah, guessCategory } from '@/lib/utils';
import BottomNav from '@/components/BottomNav';
import { useToast } from '@/components/Toast';

type OcrResult = {
  rawText: string;
  candidateAmounts: number[];
  suggestedAmount: number | null;
  suggestedCategory: string;
};

// Parse OCR text for rupiah-like numbers and guess the total.
function parseReceiptText(text: string): OcrResult {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  // Find all number-like tokens (handles 12.000 / 12,000 / 12000 / Rp12.000)
  const numberRegex = /(?:rp\.?\s?)?(\d{1,3}(?:[.,]\d{3})+|\d{4,})(?!\d)/gi;
  const candidates: number[] = [];
  const totalLineNumbers: number[] = [];

  const totalKeywords = /(total|jumlah|grand total|total bayar|total belanja|amount due)/i;

  lines.forEach((line) => {
    const matches = [...line.matchAll(numberRegex)];
    matches.forEach((m) => {
      const cleaned = m[1].replace(/[.,]/g, '');
      const num = parseInt(cleaned, 10);
      if (!isNaN(num) && num >= 500 && num <= 50000000) {
        candidates.push(num);
        if (totalKeywords.test(line)) totalLineNumbers.push(num);
      }
    });
  });

  let suggestedAmount: number | null = null;
  if (totalLineNumbers.length > 0) {
    suggestedAmount = Math.max(...totalLineNumbers);
  } else if (candidates.length > 0) {
    suggestedAmount = Math.max(...candidates);
  }

  const suggestedCategory = guessCategory(text);

  return { rawText: text, candidateAmounts: candidates, suggestedAmount, suggestedCategory };
}

export default function ScanPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<OcrResult | null>(null);
  const [txName, setTxName] = useState('Scan Struk');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState('makan');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  if (loading || !user) return null;

  async function handleFile(file: File) {
    setResult(null);
    setImagePreview(URL.createObjectURL(file));
    setScanning(true);
    setProgress(0);

    try {
      const Tesseract = (await import('tesseract.js')).default;
      const { data } = await Tesseract.recognize(file, 'ind+eng', {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === 'recognizing text') setProgress(Math.round(m.progress * 100));
        },
      });

      const parsed = parseReceiptText(data.text);
      setResult(parsed);
      setTxAmount(parsed.suggestedAmount ? String(parsed.suggestedAmount) : '');
      setTxCategory(parsed.suggestedCategory);
      if (!parsed.suggestedAmount) {
        showToast('Nominal tidak terdeteksi otomatis, isi manual ya', 'info');
      } else {
        showToast('Struk berhasil dibaca!', 'success');
      }
    } catch (err) {
      showToast('Gagal membaca struk, coba foto yang lebih jelas', 'error');
    } finally {
      setScanning(false);
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function reset() {
    setImagePreview(null);
    setResult(null);
    setTxAmount('');
    setTxName('Scan Struk');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function saveTransaction(e: React.FormEvent) {
    e.preventDefault();
    if (!txAmount || !txCategory) return;
    setSaving(true);
    const { error } = await supabase.from('transactions').insert({
      user_id: user!.id,
      name: txName.trim() || 'Scan Struk',
      amount: parseInt(txAmount),
      category: txCategory,
    });
    setSaving(false);
    if (error) {
      showToast('Gagal menyimpan: ' + error.message, 'error');
      return;
    }
    showToast('Sip, struk udah kecatet!', 'success');
    reset();
  }

  return (
    <div className="page-enter pb-28 px-4 pt-4">
      <h2 className="text-xl font-extrabold text-slate-900 mb-1">Flex-Scan</h2>
      <p className="text-[13px] text-slate-500 mb-6">Foto struk kamu, sistem akan baca teksnya otomatis (OCR)</p>

      {!imagePreview && (
        <div className="flex flex-col items-center gap-6">
          <div className="scan-viewfinder w-60 h-60 border-[3px] border-primary rounded-[20px] relative flex items-center justify-center flex-col gap-2">
            <div className="absolute inset-2 border border-dashed border-primary/40 rounded-2xl" />
            <span className="text-3xl opacity-50">📷</span>
            <p className="text-[11px] text-slate-400 text-center px-5">Arahkan kamera ke struk atau upload gambar</p>
          </div>
          <div className="flex gap-3 w-full max-w-[280px]">
            <label className="flex-1 py-3.5 rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white text-sm font-semibold text-center cursor-pointer active:scale-95 transition">
              📷 Ambil Foto
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={onFileChange} />
            </label>
            <label className="flex-1 py-3.5 rounded-2xl border-2 border-primary text-primary text-sm font-semibold text-center cursor-pointer active:scale-95 transition">
              ⬆️ Upload
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
            </label>
          </div>
        </div>
      )}

      {imagePreview && (
        <div>
          <div className="rounded-2xl overflow-hidden border border-slate-200 mb-4 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreview} alt="Struk" className="w-full max-h-72 object-contain bg-slate-50" />
            {!scanning && (
              <button onClick={reset} className="absolute top-2 right-2 bg-white/90 rounded-full w-8 h-8 flex items-center justify-center text-slate-500 shadow">
                ✕
              </button>
            )}
          </div>

          {scanning && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[13px] font-semibold text-slate-900">Membaca struk... {progress}%</p>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: progress + '%' }} />
              </div>
            </div>
          )}

          {result && !scanning && (
            <form onSubmit={saveTransaction} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3.5">
                <span className="text-green-500">✓</span>
                <p className="text-[13px] font-semibold text-slate-900">Struk berhasil dibaca</p>
              </div>

              {result.candidateAmounts.length > 1 && (
                <div className="mb-3.5">
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Nominal terdeteksi (pilih salah satu atau edit manual)</label>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {[...new Set(result.candidateAmounts)].slice(0, 6).map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => setTxAmount(String(amt))}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                          txAmount === String(amt) ? 'bg-primary text-white border-primary' : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {formatRupiah(amt)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-3.5">
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Nama Transaksi</label>
                <input value={txName} onChange={(e) => setTxName(e.target.value)} className="w-full px-3.5 py-3 border-[1.5px] border-slate-200 rounded-xl text-sm outline-none focus:border-primary" />
              </div>
              <div className="mb-3.5">
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Nominal (Rp)</label>
                <input type="number" value={txAmount} onChange={(e) => setTxAmount(e.target.value)} required min={1} className="w-full px-3.5 py-3 border-[1.5px] border-slate-200 rounded-xl text-sm outline-none focus:border-primary" />
              </div>
              <div className="mb-4">
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Kategori</label>
                <select value={txCategory} onChange={(e) => setTxCategory(e.target.value)} required className="w-full px-3.5 py-3 border-[1.5px] border-slate-200 rounded-xl text-sm outline-none focus:border-primary bg-white">
                  {Object.entries(categories).map(([k, c]) => (
                    <option key={k} value={k}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <details className="mb-4">
                <summary className="text-xs text-slate-400 cursor-pointer">Lihat teks mentah hasil OCR</summary>
                <pre className="text-[10px] text-slate-500 whitespace-pre-wrap mt-2 bg-slate-50 rounded-lg p-2 max-h-32 overflow-y-auto">{result.rawText || '(kosong)'}</pre>
              </details>

              <button disabled={saving} className="w-full py-3 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white text-sm font-semibold active:scale-95 transition disabled:opacity-70">
                {saving ? <span className="spinner mr-2" /> : null}
                Catat sebagai pengeluaran
              </button>
            </form>
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
