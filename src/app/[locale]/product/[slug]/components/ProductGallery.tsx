// src/app/[locale]/product/[slug]/components/ProductGallery.tsx

'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gradient-soft rounded-2xl flex items-center justify-center">
        <span className="text-6xl">🧴</span>
      </div>
    );
  }

  const currentImage = images[selectedIndex];

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="sticky top-20">
      {/* Main Image */}
      <div 
        className="relative aspect-square bg-gradient-soft rounded-2xl overflow-hidden cursor-zoom-in group"
        onClick={() => setIsZoomModalOpen(true)}
      >
        <img
          src={currentImage}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Zoom indicator */}
        <div className="absolute bottom-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ZoomIn className="w-4 h-4 text-brand-text-secondary" />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft hover:bg-white transition opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5 text-brand-text" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft hover:bg-white transition opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5 text-brand-text" />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-medium">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                index === selectedIndex
                  ? 'ring-2 ring-brand-primary ring-offset-2'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={image}
                alt={`${productName} - ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <button
            onClick={() => setIsZoomModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-white hover:text-brand-primary transition z-10"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={currentImage}
            alt={productName}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {isZoomModalOpen ? 'Click outside to close' : ''}
          </div>
        </div>
      )}
    </div>
  );
}