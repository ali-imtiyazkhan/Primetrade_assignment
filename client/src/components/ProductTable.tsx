'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from './Toast';
import type { Product, ProductsResponse } from '@/types';

interface Props {
  products: Product[];
  onRefresh: () => void;
}

export default function ProductTable({ products, onRefresh }: Props) {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Product>>({});

  function startEdit(p: Product) {
    setEditingId(p._id);
    setEditValues({ name: p.name, price: p.price, category: p.category, stock: p.stock });
  }

  async function saveEdit(id: string) {
    try {
      const body = {
        ...editValues,
        price: parseFloat(editValues.price as unknown as string),
        stock: parseInt(editValues.stock as unknown as string) || 0,
      };
      await api(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) });
      showToast('Product updated!', 'success');
      setEditingId(null);
      onRefresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Update failed', 'error');
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return;
    try {
      await api(`/products/${id}`, { method: 'DELETE' });
      showToast('Product deleted', 'success');
      onRefresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Delete failed', 'error');
    }
  }

  if (products.length === 0) {
    return <p className="text-gray-400 text-center py-8">No products found.</p>;
  }

  const inputClass = 'w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400';

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-500 font-medium">
            <th className="pb-3 pr-4">Name</th>
            <th className="pb-3 pr-4">Price</th>
            <th className="pb-3 pr-4">Category</th>
            <th className="pb-3 pr-4">Stock</th>
            {isAdmin && <th className="pb-3">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
              {editingId === p._id ? (
                <>
                  {(['name', 'price', 'category', 'stock'] as const).map((field) => (
                    <td key={field} className="py-3 pr-4">
                      <input
                        value={editValues[field] ?? ''}
                        onChange={(e) => setEditValues((v) => ({ ...v, [field]: e.target.value }))}
                        className={inputClass}
                        type={field === 'price' || field === 'stock' ? 'number' : 'text'}
                        step={field === 'price' ? '0.01' : undefined}
                      />
                    </td>
                  ))}
                  <td className="py-3 space-x-1">
                    <button onClick={() => saveEdit(p._id)} className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-1 rounded transition cursor-pointer">Save</button>
                    <button onClick={() => setEditingId(null)} className="text-xs bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded transition cursor-pointer">Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="py-3 pr-4 font-medium text-slate-800">{p.name}</td>
                  <td className="py-3 pr-4">${p.price.toFixed(2)}</td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{p.category}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`font-medium ${p.stock === 0 ? 'text-red-500' : 'text-slate-700'}`}>{p.stock}</span>
                  </td>
                  {isAdmin && (
                    <td className="py-3 space-x-1">
                      <button onClick={() => startEdit(p)} className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition cursor-pointer">Edit</button>
                      <button onClick={() => deleteProduct(p._id)} className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition cursor-pointer">Del</button>
                    </td>
                  )}
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
