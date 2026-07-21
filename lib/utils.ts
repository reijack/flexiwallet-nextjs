export const categories: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  makan: { label: 'Makan & Minum', icon: '🍜', color: '#F59E0B', bg: '#FEF3C7' },
  transport: { label: 'Transportasi', icon: '🚗', color: '#3B82F6', bg: '#DBEAFE' },
  jajan: { label: 'Jajan & Snack', icon: '🍪', color: '#EC4899', bg: '#FCE7F3' },
  hiburan: { label: 'Hiburan', icon: '🎬', color: '#8B5CF6', bg: '#EDE9FE' },
  tagihan: { label: 'Tagihan', icon: '⚡', color: '#EF4444', bg: '#FEE2E2' },
  belanja: { label: 'Belanja', icon: '🛍️', color: '#10B981', bg: '#D1FAE5' },
  lainnya: { label: 'Lainnya', icon: '📦', color: '#6B7280', bg: '#F3F4F6' },
};

export function formatRupiah(n: number): string {
  return 'Rp ' + Math.abs(Math.round(n)).toLocaleString('id-ID');
}

export function guessCategory(text: string): string {
  const t = text.toLowerCase();
  if (/(nasi|ayam|soto|bakso|mie|makan|resto|warung|kopi|cafe|kafe|sate|kfc|mcd|burger|pizza)/.test(t)) return 'makan';
  if (/(grab|gojek|taxi|bensin|parkir|tol|mrt|krl|transjakarta|shell|pertamina)/.test(t)) return 'transport';
  if (/(snack|jajan|chips|cokelat|permen|boba|bubble tea|indomaret|alfamart)/.test(t)) return 'jajan';
  if (/(bioskop|cinema|netflix|spotify|game|konser)/.test(t)) return 'hiburan';
  if (/(listrik|pdam|internet|wifi|pulsa|token|bpjs|asuransi)/.test(t)) return 'tagihan';
  if (/(shopee|tokopedia|mall|store|toko|baju|elektronik)/.test(t)) return 'belanja';
  return 'lainnya';
}
