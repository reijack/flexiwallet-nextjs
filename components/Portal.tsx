'use client';

import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Portal ini me-render children langsung ke document.body, bukan di posisi
 * asalnya di komponen. Ini WAJIB dipakai untuk overlay/modal supaya z-index
 * tidak "terjebak" di dalam stacking context milik parent (mis. wrapper
 * transisi halaman) — masalah klasik: elemen fixed dengan z-index tinggi
 * tetap bisa "kalah" dari elemen lain kalau parent-nya sendiri sudah
 * membuat stacking context baru dengan z-index lebih rendah.
 */
export default function Portal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;
  return createPortal(children, document.body);
}
