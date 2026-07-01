'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';
import { api } from '@/lib/api';
import CreateProductForm from '@/components/CreateProductForm';
import ProductTable from '@/components/ProductTable';
import SearchFilters from '@/components/SearchFilters';
import Pagination from '@/components/Pagination';
import type { Product, ProductsResponse } from '@/types';

export default function ProductsPage() {
  const { token, isAdmin, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState({ search: '', category: '', sort: '-createdAt' });

  const loadProducts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', '10');
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    if (filters.sort) params.set('sort', filters.sort);

    try {
      const data = await api<ProductsResponse>(`/products?${params}`);
      setProducts(data.data.products);
      setPages(data.data.pagination.pages);
      const cats = [...new Set(data.data.products.map((p) => p.category).filter(Boolean))] as string[];
      setCategories((prev) => (prev.length === 0 ? cats : prev));
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  }, [token, page, filters, showToast]);

  useEffect(() => { loadProducts(); }, [loadProducts]);
  useEffect(() => { setPage(1); }, [filters.search, filters.category, filters.sort]);

  function handleFilter(newFilters: typeof filters) {
    setFilters(newFilters);
  }

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8 text-center mt-8">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Please log in to access products.</p>
        <a href="/" className="text-emerald-500 hover:text-emerald-600 font-medium">Go to Login</a>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-4">
      {isAdmin && <CreateProductForm onCreated={() => { setPage(1); loadProducts(); }} />}

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-gray-100">Products</h2>
          <button onClick={loadProducts} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition cursor-pointer">Refresh</button>
        </div>

        <SearchFilters categories={categories} onFilter={handleFilter} />

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-gray-100 dark:bg-slate-700 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <ProductTable products={products} onRefresh={loadProducts} />
            <Pagination page={page} pages={pages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
