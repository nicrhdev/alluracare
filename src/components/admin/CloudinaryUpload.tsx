// src/components/admin/CloudinaryUpload.tsx

'use client';

import { useState, useRef } from 'react';
import { Image, X, Upload, Loader2 } from 'lucide-react';

interface CloudinaryUploadProps {
  value: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  label?: string;
  folder?: string;
  maxSize?: number; // in MB
}

export default function CloudinaryUpload({
  value,
  onChange,
  onRemove,
  label = 'Upload Image',
  folder = 'hero-slides',
  maxSize = 10,
}: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';

  const uploadToCloudinary = async (file: File) => {
    setError(null);
    setIsUploading(true);

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`);
      setIsUploading(false);
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif'];
    if (!validTypes.includes(file.type)) {
      setError('Unsupported file format. Please use JPEG, PNG, WEBP, GIF, SVG, or AVIF.');
      setIsUploading(false);
      return;
    }

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'alluracare');
      formData.append('folder', folder);
      formData.append('cloud_name', cloudinaryCloudName);

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Upload failed');
      }

      if (data.secure_url) {
        onChange(data.secure_url);
        setError(null);
      } else {
        throw new Error('No URL returned from Cloudinary');
      }
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadToCloudinary(file);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadToCloudinary(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-brand-text">
          {label}
        </label>
      )}

      {error && (
        <div className="text-sm text-red-500 bg-red-50 p-2 rounded-lg">
          {error}
        </div>
      )}

      {value ? (
        // Image Preview
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-brand-secondary/20 bg-brand-pale-rose/20">
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              onClick={handleButtonClick}
              disabled={isUploading}
              className="px-4 py-2 bg-white text-brand-text rounded-lg hover:bg-brand-pale-rose transition flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Replace
            </button>
            <button
              onClick={onRemove}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Remove
            </button>
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>
      ) : (
        // Upload Area
        <div
          onClick={handleButtonClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="w-full aspect-video border-2 border-dashed border-brand-secondary/30 rounded-lg hover:border-brand-primary transition cursor-pointer flex flex-col items-center justify-center gap-3 bg-brand-pale-rose/10 hover:bg-brand-pale-rose/20"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
              <span className="text-sm text-brand-text-secondary">Uploading...</span>
            </>
          ) : (
            <>
              <Image className="w-12 h-12 text-brand-text-secondary" />
              <span className="text-sm font-medium text-brand-text">Click to upload or drag & drop</span>
              <span className="text-xs text-brand-text-secondary">
                Supports: JPEG, PNG, WEBP, GIF, SVG, AVIF (Max {maxSize}MB)
              </span>
            </>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}