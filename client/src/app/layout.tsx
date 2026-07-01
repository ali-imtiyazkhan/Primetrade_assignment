'use client';

import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ToastProvider } from '@/components/Toast';
import DarkModeToggle from '@/components/DarkModeToggle';
import type { ReactNode } from 'react';

function Nav() {
  const pathname = usePathname();
  const { user } = useAuth();

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
      <div className="flex items-center gap-6">
        <nav className="space-x-6 text-sm">
          <Link href="/" className={linkClass('/')}>Auth</Link>
          <Link href="/products" className={linkClass('/products')}>Products</Link>
          {user?.role === 'admin' && (
            <Link href="/admin/users" className={linkClass('/admin/users')}>Users</Link>
          )}
        </nav>
        {user && (
          <span className="text-slate-400 text-xs">
            {user.name} <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${user.role === 'admin' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'}`}>{user.role}</span>
          </span>
        )}
        <DarkModeToggle />
      </div>
    </header>
  );
}

function LayoutContent({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      <main className="max-w-5xl mx-auto p-6 dark:text-gray-200">
        {children}
      </main>
    </>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 text-gray-800 antialiased min-h-screen dark:bg-slate-900 dark:text-gray-100 transition-colors duration-200">
        <AuthProvider>
          <ToastProvider>
            <LayoutContent>{children}</LayoutContent>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
