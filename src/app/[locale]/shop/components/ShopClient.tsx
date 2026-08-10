// src/app/[locale]/shop/components/ShopClient.tsx

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Filter, Grid, List, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import ProductSort from './ProductSort';
import FilterSidebar from './FilterSidebar';
import FilterSheet from './FilterSheet';
import FilterBar from './FilterBar';

interface Product {
  id: string;
  nameEn: string;
  nameFa: string;
  slug: string;
  images: string[];
  brand: string | null;
  variants: {
    id: string;
    price: number;
    comparePrice: number | null;
    stock: number;
    size: string;
  }[];
  category: {
    nameEn: string;
    nameFa: string;
  };
  skinTypes: { skinTypeId: string }[];
  concerns: { concernId: string }[];
}

interface ShopClientProps {
  initialProducts: Product[];
  totalCount: number;
  filters: {
    categories: { id: string; label: string; count: number }[];
    concerns: { id: string; label: string; count: number }[];
    skinTypes: { id: string; label: string; count: number }[];
    brands: { id: string; label: string; count: number }[];
    priceRange: { min: number; max: number };
  };
  locale: string;
  currentPage: number;
  totalPages: number;
  categories: any[];
}

export default function ShopClient({
  initialProducts,
  totalCount: initialTotalCount,
  filters,
  locale,
  currentPage: initialPage,
  totalPages: initialTotalPages,
  categories,
}: ShopClientProps) {
  const isPersian = locale === 'fa';
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [products, setProducts] = useState(initialProducts);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Selected filters - sync with URL
  const [selectedFilters, setSelectedFilters] = useState({
  categories: searchParams.getAll('category') || [],
  concerns: searchParams.getAll('concern') || [],
  skinTypes: searchParams.getAll('skinType') || [],
  brands: searchParams.getAll('brand') || [], // Keep as slugs
  priceRange: { 
    min: parseInt(searchParams.get('minPrice') || '0'),
    max: parseInt(searchParams.get('maxPrice') || '10000'),
  },
  inStock: searchParams.get('inStock') === 'true',
});

  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

  // Fetch products when URL changes
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      
      // Build URL with current filters
      const params = new URLSearchParams();
      
      // Add category filters
      const categoryParams = searchParams.getAll('category');
      categoryParams.forEach(c => params.append('category', c));
      
      // Add concern filters
      const concernParams = searchParams.getAll('concern');
      concernParams.forEach(c => params.append('concern', c));
      
      // Add skin type filters
      const skinTypeParams = searchParams.getAll('skinType');
      skinTypeParams.forEach(s => params.append('skinType', s));
      
      // Add brand filters
      const brandParams = searchParams.getAll('brand');
      brandParams.forEach(b => params.append('brand', b));
      
      // Add price range
      if (searchParams.get('minPrice')) {
        params.set('minPrice', searchParams.get('minPrice')!);
      }
      if (searchParams.get('maxPrice')) {
        params.set('maxPrice', searchParams.get('maxPrice')!);
      }
      
      // Add in stock
      if (searchParams.get('inStock') === 'true') {
        params.set('inStock', 'true');
      }
      
      // Add sort
      if (searchParams.get('sort')) {
        params.set('sort', searchParams.get('sort')!);
      }
      
      // Add page
      const page = searchParams.get('page') || '1';
      params.set('page', page);
      
      // Add search
      if (searchParams.get('search')) {
        params.set('search', searchParams.get('search')!);
      }
      
      try {
        const response = await fetch(`/api/products?${params.toString()}`);
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.products);
          setTotalCount(data.totalCount);
          setTotalPages(data.totalPages);
          setCurrentPage(data.currentPage);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const formatPrice = (price: number) => {
  if (isPersian) {
    const tomanRate = 185000;
    const tomanPrice = price * tomanRate;
    return new Intl.NumberFormat('fa-IR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(tomanPrice) + ' تومان';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);
};

  const handleFilterChange = (key: string, value: any) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    // Build URL with all filters
    const params = new URLSearchParams();
    
    // Add all selected filters to URL
    if (selectedFilters.categories.length > 0) {
      selectedFilters.categories.forEach(c => params.append('category', c));
    }
    if (selectedFilters.concerns.length > 0) {
      selectedFilters.concerns.forEach(c => params.append('concern', c));
    }
    if (selectedFilters.skinTypes.length > 0) {
      selectedFilters.skinTypes.forEach(s => params.append('skinType', s));
    }
    if (selectedFilters.brands.length > 0) {
      selectedFilters.brands.forEach(b => params.append('brand', b));
    }
    if (selectedFilters.priceRange.min > 0) {
      params.set('minPrice', String(selectedFilters.priceRange.min));
    }
    if (selectedFilters.priceRange.max < filters.priceRange.max) {
      params.set('maxPrice', String(selectedFilters.priceRange.max));
    }
    if (selectedFilters.inStock) {
      params.set('inStock', 'true');
    }
    if (sortBy !== 'newest') {
      params.set('sort', sortBy);
    }
    
    // Add search if exists
    const search = searchParams.get('search');
    if (search) {
      params.set('search', search);
    }
    
    // Reset to page 1 when applying filters
    params.set('page', '1');
    
    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(url);
  };

  const handleClearAll = () => {
    setSelectedFilters({
      categories: [],
      concerns: [],
      skinTypes: [],
      brands: [],
      priceRange: { min: 0, max: filters.priceRange.max },
      inStock: false,
    });
    router.push(pathname);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    router.push(`?${params.toString()}`);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  // Build pagination
  const getPageNumbers = (): number[] => {
  const pages: number[] = [];
  const maxVisible: number = 5;
  let start: number = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end: number = Math.min(totalPages, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i: number = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
};

  // Get current category for FilterBar
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';

  // FilterBar translations
  const filterBarTranslations = {
    allCategories: isPersian ? 'همه دسته‌بندی‌ها' : 'All Categories',
    searchPlaceholder: isPersian ? 'جستجوی محصولات...' : 'Search products...',
  };

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-brand-text-secondary mb-6">
        <Link href={`/${locale}`} className="hover:text-brand-primary transition">
          {isPersian ? 'خانه' : 'Home'}
        </Link>
        <span>/</span>
        <span className="text-brand-text">
          {isPersian ? 'فروشگاه' : 'Shop'}
        </span>
      </div>

      {/* Filter Bar - Top Bar with Search and Category */}
      <FilterBar
        categories={categories}
        currentCategory={currentCategory}
        currentSearch={currentSearch}
        locale={locale}
        t={filterBarTranslations}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="heading-2 text-brand-text">
            {isPersian ? 'فروشگاه' : 'Shop'}
          </h1>
          <p className="text-brand-text-secondary text-sm">
            {isLoading ? '...' : `${totalCount} ${isPersian ? 'محصول' : 'products'}`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterSheetOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-brand-secondary/30 rounded-lg hover:bg-brand-pale-rose transition"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm">
              {isPersian ? 'فیلترها' : 'Filters'}
            </span>
          </button>

          {/* View Toggle */}
          <div className="hidden sm:flex border border-brand-secondary/30 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition ${
                viewMode === 'grid'
                  ? 'bg-brand-primary text-white'
                  : 'text-brand-text-secondary hover:bg-brand-pale-rose'
              }`}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition ${
                viewMode === 'list'
                  ? 'bg-brand-primary text-white'
                  : 'text-brand-text-secondary hover:bg-brand-pale-rose'
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Sort */}
          <ProductSort
            sortBy={sortBy}
            onSortChange={handleSortChange}
            locale={locale}
          />
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar
            filters={filters}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onApplyFilters={handleApplyFilters}
            onClearAll={handleClearAll}
            locale={locale}
          />
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="heading-3 text-brand-text mb-2">
                {isPersian ? 'محصولی یافت نشد' : 'No products found'}
              </h3>
              <p className="text-brand-text-secondary">
                {isPersian
                  ? 'لطفاً فیلترهای خود را تنظیم کنید'
                  : 'Please adjust your filters'}
              </p>
              <button
                onClick={handleClearAll}
                className="mt-4 text-brand-primary hover:text-brand-hover font-medium transition"
              >
                {isPersian ? 'حذف همه فیلترها' : 'Clear all filters'}
              </button>
            </div>
          ) : (
            <>
              {/* Product Grid */}
              <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6`}>
                {products.map((product, index) => {
                  const lowestPrice = product.variants.length > 0 
  ? Math.min(...product.variants.map((v) => v.price)) 
  : 0;
                  const name = isPersian ? product.nameFa : product.nameEn;
                  const categoryName = isPersian
                    ? product.category.nameFa
                    : product.category.nameEn;
                  const image = product.images?.[0] || null;

                  return (
                    <Link
                      key={product.id}
                      href={`/${locale}/product/${product.slug}`}
                      className="group bg-white rounded-xl overflow-hidden transition-all duration-500 hover:shadow-hover hover:-translate-y-2 border border-brand-secondary/10"
                      style={{
                        animation: `fade-up 0.6s ease-out ${index * 0.05}s both`,
                      }}
                    >
                      <div className="relative aspect-square overflow-hidden bg-brand-pale-rose/20">
                        {image ? (
                          <img
                            src={image}
                            alt={name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl">
                            🧴
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-medium text-brand-text text-sm line-clamp-2 group-hover:text-brand-primary transition">
                              {name}
                            </h3>
                            {product.brand && (
                              <p className="text-xs text-brand-text-secondary mt-0.5">
                                {product.brand}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-brand-text-secondary bg-brand-pale-rose/50 px-2 py-0.5 rounded-full whitespace-nowrap">
                            {categoryName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-semibold text-brand-primary">
                            {formatPrice(lowestPrice)}
                          </span>
                          {product.variants.some((v) => v.comparePrice) && (
                            <span className="text-xs text-brand-text-secondary line-through">
                              {formatPrice(
                                Math.min(
                                  ...product.variants
                                    .filter((v) => v.comparePrice)
                                    .map((v) => v.comparePrice!)
                                )
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border transition ${
                      currentPage === 1
                        ? 'border-brand-secondary/20 text-brand-text-secondary/30 cursor-not-allowed'
                        : 'border-brand-secondary/20 hover:border-brand-primary hover:text-brand-primary'
                    }`}
                  >
                    <ChevronLeft className={`w-4 h-4 ${isPersian ? 'rotate-180' : ''}`} />
                  </button>

                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                        page === currentPage
                          ? 'bg-brand-primary text-white'
                          : 'text-brand-text-secondary hover:bg-brand-pale-rose'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border transition ${
                      currentPage === totalPages
                        ? 'border-brand-secondary/20 text-brand-text-secondary/30 cursor-not-allowed'
                        : 'border-brand-secondary/20 hover:border-brand-primary hover:text-brand-primary'
                    }`}
                  >
                    <ChevronRight className={`w-4 h-4 ${isPersian ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <FilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        filters={filters}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
        onClearAll={handleClearAll}
        locale={locale}
      />
    </div>
  );
}