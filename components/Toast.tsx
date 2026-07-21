'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type Toast = { id: number; message: string; type: 'success' | 'error' | 'info' };
type ToastContextType = { showToast: (message: string, type?: Toast['type']) => void };

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  const colors: Record<Toast['type'], string> = {
    success: 'bg-green-600',
    error: 'bg-red-500',
    info: 'bg-primary dark:bg-blue-600',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 w-[calc(100%-32px)] max-w-[440px]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${colors[t.type]} text-white text-[13px] font-medium px-4 py-3.5 rounded-2xl md-elevated`}
            style={{ animation: 'toastIn .45s cubic-bezier(.22,1,.36,1)' }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
