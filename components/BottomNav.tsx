'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home', icon: (a: boolean) => (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a ? 2.3 : 2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    </svg>
  )},
  { href: '/scan', label: 'Scan', icon: (a: boolean) => (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a ? 2.3 : 2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><rect x="7" y="7" width="10" height="10" rx="1.5" />
    </svg>
  )},
  { href: '/history', label: 'Riwayat', icon: (a: boolean) => (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a ? 2.3 : 2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /><path d="M12 7v5l3.5 2" />
    </svg>
  )},
  { href: '/profile', label: 'Profil', icon: (a: boolean) => (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a ? 2.3 : 2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" />
    </svg>
  )},
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white/92 backdrop-blur-lg border-t border-slate-100 flex justify-around py-2 pb-[env(safe-area-inset-bottom,10px)] z-50">
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-4 py-1.5 text-[10.5px] font-medium transition-all duration-300 active:scale-90 ${
              active ? 'text-primary font-semibold' : 'text-slate-400'
            }`}
          >
            <span
              className={`relative w-6 h-6 flex items-center justify-center transition-transform duration-300 ${
                active ? '-translate-y-0.5' : ''
              }`}
            >
              {active && <span className="absolute -inset-1.5 rounded-xl bg-primary-light -z-10" />}
              {item.icon(active)}
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
