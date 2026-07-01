'use client';

import { useAuth } from '@/context/AuthContext';
import AuthForms from '@/components/AuthForms';

export default function AuthPage() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-md mx-auto mt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
            <span className="text-emerald-600 font-bold text-lg">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="space-y-3 text-sm bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Role</span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{user.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">User ID</span>
            <span className="text-xs font-mono text-gray-400">{user._id}</span>
          </div>
        </div>
        <button onClick={logout} className="mt-5 w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition cursor-pointer">
          Logout
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Welcome to PrimeTrade</h2>
        <p className="text-gray-500 mt-1">Register or login to manage products</p>
      </div>
      <AuthForms />
    </div>
  );
}
