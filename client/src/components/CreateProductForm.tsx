'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useToast } from './Toast';

interface Props {
  onCreated: () => void;
}

export default function CreateProductForm({ onCreated }: Props) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get('name'),
      price: parseFloat(fd.get('price') as string),
      description: (fd.get('description') as string) || '',
      category: (fd.get('category') as string) || 'General',
      stock: parseInt(fd.get('stock') as string) || 0,
    };
    try {
      await api('/products', { method: 'POST', body: JSON.stringify(body) });
      showToast('Product created!', 'success');
      (e.target as HTMLFormElement).reset();
      onCreated();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to create', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Create Product <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Admin</span></h2>
      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <input name="name" placeholder="Product Name" required className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
        <input name="price" type="number" step="0.01" placeholder="Price" required className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
        <input name="description" placeholder="Description" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
        <input name="category" placeholder="Category" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
        <input name="stock" type="number" placeholder="Stock" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
        <button disabled={loading} className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition cursor-pointer">
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}
