'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from './Toast';
import type { AuthResponse } from '@/types';

export default function AuthForms() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState<'register' | 'login' | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>, mode: 'register' | 'login') {
    e.preventDefault();
    setLoading(mode);
    const fd = new FormData(e.currentTarget);
    try {
      const data = await api<AuthResponse>(`/auth/${mode}`, {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(fd)),
      });
      login(data.data.accessToken, data.data.user);
      showToast(mode === 'register' ? 'Registered successfully!' : 'Logged in!', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Request failed', 'error');
    } finally {
      setLoading(null);
    }
  }

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition';
  const btnClass = (isLoading: boolean) =>
    `w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition cursor-pointer ${isLoading ? 'animate-pulse' : ''}`;

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Register</h2>
        <form onSubmit={(e) => handleSubmit(e, 'register')} className="space-y-3">
          <input name="name" placeholder="Name" required className={inputClass} />
          <input name="email" type="email" placeholder="Email" required className={inputClass} />
          <input name="password" type="password" placeholder="Password (min 6 chars)" required className={inputClass} />
          <select name="role" className={inputClass}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button disabled={loading === 'register'} className={btnClass(loading === 'register')}>
            {loading === 'register' ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Login</h2>
        <form onSubmit={(e) => handleSubmit(e, 'login')} className="space-y-3">
          <input name="email" type="email" placeholder="Email" required className={inputClass} />
          <input name="password" type="password" placeholder="Password" required className={inputClass} />
          <button disabled={loading === 'login'} className={btnClass(loading === 'login')}>
            {loading === 'login' ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
