// src/app/[locale]/shop/components/FilterSheet.tsx

'use client';

import { X } from 'lucide-react';
import FilterSidebar from './FilterSidebar';

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: any;
  selectedFilters: any;
  onFilterChange: (key: string, value: any) => void;
  onApplyFilters: () => void;
  onClearAll: () => void;
  locale: string;
}

export default function FilterSheet({
  isOpen,
  onClose,
  filters,
  selectedFilters,
  onFilterChange,
  onApplyFilters,
  onClearAll,
  locale,
}: FilterSheetProps) {
  const isPersian = locale === 'fa';

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`fixed top-0 ${isPersian ? 'left-0' : 'right-0'} h-full w-[320px] max-w-full bg-white z-50 shadow-modal transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : isPersian ? '-translate-x-full' : 'translate-x-full'
        }`}
      >
        <div className="p-4 pb-0 border-b border-brand-secondary/10 flex items-center justify-between">
          <h3 className="font-semibold text-brand-text">
            {isPersian ? 'فیلترها' : 'Filters'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-brand-text-secondary hover:text-brand-primary transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-80px)]">
          <FilterSidebar
            filters={filters}
            selectedFilters={selectedFilters}
            onFilterChange={onFilterChange}
            onApplyFilters={onApplyFilters}
            onClearAll={onClearAll}
            locale={locale}
            isMobile
            onClose={onClose}
          />
        </div>

        <div className="p-4 border-t border-brand-secondary/10">
          <button
            onClick={() => {
              onApplyFilters();
              onClose();
            }}
            className="w-full btn-primary py-2.5 text-base"
          >
            {isPersian ? 'اعمال فیلترها' : 'Apply Filters'}
          </button>
        </div>
      </div>
    </>
  );
}