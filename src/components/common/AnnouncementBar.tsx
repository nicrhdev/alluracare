// src/components/common/AnnouncementBar.tsx

'use client';

import { useEffect, useRef } from 'react';

interface AnnouncementBarProps {
  locale: string;
}

const messages = {
  en: [
    'Free shipping on orders over $50',
    'Sign up and get 15% off your order',
    '10% off your first order with "first1" coupon',
  ],
  fa: [
    'ارسال رایگان برای سفارش‌های بالای ۳ میلیون تومان',
    'با عضویت در وبسایت ۱۵٪ تخفیف بگیرید',
    ' ۱۰٪ تخفیف روی اولین سفارش با کد تخفیف "first1" ',
  ],
};

export default function AnnouncementBar({ locale }: AnnouncementBarProps) {
  const isPersian = locale === 'fa';
  const items = isPersian ? messages.fa : messages.en;
  const scrollRef = useRef<HTMLDivElement>(null);

  // Duplicate items for seamless scrolling
  const duplicatedItems = [...items, ...items];

  return (
    <div className="announcement-bar text-brand-primary py-2.5 overflow-hidden relative shadow-sm">
      <div className="container-custom relative overflow-hidden">
        <div className="scrolling-text flex gap-8 animate-scroll whitespace-nowrap w-max" ref={scrollRef}>
          {duplicatedItems.map((message, index) => (
            <span key={index} className="text-sm font-light tracking-wide">
              {message}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .announcement-bar {
          background: linear-gradient(135deg, #EDEDFA 0%, #C9CAE1 30%, #B8A2B7 60%, #C9CAE1 80%, #EDEDFA 100%);
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 25s linear infinite;
        }
        .announcement-bar:hover .animate-scroll {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}