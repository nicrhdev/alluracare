// src/app/[locale]/not-found.tsx

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Home, ShoppingBag, ArrowRight } from 'lucide-react';

interface NotFoundPageProps {
  params: {
    locale: string;
  };
}

export default function NotFoundPage({ params }: NotFoundPageProps) {
  const { locale } = params;
  const isPersian = locale === 'fa';
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ background: 'linear-gradient(135deg, #EDEDFA 0%, #C1EODF 50%, #FAFAF8 100%)' }}>
      <div className="text-center max-w-lg">
        {/* Animated 404 */}
        <div className={`text-8xl font-bold text-[#874A58] mb-4 transition-all duration-700 ${isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          4
          <span className="inline-block animate-float">0</span>
          4
        </div>

        <h1 className={`text-2xl font-bold text-[#2D2D2D] mb-2 transition-all duration-700 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          {isPersian ? 'صفحه‌ای که به دنبال آن هستید یافت نشد' : 'Page Not Found'}
        </h1>

        <p className={`text-[#8A8A8A] mb-8 transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          {isPersian
            ? 'متأسفیم، صفحه‌ای که به دنبال آن هستید وجود ندارد یا جابه‌جا شده است.'
            : 'Sorry, the page you\'re looking for doesn\'t exist or has been moved.'}
        </p>

        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <Link
            href={`/${locale}`}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            {isPersian ? 'بازگشت به خانه' : 'Back to Home'}
          </Link>
          <Link
            href={`/${locale}/shop`}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            {isPersian ? 'مشاهده محصولات' : 'Browse Products'}
          </Link>
        </div>

        {/* Fun decoration */}
        <div className={`mt-8 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#EDEDFA] to-[#C1EODF] flex items-center justify-center">
            <span className="text-3xl animate-float">🧴</span>
          </div>
        </div>
      </div>
    </div>
  );
}