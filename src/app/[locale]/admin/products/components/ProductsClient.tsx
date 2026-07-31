// src/app/[locale]/admin/products/components/ProductsClient.tsx

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  nameEn: string;
  nameFa: string;
  slug: string;
  brand: string | null;
  status: string;
  category: {
    nameEn: string;
    nameFa: string;
  } | null;
  variants: any[];
  isActive: boolean;
  isFeatured: boolean;
  skinTypes?: any[];
  concerns?: any[];
}

interface ProductsClientProps {
  products: Product[];
  locale: string;
  searchTerm?: string;
  statusFilter?: string;
  fetchError?: string | null;
  statusCounts: {
    all: number;
    draft: number;
    published: number;
    archived: number;
  };
  t: {
    title: string;
    subtitle: string;
    addProduct: string;
    searchPlaceholder: string;
    search: string;
    clear: string;
    noProducts: string;
    addFirstProduct: string;
    deleteConfirm: string;
    deleteCancel: string;
    status: string;
    allStatuses: string;
    draft: string;
    published: string;
    archived: string;
  };
}

export default function ProductsClient({
  products,
  locale,
  searchTerm,
  statusFilter = 'all',
  fetchError,
  statusCounts,
  t,
}: ProductsClientProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async (productId: string) => {
    setDeletingId(productId);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete product');
      }

      setShowDeleteModal(null);
      router.refresh();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'An error occurred');
      setDeletingId(null);
    }
  };

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-yellow-100 text-yellow-800',
    PUBLISHED: 'bg-green-100 text-green-800',
    ARCHIVED: 'bg-gray-100 text-gray-800',
  };

  const statusLabels: Record<string, string> = {
    DRAFT: t.draft,
    PUBLISHED: t.published,
    ARCHIVED: t.archived,
  };

  const getStatusBadge = (status: string) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{t.title}</h1>
          <p className="text-slate-600">{t.subtitle}</p>
        </div>
        <Link
          href={`/${locale}/admin/products/new`}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition"
        >
          {t.addProduct}
        </Link>
      </div>

      {/* Status Filter Badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href={`/${locale}/admin/products${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ''}`}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            statusFilter === 'all'
              ? 'bg-slate-800 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {t.allStatuses} ({statusCounts.all})
        </Link>
        <Link
          href={`/${locale}/admin/products?status=DRAFT${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            statusFilter === 'DRAFT'
              ? 'bg-yellow-600 text-white'
              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
          }`}
        >
          {t.draft} ({statusCounts.draft})
        </Link>
        <Link
          href={`/${locale}/admin/products?status=PUBLISHED${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            statusFilter === 'PUBLISHED'
              ? 'bg-green-600 text-white'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {t.published} ({statusCounts.published})
        </Link>
        <Link
          href={`/${locale}/admin/products?status=ARCHIVED${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            statusFilter === 'ARCHIVED'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {t.archived} ({statusCounts.archived})
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <form method="GET" className="flex gap-4">
          <input
            type="hidden"
            name="status"
            value={statusFilter === 'all' ? '' : statusFilter}
          />
          <input
            type="text"
            name="search"
            placeholder={t.searchPlaceholder}
            defaultValue={searchTerm || ''}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition"
          >
            {t.search}
          </button>
          {(searchTerm || statusFilter !== 'all') && (
            <Link
              href={`/${locale}/admin/products`}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition"
            >
              {t.clear}
            </Link>
          )}
        </form>
      </div>

      {/* Error Message */}
      {fetchError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          <p className="font-medium">⚠️ {fetchError}</p>
          <div className="mt-2 flex gap-2">
            <Link
              href={`/${locale}/admin/products`}
              className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition"
            >
              Refresh Page
            </Link>
          </div>
        </div>
      )}

      {/* Delete Error */}
      {deleteError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4">
          <p className="text-sm">{deleteError}</p>
          <button onClick={() => setDeleteError(null)} className="text-xs underline mt-1">
            Dismiss
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-2">{t.deleteConfirm}</h3>
            <p className="text-slate-600 text-sm mb-6">
              This action cannot be undone. Are you sure you want to delete this product?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition"
              >
                {t.deleteCancel}
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                disabled={deletingId === showDeleteModal}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {deletingId === showDeleteModal ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {!fetchError && products.length === 0 && !searchTerm && statusFilter === 'all' && (
          <div className="text-center py-12">
            <p className="text-slate-500">{t.noProducts}</p>
            <Link
              href={`/${locale}/admin/products/new`}
              className="inline-block mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition"
            >
              {t.addFirstProduct}
            </Link>
          </div>
        )}

        {!fetchError && products.length === 0 && (searchTerm || statusFilter !== 'all') && (
          <div className="text-center py-12">
            <p className="text-slate-500">
              {searchTerm ? `No products found for "${searchTerm}"` : `No products with status "${statusLabels[statusFilter]}"`}
            </p>
            <Link
              href={`/${locale}/admin/products`}
              className="inline-block mt-4 px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
              Clear Filters
            </Link>
          </div>
        )}

        {!fetchError && products.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Product</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Brand</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Category</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Variants</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Stock</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const totalStock = product.variants?.reduce((sum: number, v: any) => sum + v.stock, 0) || 0;
                  const hasMultipleVariants = product.variants?.length > 1;

                  return (
                    <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-slate-800">
                            {locale === 'fa' ? product.nameFa : product.nameEn}
                          </p>
                          <p className="text-xs text-slate-400">{product.slug}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{product.brand || '-'}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {locale === 'fa' ? product.category?.nameFa : product.category?.nameEn}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {product.variants?.length || 0} {hasMultipleVariants ? 'sizes' : 'size'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={totalStock > 0 ? 'text-green-600' : 'text-red-500'}>
                          {totalStock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(product.status)}
                          {!product.isActive && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Inactive
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/${locale}/admin/products/${product.id}/edit`}
                            className="px-3 py-1 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => setShowDeleteModal(product.id)}
                            className="px-3 py-1 text-sm text-red-500 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}