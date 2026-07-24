'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, ScanIcon, HistoryIcon, UserIcon } from './Icons';
import { useRipple } from '@/lib/useRipple';

const navItems = [
  { href: '/', label: 'Home', Icon: HomeIcon },
  { href: '/scan', label: 'Scan', Icon: ScanIcon },
  { href: '/history', label: 'Riwayat', Icon: HistoryIcon },
  { href: '/profile', label: 'Profil', Icon: UserIcon },
];

function NavLink({ href, label, Icon, active }: { href: string; label: string; Icon: typeof HomeIcon; active: boolean }) {
  const { ref, onPointerDown } = useRipple<HTMLAnchorElement>();

  return (
    <Link
      ref={ref}
      href={href}
      onMouseDown={onPointerDown}
      className={`relative overflow-hidden flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10.5px] font-medium transition-transform duration-150 active:scale-90 ${
        active ? 'text-primary dark:text-blue-400 font-semibold' : 'text-slate-400 dark:text-slate-500'
      }`}
    >
      <span className="relative flex items-center justify-center w-11 h-7">
        {/* Pill indicator: selalu ada di DOM (nggak conditional-mount) supaya transisi
            muncul/hilangnya halus dua arah, bukan cuma pas muncul doang */}
        <span
          className={`absolute inset-0 rounded-full bg-primary-light dark:bg-blue-500/25 transition-all duration-300 ${
            active ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
          style={{ transitionTimingFunction: 'cubic-bezier(.34,1.56,.64,1)' }}
        />
        <Icon size={20} strokeWidth={active ? 2.3 : 2} className="relative transition-transform duration-300" style={{ transitionTimingFunction: 'cubic-bezier(.34,1.56,.64,1)' }} />
      </span>
      <span className="transition-transform duration-300" style={{ transform: active ? 'translateY(-1px)' : 'none' }}>
        {label}
      </span>
    </Link>
  );
}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl rounded-t-2xl border-t border-slate-100 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.4)] flex justify-around py-2 pb-[env(safe-area-inset-bottom,10px)] z-50 transition-colors duration-300">
      {navItems.map((item) => (
        <NavLink key={item.href} {...item} active={pathname === item.href} />
      ))}
    </nav>
  );
}
