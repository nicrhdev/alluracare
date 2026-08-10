// src/app/[locale]/shop/components/FilterBar.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, X } from 'lucide-react';

interface Category {
  id: string;
  slug: string;
  nameEn: string;
  nameFa: string;
}

interface FilterBarProps {
  categories: Category[];
  currentCategory: string;
  currentSearch: string;
  locale: string;
  t: {
    allCategories: string;
    searchPlaceholder: string;
  };
}

export default function FilterBar({
  categories,
  currentCategory,
  currentSearch,
  locale,
  t,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [category, setCategory] = useState(currentCategory || '');
  const [search, setSearch] = useState(currentSearch || '');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    // Reset to page 1 when filtering
    params.set('page', '1');

    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(url);
  }, [category, search, pathname, router]);

  const clearFilters = () => {
    setCategory('');
    setSearch('');
    // Clear all search params
    const params = new URLSearchParams(window.location.search);
    params.delete('category');
    params.delete('search');
    params.delete('page');
    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(url);
  };

  const hasFilters = category || search;

  return (
    <div className="bg-white rounded-xl shadow-soft p-4 mb-8 border border-brand-secondary/20">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Category Dropdown */}
        <div className="flex-1 min-w-[180px]">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 border border-brand-secondary/40 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary bg-white text-brand-text appearance-none transition"
          >
            <option value="">{t.allCategories}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {locale === 'fa' ? cat.nameFa : cat.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="flex-1 min-w-[200px] relative">
          <div className={`relative flex items-center transition-all duration-300 ${isSearchFocused ? 'ring-2 ring-brand-primary/20 rounded-lg' : ''}`}>
            <Search className={`absolute left-3 w-4 h-4 transition-colors ${isSearchFocused ? 'text-brand-primary' : 'text-brand-text-secondary'}`} />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full pl-10 pr-4 py-2.5 border border-brand-secondary/40 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary bg-white text-brand-text placeholder-brand-text-secondary transition"
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-brand-text-secondary hover:text-brand-primary transition whitespace-nowrap"
          >
            <X className="w-4 h-4" />
            {locale === 'fa' ? 'پاک کردن' : 'Clear'}
          </button>
        )}
      </div>
    </div>
  );
}