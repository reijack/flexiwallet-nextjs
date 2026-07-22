'use client';

import { usePathname } from 'next/navigation';
import BottomNav from '@/components/BottomNav';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <div className="bg-blob bg-primary" style={{ top: -80, right: -80, width: 280, height: 280 }} />
      <div className="bg-blob bg-primary-dark" style={{ bottom: 60, left: -100, width: 220, height: 220 }} />

      {/*
        PENTING: wrapper ini SENGAJA tidak diberi `transform` sama sekali.
        Elemen anak dengan `position: fixed` (tombol FAB, overlay modal)
        akan "rusak" posisinya dan jadi relatif ke wrapper ini alih-alih
        ke layar, kalau wrapper punya transform (termasuk translate-y-0).
        Makanya animasi transisi di sini murni pakai opacity + key remount,
        tanpa translate/scale.
      */}
      <div key={pathname} className="relative z-10 animate-[pageFade_.28s_ease-out]">
        {children}
      </div>

      <BottomNav />
    </>
  );
}
