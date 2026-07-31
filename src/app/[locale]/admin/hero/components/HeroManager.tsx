// src/app/[locale]/admin/hero/components/HeroManager.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Trash2, Eye, EyeOff, Plus, Image, X, Save, Edit } from 'lucide-react';

interface HeroSlide {
  id: string;
  image: string;
  imageMobile?: string | null;
  titleEn?: string | null;
  titleFa?: string | null;
  subtitleEn?: string | null;
  subtitleFa?: string | null;
  ctaTextEn?: string | null;
  ctaTextFa?: string | null;
  ctaLink?: string | null;
  order: number;
  isActive: boolean;
}

interface HeroManagerProps {
  slides: HeroSlide[];
  locale: string;
}

export default function HeroManager({ slides: initialSlides, locale }: HeroManagerProps) {
  const router = useRouter();
  const [slides, setSlides] = useState(initialSlides);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [formData, setFormData] = useState({
    image: '',
    imageMobile: '',
    titleEn: '',
    titleFa: '',
    subtitleEn: '',
    subtitleFa: '',
    ctaTextEn: '',
    ctaTextFa: '',
    ctaLink: '',
    isActive: true,
  });

  const isPersian = locale === 'fa';

  // Reset form
  const resetForm = () => {
    setFormData({
      image: '',
      imageMobile: '',
      titleEn: '',
      titleFa: '',
      subtitleEn: '',
      subtitleFa: '',
      ctaTextEn: '',
      ctaTextFa: '',
      ctaLink: '',
      isActive: true,
    });
    setEditingSlide(null);
    setShowForm(false);
  };

  // Edit slide
  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      image: slide.image,
      imageMobile: slide.imageMobile || '',
      titleEn: slide.titleEn || '',
      titleFa: slide.titleFa || '',
      subtitleEn: slide.subtitleEn || '',
      subtitleFa: slide.subtitleFa || '',
      ctaTextEn: slide.ctaTextEn || '',
      ctaTextFa: slide.ctaTextFa || '',
      ctaLink: slide.ctaLink || '',
      isActive: slide.isActive,
    });
    setShowForm(true);
  };

  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = '/api/admin/hero';
      const method = editingSlide ? 'PUT' : 'POST';
      const body = editingSlide
        ? { id: editingSlide.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save slide');
      }

      router.refresh();
      resetForm();
    } catch (error) {
      console.error('Error saving slide:', error);
      alert(isPersian ? 'خطا در ذخیره اسلاید' : 'Error saving slide');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete slide
  const handleDelete = async (id: string) => {
    if (!confirm(isPersian ? 'آیا از حذف این اسلاید مطمئن هستید؟' : 'Are you sure you want to delete this slide?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/hero?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete slide');
      }

      router.refresh();
    } catch (error) {
      console.error('Error deleting slide:', error);
      alert(isPersian ? 'خطا در حذف اسلاید' : 'Error deleting slide');
    }
  };

  // Toggle active status
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          isActive: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update slide');
      }

      router.refresh();
    } catch (error) {
      console.error('Error toggling slide:', error);
      alert(isPersian ? 'خطا در تغییر وضعیت اسلاید' : 'Error updating slide status');
    }
  };

  // Drag and drop reorder
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(slides);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order values
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setSlides(updatedItems);

    // Save new order to server
    const saveOrder = async () => {
      try {
        for (const item of updatedItems) {
          await fetch('/api/admin/hero', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: item.id,
              order: item.order,
            }),
          });
        }
        router.refresh();
      } catch (error) {
        console.error('Error saving order:', error);
      }
    };

    saveOrder();
  };

  return (
    <div className="space-y-6">
      {/* Add Button */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-brand-text-secondary">
          {isPersian
            ? `${slides.length} اسلاید در حال نمایش`
            : `${slides.length} slides displayed`}
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="btn-primary text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {isPersian ? 'افزودن اسلاید' : 'Add Slide'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-soft border border-brand-secondary/20 p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-brand-text">
              {editingSlide
                ? isPersian
                  ? 'ویرایش اسلاید'
                  : 'Edit Slide'
                : isPersian
                ? 'اسلاید جدید'
                : 'New Slide'}
            </h3>
            <button
              onClick={resetForm}
              className="p-2 text-brand-text-secondary hover:text-brand-primary transition rounded-lg hover:bg-brand-pale-rose"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">
                  {isPersian ? 'تصویر (آدرس)' : 'Image URL'} *
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="input-premium"
                  required
                />
                <p className="text-xs text-brand-text-secondary mt-1">
                  {isPersian
                    ? 'از یک آدرس تصویر معتبر استفاده کنید'
                    : 'Use a valid image URL'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">
                  {isPersian ? 'تصویر موبایل (اختیاری)' : 'Mobile Image (Optional)'}
                </label>
                <input
                  type="text"
                  name="imageMobile"
                  value={formData.imageMobile}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="input-premium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">
                  {isPersian ? 'عنوان (انگلیسی)' : 'Title (English)'}
                </label>
                <input
                  type="text"
                  name="titleEn"
                  value={formData.titleEn}
                  onChange={handleChange}
                  placeholder="Radiance Starts Here"
                  className="input-premium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">
                  {isPersian ? 'عنوان (فارسی)' : 'Title (Persian)'}
                </label>
                <input
                  type="text"
                  name="titleFa"
                  value={formData.titleFa}
                  onChange={handleChange}
                  placeholder="درخشش از اینجا شروع می‌شود"
                  className="input-premium"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">
                  {isPersian ? 'زیرنویس (انگلیسی)' : 'Subtitle (English)'}
                </label>
                <input
                  type="text"
                  name="subtitleEn"
                  value={formData.subtitleEn}
                  onChange={handleChange}
                  placeholder="A curated collection..."
                  className="input-premium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">
                  {isPersian ? 'زیرنویس (فارسی)' : 'Subtitle (Persian)'}
                </label>
                <input
                  type="text"
                  name="subtitleFa"
                  value={formData.subtitleFa}
                  onChange={handleChange}
                  placeholder="مجموعه‌ای از بهترین محصولات..."
                  className="input-premium"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">
                  {isPersian ? 'متن دکمه (انگلیسی)' : 'CTA Text (English)'}
                </label>
                <input
                  type="text"
                  name="ctaTextEn"
                  value={formData.ctaTextEn}
                  onChange={handleChange}
                  placeholder="Shop Now"
                  className="input-premium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">
                  {isPersian ? 'متن دکمه (فارسی)' : 'CTA Text (Persian)'}
                </label>
                <input
                  type="text"
                  name="ctaTextFa"
                  value={formData.ctaTextFa}
                  onChange={handleChange}
                  placeholder="خرید کنید"
                  className="input-premium"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">
                  {isPersian ? 'لینک دکمه' : 'CTA Link'}
                </label>
                <input
                  type="text"
                  name="ctaLink"
                  value={formData.ctaLink}
                  onChange={handleChange}
                  placeholder="/shop"
                  className="input-premium"
                />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-brand-secondary/50 text-brand-primary focus:ring-brand-primary"
                  />
                  <span className="text-sm text-brand-text-secondary">
                    {isPersian ? 'فعال' : 'Active'}
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-brand-secondary/10">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary text-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isLoading
                  ? isPersian
                    ? 'در حال ذخیره...'
                    : 'Saving...'
                  : isPersian
                  ? 'ذخیره'
                  : 'Save'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary text-sm"
              >
                {isPersian ? 'انصراف' : 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Slides List */}
      {slides.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-soft border border-brand-secondary/20 p-12 text-center">
          <Image className="w-12 h-12 text-brand-secondary/50 mx-auto mb-3" />
          <p className="text-brand-text-secondary">
            {isPersian
              ? 'هیچ اسلایدی وجود ندارد. اولین اسلاید را اضافه کنید!'
              : 'No slides available. Add your first slide!'}
          </p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="hero-slides">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {slides.map((slide, index) => (
                  <Draggable key={slide.id} draggableId={slide.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="bg-white rounded-xl shadow-soft border border-brand-secondary/20 p-4 flex items-center gap-4 hover:shadow-medium transition-all"
                      >
                        {/* Drag Handle */}
                        <div
                          {...provided.dragHandleProps}
                          className="p-2 text-brand-text-secondary hover:text-brand-primary cursor-grab active:cursor-grabbing"
                        >
                          <GripVertical className="w-5 h-5" />
                        </div>

                        {/* Image Preview */}
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                          {slide.image ? (
                            <img
                              src={slide.image}
                              alt="Slide preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '';
                                (e.target as HTMLImageElement).className =
                                  'w-full h-full flex items-center justify-center text-2xl bg-slate-100';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl bg-slate-100">
                              🖼️
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-brand-text truncate">
                            {isPersian
                              ? slide.titleFa || 'بدون عنوان'
                              : slide.titleEn || 'Untitled'}
                          </p>
                          <p className="text-xs text-brand-text-secondary">
                            {isPersian ? 'وضعیت:' : 'Status:'}{' '}
                            {slide.isActive ? (
                              <span className="text-green-600 font-medium">
                                {isPersian ? 'فعال' : 'Active'}
                              </span>
                            ) : (
                              <span className="text-red-500 font-medium">
                                {isPersian ? 'غیرفعال' : 'Inactive'}
                              </span>
                            )}
                            {' • '}
                            {isPersian ? 'ترتیب:' : 'Order:'} {slide.order}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggleActive(slide.id, slide.isActive)}
                            className="p-2 text-brand-text-secondary hover:text-brand-primary transition rounded-lg hover:bg-brand-pale-rose"
                            title={isPersian ? 'تغییر وضعیت' : 'Toggle status'}
                          >
                            {slide.isActive ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEdit(slide)}
                            className="p-2 text-brand-text-secondary hover:text-brand-primary transition rounded-lg hover:bg-brand-pale-rose"
                            title={isPersian ? 'ویرایش' : 'Edit'}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(slide.id)}
                            className="p-2 text-brand-text-secondary hover:text-red-500 transition rounded-lg hover:bg-red-50"
                            title={isPersian ? 'حذف' : 'Delete'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}