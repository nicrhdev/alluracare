// src/components/common/AnnouncementBar.tsx

'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface AnnouncementBarProps {
  locale: string;
}

const announcements = [
  { id: 1, text: '✨ Free shipping on orders over $50', textFa: '✨ ارسال رایگان برای سفارش‌های بالای ۵۰ دلار' },
  { id: 2, text: '🌿 New arrivals: Spring Collection', textFa: '🌿 محصولات جدید: مجموعه بهاری' },
  { id: 3, text: '💫 Sign up and get 15% off your first order', textFa: '💫 ثبت‌نام کنید و ۱۵٪ تخفیف بگیرید' },
];

export default function AnnouncementBar({ locale }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isPersian = locale === 'fa';

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const current = announcements[currentIndex];
  const text = isPersian ? current.textFa : current.text;

  return (
    <div className="relative bg-gradient-primary text-white py-2.5 overflow-hidden">
      <div className="container-custom flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm font-medium animate-fade-in">
          <span>{text}</span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 text-white/80 hover:text-white transition p-1"
          aria-label="Close announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}