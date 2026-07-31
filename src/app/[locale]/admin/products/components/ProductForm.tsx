// src/app/[locale]/admin/products/components/ProductForm.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductImageUpload from '@/components/product/ProductImageUpload';
import MultiSelect from '@/components/ui/MultiSelect';

interface Variant {
  id?: string;
  size: string;
  price: number | string;
  comparePrice: number | string | null;
  stock: number | string;
  sku: string;
  isDefault: boolean;
}

interface SkinType {
  id: string;
  nameEn: string;
  nameFa: string;
  slug: string;
}

interface Concern {
  id: string;
  nameEn: string;
  nameFa: string;
  slug: string;
}

interface Product {
  id: string;
  nameEn: string;
  nameFa: string;
  slug: string;
  descriptionEn: string | null;
  descriptionFa: string | null;
  benefits: string[];
  ingredients: string[];
  howToUseEn: string | null;
  howToUseFa: string | null;
  skinTypes: { skinType: SkinType }[];
  concerns: { concern: Concern }[];
  origin: string | null;
  brand: string | null;
  categoryId: string;
  variants: Variant[];
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

interface Category {
  id: string;
  nameEn: string;
  nameFa: string;
  slug: string;
}

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  skinTypes: SkinType[];
  concerns: Concern[];
  locale: string;
  isEdit: boolean;
}

