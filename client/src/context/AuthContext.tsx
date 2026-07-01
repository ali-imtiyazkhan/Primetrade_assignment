'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { api, setToken, getToken } from '@/lib/api';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const updateToken = useCallback((t: string | null) => {
    setToken(t);
    setTokenState(t);
  }, []);

  const login = useCallback((t: string, u: User) => {
    updateToken(t);
    setUser(u);
  }, [updateToken]);

  const logout = useCallback(() => {
    updateToken(null);
    setUser(null);
    api('/auth/logout', { method: 'POST' }).catch(() => {});
  }, [updateToken]);

  const refresh = useCallback(async () => {
    const t = getToken();
    if (!t) {
      setLoading(false);
      return;
    }
    try {
      const data = await api<{ success: boolean; data: { user: User } }>('/auth/me');
      setUser(data.data.user);
      setTokenState(t);
    } catch {
      updateToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [updateToken]);

  useEffect(() => { refresh(); }, [refresh]);

  const value: AuthContextType = {
    user,
    token,
    loading,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
