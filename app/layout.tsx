import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { ToastProvider } from '@/components/Toast';

export const metadata: Metadata = {
  title: 'FlexiWallet — Catat Pengeluaran Kamu',
  description: 'Aplikasi pencatat pengeluaran pribadi dengan scan struk OCR',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-primary-bg min-h-dvh text-slate-800">
        <AuthProvider>
          <ToastProvider>
            <div className="relative max-w-[480px] mx-auto min-h-dvh md:shadow-[0_0_40px_rgba(0,0,0,0.06)]">
              {children}
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
