'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';
import { api } from '@/lib/api';

interface ManagedUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export default function AdminUsersPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      api<{ success: boolean; data: { users: ManagedUser[] } }>('/users')
        .then((d) => setUsers(d.data.users))
        .catch(() => showToast('Failed to load users', 'error'))
        .finally(() => setLoading(false));
    }
  }, [isAdmin]);

  if (authLoading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>;

  if (!user) return <p className="text-center text-gray-500 mt-12">Please log in.</p>;
  if (!isAdmin) return <p className="text-center text-gray-500 mt-12">Access denied. Admin only.</p>;

  async function changeRole(userId: string, newRole: string) {
    try {
      await api(`/users/${userId}/role`, { method: 'PATCH', body: JSON.stringify({ role: newRole }) });
      showToast('Role updated', 'success');
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole as 'user' | 'admin' } : u)));
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed', 'error');
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-4">
      <h2 className="text-lg font-bold text-slate-800 mb-4">User Management</h2>
      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500 font-medium">
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3 pr-4">Role</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 pr-4 font-medium">{u.name}</td>
                  <td className="py-3 pr-4 text-gray-500">{u.email}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</span>
                  </td>
                  <td className="py-3">
                    {u._id !== user._id && (
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u._id, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
