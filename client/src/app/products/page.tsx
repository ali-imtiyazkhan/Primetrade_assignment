'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';
import { api } from '@/lib/api';
import CreateProductForm from '@/components/CreateProductForm';
import ProductTable from '@/components/ProductTable';
import type { Product, ProductsResponse } from '@/types';

export default function ProductsPage() {
  const { token, isAdmin, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    try {
      const data = await api<ProductsResponse>('/products?limit=50');
      setProducts(data.data.products);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (token) {
      setLoading(true);
      loadProducts();
    }
  }, [token, loadProducts]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center mt-8">
        <p className="text-gray-500 mb-4">Please log in to access products.</p>
        <a href="/" className="text-emerald-500 hover:text-emerald-600 font-medium">Go to Login</a>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-4">
      {isAdmin && <CreateProductForm onCreated={loadProducts} />}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Products</h2>
          <button onClick={loadProducts} className="text-xs text-gray-400 hover:text-gray-600 transition cursor-pointer">
            Refresh
          </button>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <ProductTable products={products} onRefresh={loadProducts} />
        )}
      </div>
    </div>
  );
}
