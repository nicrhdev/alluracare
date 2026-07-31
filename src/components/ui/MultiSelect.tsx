// src/components/ui/MultiSelect.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';

interface Option {
  id: string;
  nameEn: string;
  nameFa: string;
  slug: string;
}

interface MultiSelectProps {
  options?: Option[]; // Make it optional
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  placeholder: string;
  searchPlaceholder?: string;
  maxSelection?: number;
  locale: string;
}

export default function MultiSelect({
  options = [], // Default to empty array
  selectedIds = [],
  onChange,
  placeholder,
  searchPlaceholder = 'Search...',
  maxSelection = 10,
  locale,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const isPersian = locale === 'fa';

  // Safety check: if options is not an array, use empty array
  const safeOptions = Array.isArray(options) ? options : [];

  const filteredOptions = safeOptions.filter((option) => {
    if (!option) return false;
    const name = isPersian ? option.nameFa : option.nameEn;
    return name?.toLowerCase().includes(search?.toLowerCase() || '');
  });

  const toggleOption = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else if (selectedIds.length < maxSelection) {
      onChange([...selectedIds, id]);
    }
  };

  const removeOption = (id: string) => {
    onChange(selectedIds.filter((selectedId) => selectedId !== id));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getOptionName = (option: Option) => {
    if (!option) return '';
    return isPersian ? option.nameFa : option.nameEn;
  };

  const selectedOptions = safeOptions.filter((opt) => selectedIds.includes(opt.id));

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Selected tags */}
      <div
        className="flex flex-wrap items-center gap-1.5 min-h-[44px] w-full px-3 py-2 border border-slate-200 rounded-lg cursor-text focus-within:ring-2 focus-within:ring-slate-400 bg-white"
        onClick={() => setIsOpen(true)}
      >
        {selectedOptions.map((option) => (
          <span
            key={option.id}
            className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-slate-100 rounded-md"
          >
            {getOptionName(option)}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeOption(option.id);
              }}
              className="hover:text-red-500"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          className="flex-1 min-w-[100px] bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400"
          placeholder={selectedOptions.length === 0 ? placeholder : ''}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="px-4 py-3 text-sm text-slate-500">No options found</div>
          ) : (
            <div className="py-1">
              {filteredOptions.map((option) => {
                const isSelected = selectedIds.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left hover:bg-slate-50 transition ${
                      isSelected ? 'bg-slate-50' : ''
                    }`}
                    onClick={() => toggleOption(option.id)}
                  >
                    <span className="text-slate-700">{getOptionName(option)}</span>
                    {isSelected && <Check className="w-4 h-4 text-slate-800" />}
                  </button>
                );
              })}
            </div>
          )}
          {selectedIds.length >= maxSelection && (
            <div className="px-4 py-2 text-xs text-amber-600 bg-amber-50 border-t border-slate-200">
              Maximum {maxSelection} selections allowed
            </div>
          )}
        </div>
      )}
    </div>
  );
}