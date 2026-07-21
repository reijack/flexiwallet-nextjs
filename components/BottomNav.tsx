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
      className={`relative overflow-hidden flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-[10.5px] font-medium transition-transform duration-150 active:scale-90 ${
        active ? 'text-primary dark:text-blue-400 font-semibold' : 'text-slate-400 dark:text-slate-500'
      }`}
    >
      <span
        className={`relative w-6 h-6 flex items-center justify-center transition-transform duration-300 ${active ? '-translate-y-0.5' : ''}`}
        style={{ transitionTimingFunction: 'cubic-bezier(.34,1.56,.64,1)' }}
      >
        {active && <span className="absolute -inset-1.5 rounded-xl bg-primary-light dark:bg-blue-500/20 -z-10 transition-colors duration-300" />}
        <Icon size={20} strokeWidth={active ? 2.3 : 2} />
      </span>
      <span>{label}</span>
    </Link>
  );
}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white/92 dark:bg-slate-900/92 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800 flex justify-around py-2 pb-[env(safe-area-inset-bottom,10px)] z-50 transition-colors duration-300">
      {navItems.map((item) => (
        <NavLink key={item.href} {...item} active={pathname === item.href} />
      ))}
    </nav>
  );
}
