// src/app/[locale]/shop/components/ProductSort.tsx

'use client';

import { ChevronDown } from 'lucide-react';

interface ProductSortProps {
  sortBy: string;
  onSortChange: (value: string) => void;
  locale: string;
}

const sortOptions = {
  en: [
    { value: 'newest', label: 'Newest' },
    { value: 'bestselling', label: 'Best Selling' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
  ],
  fa: [
    { value: 'newest', label: 'جدیدترین' },
    { value: 'bestselling', label: 'پرفروش‌ترین' },
    { value: 'price-asc', label: 'قیمت: کم به زیاد' },
    { value: 'price-desc', label: 'قیمت: زیاد به کم' },
    { value: 'rating', label: 'بالاترین امتیاز' },
  ],
};

export default function ProductSort({
  sortBy,
  onSortChange,
  locale,
}: ProductSortProps) {
  const isPersian = locale === 'fa';
  const options = isPersian ? sortOptions.fa : sortOptions.en;

  return (
    <div className="relative">
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="appearance-none bg-white border border-brand-secondary/30 rounded-lg px-4 py-2.5 pr-10 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent cursor-pointer"
        style={{
          direction: isPersian ? 'rtl' : 'ltr',
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary pointer-events-none ${
          isPersian ? 'left-3' : 'right-3'
        }`}
      />
    </div>
  );
}