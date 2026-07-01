'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from './Toast';
import type { AuthResponse } from '@/types';

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
}

function validate(mode: 'register' | 'login', fd: FormData): FieldErrors {
  const errors: FieldErrors = {};
  const email = fd.get('email') as string;
  const password = fd.get('password') as string;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Valid email is required';
  }
  if (!password || password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  if (mode === 'register') {
    const name = fd.get('name') as string;
    if (!name || name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    if (password && !/[A-Za-z]/.test(password)) {
      errors.password = 'Password must contain at least one letter';
    } else if (password && !/[0-9]/.test(password)) {
      errors.password = 'Password must contain at least one number';
    }
  }
  return errors;
}

export default function AuthForms() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState<'register' | 'login' | null>(null);
  const [errors, setErrors] = useState<{ register: FieldErrors; login: FieldErrors }>({ register: {}, login: {} });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>, mode: 'register' | 'login') {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const fieldErrors = validate(mode, fd);
    setErrors((prev) => ({ ...prev, [mode]: fieldErrors }));
    if (Object.keys(fieldErrors).length > 0) return;

    setLoading(mode);
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

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition dark:bg-slate-800 dark:border-slate-600 dark:text-gray-100';
  const errorClass = 'text-xs text-red-500 mt-0.5';
  const btnClass = (isLoading: boolean) =>
    `w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition cursor-pointer ${isLoading ? 'animate-pulse' : ''}`;

  function renderField(mode: 'register' | 'login', field: keyof FieldErrors, node: React.ReactNode) {
    return (
      <div>
        {node}
        {errors[mode][field] && <p className={errorClass}>{errors[mode][field]}</p>}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-8">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-gray-100 mb-4">Register</h2>
        <form onSubmit={(e) => handleSubmit(e, 'register')} className="space-y-3">
          {renderField('register', 'name', <input name="name" placeholder="Name" required className={inputClass} />)}
          {renderField('register', 'email', <input name="email" type="email" placeholder="Email" required className={inputClass} />)}
          {renderField('register', 'password', <input name="password" type="password" placeholder="Password (min 6 chars)" required className={inputClass} />)}
          <select name="role" className={inputClass}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button disabled={loading === 'register'} className={btnClass(loading === 'register')}>
            {loading === 'register' ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-gray-100 mb-4">Login</h2>
        <form onSubmit={(e) => handleSubmit(e, 'login')} className="space-y-3">
          {renderField('login', 'email', <input name="email" type="email" placeholder="Email" required className={inputClass} />)}
          {renderField('login', 'password', <input name="password" type="password" placeholder="Password" required className={inputClass} />)}
          <button disabled={loading === 'login'} className={btnClass(loading === 'login')}>
            {loading === 'login' ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
