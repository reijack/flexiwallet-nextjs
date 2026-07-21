'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { useRipple } from '@/lib/useRipple';

type Variant = 'filled' | 'outlined' | 'tonal' | 'text' | 'danger-outlined';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
  children: ReactNode;
};

const variantClass: Record<Variant, string> = {
  filled: 'bg-gradient-to-br from-primary to-primary-dark text-white shadow-[0_4px_14px_rgba(37,99,235,0.3)] dark:shadow-[0_4px_14px_rgba(59,130,246,0.4)]',
  outlined: 'bg-transparent border-2 border-primary dark:border-blue-400 text-primary dark:text-blue-400',
  tonal: 'bg-primary-light dark:bg-blue-500/15 text-primary dark:text-blue-300',
  text: 'bg-transparent text-primary dark:text-blue-400',
  'danger-outlined': 'bg-white dark:bg-slate-800 border-2 border-red-100 dark:border-red-900/50 text-red-500 dark:text-red-400',
};

export default function Button({
  variant = 'filled',
  loading = false,
  icon,
  fullWidth = false,
  disabled,
  className = '',
  children,
  onMouseDown,
  ...rest
}: ButtonProps) {
  const { ref, onPointerDown } = useRipple<HTMLButtonElement>();

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      onMouseDown={(e) => {
        onPointerDown(e);
        onMouseDown?.(e);
      }}
      className={`relative overflow-hidden inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-[14px] font-semibold whitespace-nowrap transition-transform duration-150 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none ${
        fullWidth ? 'w-full' : ''
      } ${variantClass[variant]} ${className}`}
      {...rest}
    >
      {loading ? <span className="spinner" /> : icon}
      {children}
    </button>
  );
}
