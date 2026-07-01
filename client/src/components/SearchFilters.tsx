'use client';

import { useState } from 'react';

interface Filters {
  search: string;
  category: string;
  sort: string;
}

interface Props {
  categories: string[];
  onFilter: (filters: Filters) => void;
}

export default function SearchFilters({ categories, onFilter }: Props) {
  const [filters, setFilters] = useState<Filters>({ search: '', category: '', sort: '-createdAt' });

  function update(key: keyof Filters, value: string) {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilter(next);
  }

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <input
        type="text"
        placeholder="Search products..."
        value={filters.search}
        onChange={(e) => update('search', e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 w-48"
      />
      <select value={filters.category} onChange={(e) => update('category', e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
        <option value="">All Categories</option>
        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <select value={filters.sort} onChange={(e) => update('sort', e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
        <option value="-createdAt">Newest</option>
        <option value="createdAt">Oldest</option>
        <option value="-price">Price: High to Low</option>
        <option value="price">Price: Low to High</option>
        <option value="name">Name: A-Z</option>
        <option value="-name">Name: Z-A</option>
      </select>
    </div>
  );
}
