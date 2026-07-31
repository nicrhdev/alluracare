// src/components/product/ProductImageUpload.tsx

'use client';

import { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface ProductImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
}

export default function ProductImageUpload({
  images,
  onImagesChange,
  maxImages = 7,
  label = 'Product Images',
}: ProductImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check file sizes (max 10MB per file)
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = Array.from(files).filter(f => f.size > maxFileSize);
    if (oversizedFiles.length > 0) {
      setError(`Some files exceed the 10MB limit. Please compress your images.`);
      return;
    }

    if (images.length + files.length > maxImages) {
      setError(`You can upload a maximum of ${maxImages} images`);
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        // Compress image before upload if too large
        let fileToUpload = file;
        if (file.size > 5 * 1024 * 1024) {
          fileToUpload = await compressImage(file);
        }

        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('upload_preset', 'alluracare_products');

        // Upload to Cloudinary with progress
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Upload failed');
        }

        const data = await response.json();
        uploadedUrls.push(data.secure_url);
        setUploadProgress(((i + 1) / files.length) * 100);
      } catch (err) {
        setError(`Failed to upload image ${i + 1}: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setUploading(false);
        return;
      }
    }

    onImagesChange([...images, ...uploadedUrls]);
    setUploading(false);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Image compression helper
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 1200;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Compression failed'));
            }
          }, 'image/jpeg', 0.85);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-700">
          {label} ({images.length}/{maxImages})
        </label>
        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 text-sm bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {uploading ? `Uploading ${Math.round(uploadProgress)}%` : 'Add Images'}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      {images.length === 0 ? (
        <div 
          className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-slate-400 transition"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-500">Click to upload images</p>
          <p className="text-xs text-slate-400">PNG, JPG, WEBP up to 10MB each</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden">
                <img
                  src={url}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleReorder(index, index - 1)}
                    className="p-1 bg-white rounded shadow hover:bg-slate-100"
                  >
                    ↑
                  </button>
                )}
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleReorder(index, index + 1)}
                    className="p-1 bg-white rounded shadow hover:bg-slate-100"
                  >
                    ↓
                  </button>
                )}
              </div>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-slate-800 text-white text-xs px-2 py-0.5 rounded">
                  Main
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}