export default function ProductForm({
  product,
  categories,
  skinTypes,
  concerns,
  locale,
  isEdit,
}: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPersian = locale === 'fa';

  // Add debug logging
  console.log('🔍 ProductForm - Skin Types:', skinTypes);
  console.log('🔍 ProductForm - Concerns:', concerns);
  console.log('🔍 ProductForm - Categories:', categories);

  // Get selected IDs from product
  const getSelectedSkinTypeIds = () => {
    if (product?.skinTypes) {
      return product.skinTypes.map((st) => st.skinType.id);
    }
    return [];
  };

  const getSelectedConcernIds = () => {
    if (product?.concerns) {
      return product.concerns.map((c) => c.concern.id);
    }
    return [];
  };

  // Form state
  const [formData, setFormData] = useState({
    nameEn: product?.nameEn || '',
    nameFa: product?.nameFa || '',
    slug: product?.slug || '',
    descriptionEn: product?.descriptionEn || '',
    descriptionFa: product?.descriptionFa || '',
    benefits: product?.benefits?.join('\n') || '',
    ingredients: product?.ingredients?.join('\n') || '',
    howToUseEn: product?.howToUseEn || '',
    howToUseFa: product?.howToUseFa || '',
    selectedSkinTypeIds: getSelectedSkinTypeIds(),
    selectedConcernIds: getSelectedConcernIds(),
    origin: product?.origin || '',
    brand: product?.brand || '',
    categoryId: product?.categoryId || '',
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
    status: product?.status || 'DRAFT',
    variants: product?.variants || [{ size: '', price: '', comparePrice: '', stock: '', sku: '', isDefault: true }],
    images: product?.images || [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.value as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
    }));
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setFormData((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { size: '', price: '', comparePrice: '', stock: '', sku: '', isDefault: false },
      ],
    }));
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length <= 1) return;
    const updatedVariants = formData.variants.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const handleImagesChange = (images: string[]) => {
    setFormData((prev) => ({ ...prev, images }));
  };

  const handleSkinTypesChange = (selectedIds: string[]) => {
    setFormData((prev) => ({ ...prev, selectedSkinTypeIds: selectedIds }));
  };

  const handleConcernsChange = (selectedIds: string[]) => {
    setFormData((prev) => ({ ...prev, selectedConcernIds: selectedIds }));
  };

  // Generate SKU automatically
  const generateSKU = (slug: string, index: number) => {
    const prefix = slug.substring(0, 4).toUpperCase();
    return `${prefix}-${String(index + 1).padStart(3, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Process variants - auto-generate SKU if empty
      const processedVariants = formData.variants.map((v, index) => {
        const sku = v.sku || generateSKU(formData.slug, index);

        return {
          ...v,
          price: v.price ? parseFloat(v.price as string) : 0,
          comparePrice: v.comparePrice ? parseFloat(v.comparePrice as string) : null,
          stock: v.stock ? parseInt(v.stock as string) : 0,
          sku: sku,
        };
      });

      const payload = {
        nameEn: formData.nameEn,
        nameFa: formData.nameFa,
        slug: formData.slug,
        descriptionEn: formData.descriptionEn,
        descriptionFa: formData.descriptionFa,
        benefits: formData.benefits.split('\n').filter(Boolean),
        ingredients: formData.ingredients.split('\n').filter(Boolean),
        howToUseEn: formData.howToUseEn,
        howToUseFa: formData.howToUseFa,
        selectedSkinTypeIds: formData.selectedSkinTypeIds,
        selectedConcernIds: formData.selectedConcernIds,
        origin: formData.origin,
        brand: formData.brand,
        categoryId: formData.categoryId,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        status: formData.status,
        variants: processedVariants,
        images: formData.images,
      };

      const url = isEdit ? `/api/admin/products/${product?.id}` : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save product');
      }

      router.push(`/${locale}/admin/products`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const labels = isPersian
    ? {
        english: 'انگلیسی',
        persian: 'فارسی',
        name: 'نام محصول *',
        description: 'توضیحات',
        howToUse: 'روش استفاده',
        slug: 'اسلاگ *',
        brand: 'برند',
        category: 'دسته‌بندی *',
        origin: 'کشور سازنده',
        benefits: 'مزایا (هر خط یک مورد)',
        ingredients: 'مواد تشکیل‌دهنده (هر خط یک مورد)',
        skinTypes: 'نوع پوست (حداکثر ۱۰ مورد)',
        concerns: 'مشکلات پوستی (حداکثر ۱۰ مورد)',
        variants: 'سایزها و قیمت‌ها',
        addVariant: 'افزودن سایز',
        removeVariant: 'حذف',
        size: 'سایز',
        price: 'قیمت',
        comparePrice: 'قیمت قبلی',
        stock: 'موجودی',
        sku: 'SKU (اختیاری)',
        active: 'فعال',
        featured: 'ویژه',
        status: 'وضعیت انتشار',
        draft: 'پیش‌نویس',
        published: 'منتشر شده',
        archived: 'بایگانی شده',
        cancel: 'انصراف',
        save: isEdit ? 'به‌روزرسانی محصول' : 'ایجاد محصول',
        saving: 'در حال ذخیره‌سازی...',
        images: 'تصاویر محصول (حداکثر ۷ تصویر)',
        searchSkinTypes: 'جستجوی نوع پوست...',
        searchConcerns: 'جستجوی مشکلات پوستی...',
        selectSkinTypes: 'انتخاب نوع پوست',
        selectConcerns: 'انتخاب مشکلات پوستی',
      }
    : {
        english: 'English',
        persian: 'Persian',
        name: 'Product Name *',
        description: 'Description',
        howToUse: 'How to Use',
        slug: 'Slug *',
        brand: 'Brand',
        category: 'Category *',
        origin: 'Country of Origin',
        benefits: 'Benefits (one per line)',
        ingredients: 'Ingredients (one per line)',
        skinTypes: 'Skin Types (max 10)',
        concerns: 'Concerns (max 10)',
        variants: 'Variants',
        addVariant: 'Add Variant',
        removeVariant: 'Remove',
        size: 'Size',
        price: 'Price',
        comparePrice: 'Compare Price',
        stock: 'Stock',
        sku: 'SKU (Optional)',
        active: 'Active',
        featured: 'Featured',
        status: 'Product Status',
        draft: 'Draft',
        published: 'Published',
        archived: 'Archived',
        cancel: 'Cancel',
        save: isEdit ? 'Update Product' : 'Create Product',
        saving: 'Saving...',
        images: 'Product Images (max 7)',
        searchSkinTypes: 'Search skin types...',
        searchConcerns: 'Search concerns...',
        selectSkinTypes: 'Select skin types',
        selectConcerns: 'Select concerns',
      };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* English Fields */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-700">{labels.english}</h3>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{labels.name}</label>
            <input
              type="text"
              name="nameEn"
              value={formData.nameEn}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{labels.description}</label>
            <textarea
              name="descriptionEn"
              value={formData.descriptionEn}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{labels.howToUse}</label>
            <textarea
              name="howToUseEn"
              value={formData.howToUseEn}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400"
            />
          </div>
        </div>

        {/* Persian Fields */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-700">{labels.persian}</h3>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{labels.name}</label>
            <input
              type="text"
              name="nameFa"
              value={formData.nameFa}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400"
              dir="rtl"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{labels.description}</label>
            <textarea
              name="descriptionFa"
              value={formData.descriptionFa}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400"
              dir="rtl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{labels.howToUse}</label>
            <textarea
              name="howToUseFa"
              value={formData.howToUseFa}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400"
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* Common Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{labels.slug}</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400"
            required
          />
          <p className="text-xs text-slate-400 mt-1">
            {isPersian ? 'آدرس یکتا برای محصول' : 'Unique URL for the product'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{labels.brand}</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{labels.category}</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400"
            required
          >
            <option value="">{isPersian ? 'انتخاب دسته‌بندی' : 'Select Category'}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {isPersian ? cat.nameFa : cat.nameEn}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{labels.origin}</label>
          <input
            type="text"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{labels.benefits}</label>
          <textarea
            name="benefits"
            value={formData.benefits}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{labels.ingredients}</label>
          <textarea
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400"
          />
        </div>
      </div>

      {/* Skin Types - MultiSelect */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{labels.skinTypes}</label>
        <MultiSelect
          options={skinTypes}
          selectedIds={formData.selectedSkinTypeIds}
          onChange={handleSkinTypesChange}
          placeholder={labels.selectSkinTypes}
          searchPlaceholder={labels.searchSkinTypes}
          maxSelection={10}
          locale={locale}
        />
      </div>

      {/* Concerns - MultiSelect */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{labels.concerns}</label>
        <MultiSelect
          options={concerns}
          selectedIds={formData.selectedConcernIds}
          onChange={handleConcernsChange}
          placeholder={labels.selectConcerns}
          searchPlaceholder={labels.searchConcerns}
          maxSelection={10}
          locale={locale}
        />
      </div>

      {/* Image Upload Section */}
      <div className="border-t border-slate-200 pt-6">
        <ProductImageUpload
          images={formData.images}
          onImagesChange={handleImagesChange}
          maxImages={7}
          label={labels.images}
        />
      </div>

      {/* Variants */}
      <div className="border-t border-slate-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-700">{labels.variants}</h3>
          <button
            type="button"
            onClick={addVariant}
            className="px-3 py-1 text-sm bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition"
          >
            {labels.addVariant}
          </button>
        </div>

        {formData.variants.map((variant, index) => (
          <div
            key={index}
            className="grid grid-cols-6 gap-3 p-3 bg-slate-50 rounded-lg mb-3 items-end"
          >
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">{labels.size}</label>
              <input
                type="text"
                value={variant.size}
                onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                className="w-full px-3 py-1 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400 text-sm"
                placeholder={isPersian ? 'مثلاً ۵۰ml' : 'e.g. 50ml'}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">{labels.price}</label>
              <input
                type="number"
                step="0.01"
                value={variant.price}
                onChange={(e) => {
                  const val = e.target.value;
                  handleVariantChange(index, 'price', val === '' ? '' : parseFloat(val));
                }}
                className="w-full px-3 py-1 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400 text-sm"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                {labels.comparePrice}
              </label>
              <input
                type="number"
                step="0.01"
                value={variant.comparePrice ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  handleVariantChange(index, 'comparePrice', val === '' ? null : parseFloat(val));
                }}
                className="w-full px-3 py-1 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400 text-sm"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">{labels.stock}</label>
              <input
                type="number"
                value={variant.stock}
                onChange={(e) => {
                  const val = e.target.value;
                  handleVariantChange(index, 'stock', val === '' ? '' : parseInt(val));
                }}
                className="w-full px-3 py-1 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400 text-sm"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">{labels.sku}</label>
              <input
                type="text"
                value={variant.sku}
                onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                className="w-full px-3 py-1 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400 text-sm"
                placeholder={isPersian ? 'اختیاری - خودکار تولید می‌شود' : 'Optional - auto-generated'}
              />
            </div>
            <div>
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="text-red-500 hover:text-red-700 text-sm"
                disabled={formData.variants.length <= 1}
              >
                {labels.removeVariant}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Status Section */}
      <div className="border-t border-slate-200 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Product Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{labels.status}</label>
            <select
              value={formData.status}
              onChange={handleStatusChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400"
            >
              <option value="DRAFT">{labels.draft}</option>
              <option value="PUBLISHED">{labels.published}</option>
              <option value="ARCHIVED">{labels.archived}</option>
            </select>
            <p className="text-xs text-slate-400 mt-1">
              {isPersian
                ? 'محصولات با وضعیت پیش‌نویس در فروشگاه نمایش داده نمی‌شوند'
                : 'Draft products will not be visible in the store'}
            </p>
          </div>

          {/* Active */}
          <div className="flex items-center gap-2 pt-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-400"
              />
              <span className="text-sm text-slate-700">{labels.active}</span>
            </label>
          </div>

          {/* Featured */}
          <div className="flex items-center gap-2 pt-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-400"
              />
              <span className="text-sm text-slate-700">{labels.featured}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
        <Link
          href={`/${locale}/admin/products`}
          className="px-6 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition"
        >
          {labels.cancel}
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition disabled:opacity-50"
        >
          {loading ? labels.saving : labels.save}
        </button>
      </div>
    </form>
  );
}