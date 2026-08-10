// src/app/[locale]/shop/components/FilterSidebar.tsx

'use client';

import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import PriceRangeSlider from './PriceRangeSlider';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterSidebarProps {
  filters: {
    categories: FilterOption[];
    concerns: FilterOption[];
    skinTypes: FilterOption[];
    brands: FilterOption[];
    priceRange: { min: number; max: number };
  };
  selectedFilters: {
    categories: string[];
    concerns: string[];
    skinTypes: string[];
    brands: string[];
    priceRange: { min: number; max: number };
    inStock: boolean;
  };
  onFilterChange: (key: string, value: any) => void;
  onApplyFilters: () => void;
  onClearAll: () => void;
  locale: string;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function FilterSidebar({
  filters,
  selectedFilters,
  onFilterChange,
  onApplyFilters,
  onClearAll,
  locale,
  isMobile = false,
  onClose,
}: FilterSidebarProps) {
  const isPersian = locale === 'fa';
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'categories',
    'concerns',
    'skinTypes',
    'brands',
    'priceRange',
  ]);

  // Track temporary price range for the slider
  const [tempPriceRange, setTempPriceRange] = useState({
    min: selectedFilters.priceRange.min || filters.priceRange.min,
    max: selectedFilters.priceRange.max || filters.priceRange.max,
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const filterSections: { id: string; title: string; options: FilterOption[]; type: 'checkbox' | 'radio' }[] = [
    {
      id: 'categories',
      title: isPersian ? 'دسته‌بندی' : 'Category',
      options: filters.categories,
      type: 'checkbox',
    },
    {
      id: 'concerns',
      title: isPersian ? 'مشکلات پوستی' : 'Skin Concerns',
      options: filters.concerns,
      type: 'checkbox',
    },
    {
      id: 'skinTypes',
      title: isPersian ? 'نوع پوست' : 'Skin Type',
      options: filters.skinTypes,
      type: 'checkbox',
    },
    {
      id: 'brands',
      title: isPersian ? 'برند' : 'Brand',
      options: filters.brands,
      type: 'checkbox',
    },
  ];

  const handleCheckboxChange = (sectionId: string, optionId: string) => {
    const current = selectedFilters[sectionId as keyof typeof selectedFilters] as string[];
    const updated = current.includes(optionId)
      ? current.filter((id: string) => id !== optionId)
      : [...current, optionId];
    onFilterChange(sectionId, updated);
  };

  const handlePriceChange = (min: number, max: number) => {
    setTempPriceRange({ min, max });
  };

  const handleApplyPrice = () => {
    onFilterChange('priceRange', tempPriceRange);
  };

  const activeFilterCount = () => {
    let count = 0;
    count += selectedFilters.categories.length;
    count += selectedFilters.concerns.length;
    count += selectedFilters.skinTypes.length;
    count += selectedFilters.brands.length;
    if (selectedFilters.inStock) count++;
    if (selectedFilters.priceRange.min > filters.priceRange.min) count++;
    if (selectedFilters.priceRange.max < filters.priceRange.max) count++;
    return count;
  };

  // Handle apply filters with price
  const handleApply = () => {
    handleApplyPrice();
    onApplyFilters();
  };

  // Handle clear all
  const handleClear = () => {
    onClearAll();
  };

  return (
    <div className={`${isMobile ? 'p-4' : 'sticky top-20'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-brand-text">
          {isPersian ? 'فیلترها' : 'Filters'}
        </h3>
        <div className="flex items-center gap-3">
          {activeFilterCount() > 0 && (
            <button
              onClick={handleClear}
              className="text-sm text-brand-primary hover:text-brand-hover transition font-medium"
            >
              {isPersian ? 'حذف همه' : 'Clear All'}
            </button>
          )}
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-1 text-brand-text-secondary hover:text-brand-primary transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {activeFilterCount() > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedFilters.categories.map((id) => {
            const option = filters.categories.find((c) => c.id === id);
            return option ? (
              <span
                key={id}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-brand-purple-light/50 text-brand-primary rounded-full border border-brand-purple-light/50"
              >
                {option.label}
                <button
                  onClick={() => handleCheckboxChange('categories', id)}
                  className="hover:text-brand-hover ml-1"
                >
                  ×
                </button>
              </span>
            ) : null;
          })}
        </div>
      )}

      {/* Filter Sections */}
      <div className="space-y-4">
        {filterSections.map((section) => {
          // Check if this section has any options
          if (!section.options || section.options.length === 0) {
            return null;
          }

          return (
            <div
              key={section.id}
              className="border-b border-brand-secondary/10 pb-4"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="flex items-center justify-between w-full text-left group"
              >
                <span className="text-sm font-medium text-brand-text group-hover:text-brand-primary transition">
                  {section.title}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-brand-text-secondary transition-transform duration-300 ${
                    expandedSections.includes(section.id) ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {expandedSections.includes(section.id) && (
                <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
                  {section.options.map((option) => {
                    const isChecked = (
                      selectedFilters[section.id as keyof typeof selectedFilters] as string[]
                    ).includes(option.id);

                    return (
                      <label
                        key={option.id}
                        className="flex items-center gap-2 cursor-pointer group hover:bg-brand-purple-light/10 px-2 py-1 rounded-lg transition"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            handleCheckboxChange(section.id, option.id)
                          }
                          className="w-4 h-4 rounded border-brand-secondary/30 text-brand-primary focus:ring-brand-primary focus:ring-offset-0 cursor-pointer"
                        />
                        <span className="text-sm text-brand-text-secondary group-hover:text-brand-text transition">
                          {option.label}
                        </span>
                        {option.count !== undefined && option.count > 0 && (
                          <span className="text-xs text-brand-text-secondary/50 ml-auto">
                            ({option.count})
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Price Range */}
        <div className="border-b border-brand-secondary/10 pb-4">
          <button
            onClick={() => toggleSection('priceRange')}
            className="flex items-center justify-between w-full text-left group"
          >
            <span className="text-sm font-medium text-brand-text group-hover:text-brand-primary transition">
              {isPersian ? 'محدوده قیمت' : 'Price Range'}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-brand-text-secondary transition-transform duration-300 ${
                expandedSections.includes('priceRange') ? 'rotate-180' : ''
              }`}
            />
          </button>

          {expandedSections.includes('priceRange') && (
            <div className="mt-3">
              <PriceRangeSlider
                min={filters.priceRange.min}
                max={filters.priceRange.max}
                currentMin={tempPriceRange.min}
                currentMax={tempPriceRange.max}
                onChange={handlePriceChange}
                locale={locale}
              />
            </div>
          )}
        </div>

        {/* In Stock */}
        <div className="pb-4">
          <label className="flex items-center gap-2 cursor-pointer group hover:bg-brand-purple-light/10 px-2 py-1 rounded-lg transition">
            <input
              type="checkbox"
              checked={selectedFilters.inStock}
              onChange={() =>
                onFilterChange('inStock', !selectedFilters.inStock)
              }
              className="w-4 h-4 rounded border-brand-secondary/30 text-brand-primary focus:ring-brand-primary focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-sm text-brand-text-secondary group-hover:text-brand-text transition">
              {isPersian ? 'فقط موجود در انبار' : 'In Stock Only'}
            </span>
          </label>
        </div>
      </div>

      {/* Apply Filters Button */}
      <div className="mt-6 pt-4 border-t border-brand-secondary/10">
        <button
          onClick={handleApply}
          className="w-full btn-primary py-2.5 text-base"
        >
          {isPersian ? 'اعمال فیلترها' : 'Apply Filters'}
        </button>
        <p className="text-xs text-brand-text-secondary text-center mt-2">
          {activeFilterCount()} {isPersian ? 'فیلتر فعال' : 'filters active'}
        </p>
      </div>
    </div>
  );
}