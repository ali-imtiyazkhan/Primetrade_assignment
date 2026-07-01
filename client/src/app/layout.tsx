'use client';

import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ToastProvider } from '@/components/Toast';
import type { ReactNode } from 'react';

function Nav() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const linkClass = (path: string) =>
    `pb-1 border-b-2 transition ${
      pathname === path
        ? 'border-emerald-400 text-white'
        : 'border-transparent text-slate-300 hover:text-white'
    }`;

  return (
    <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
      <Link href="/" className="text-xl font-bold tracking-tight">
        PrimeTrade <span className="text-emerald-400">API</span>
      </Link>
      <nav className="space-x-6 text-sm">
        <Link href="/" className={linkClass('/')}>Auth</Link>
        <Link href="/products" className={linkClass('/products')}>Products</Link>
        {user && (
          <span className="text-slate-400 text-xs ml-4">
            {user.name} <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${user.role === 'admin' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'}`}>{user.role}</span>
          </span>
        )}
      </nav>
    </header>
  );
}

function LayoutContent({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      <main className="max-w-5xl mx-auto p-6">
        {children}
      </main>
    </>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800 antialiased min-h-screen">
        <AuthProvider>
          <ToastProvider>
            <LayoutContent>{children}</LayoutContent>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
