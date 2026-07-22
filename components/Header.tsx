'use client';

import { BellIcon } from './Icons';
import { useToast } from './Toast';

export default function Header() {
  const { showToast } = useToast();

  return (
    <header className="sticky top-0 z-30 rounded-b-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-lg border-b border-slate-100 dark:border-slate-800 shadow-[0_2px_16px_rgba(37,99,235,0.06)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.3)] px-4 py-3 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center gap-2.5">
        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-fuchsia-500 blur-md opacity-40 dark:opacity-60" />
          <img src="/logo-icon.png" alt="FlexiWallet" className="relative w-9 h-9 rounded-xl object-cover ring-1 ring-white/40 dark:ring-white/10" />
        </div>
        <span className="font-display font-extrabold text-[18px] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-600 to-fuchsia-500 dark:from-cyan-300 dark:via-blue-400 dark:to-fuchsia-400">
          FlexiWallet
        </span>
      </div>

      <button
        onClick={() => showToast('Belum ada notifikasi baru', 'info')}
        className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 active:scale-90"
        aria-label="Notifikasi"
      >
        <BellIcon size={19} />
      </button>
    </header>
  );
}
