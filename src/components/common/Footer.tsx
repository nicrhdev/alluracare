// src/components/common/Footer.tsx

'use client';

import Link from 'next/link';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const isPersian = locale === 'fa';
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error(isPersian ? 'لطفاً ایمیل خود را وارد کنید' : 'Please enter your email');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(
        isPersian
          ? '✅ با موفقیت در خبرنامه ثبت شدید!'
          : '✅ Successfully subscribed!'
      );
      setEmail('');
    } catch (error) {
      toast.error(isPersian ? 'خطا در ثبت‌نام' : 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-white border-t border-brand-secondary/20">
      {/* Newsletter Section - Premium */}
      <div className="bg-gradient-to-r from-brand-purple-light/10 via-brand-mint-soft/10 to-brand-purple-light/10">
       <div className="container-custom pt-12 pb-8 border-b border-brand-secondary/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-brand-text">
              {isPersian ? 'عضویت در خبرنامه' : 'Join Our Newsletter'}
            </h3>
            <p className="text-sm text-brand-text-secondary">
              {isPersian
                ? 'از جدیدترین محصولات و تخفیف‌های ویژه مطلع شوید'
                : 'Stay updated with our latest products and exclusive offers'}
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isPersian ? 'ایمیل خود را وارد کنید' : 'Enter your email'}
              className="flex-1 md:w-64 px-4 py-2.5 border border-brand-secondary/30 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-2.5 px-6 whitespace-nowrap flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isPersian ? 'عضویت' : 'Subscribe'}
            </button>
          </form>
        </div>
       </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            {/* Logo */}
<Link
  href={`/${locale}`}
  className="flex items-center shrink-0"
>
  <img
    src="/logo.png"
    alt="AlluraCare"
    className="h-10 md:h-18 w-auto object-contain"
  />
</Link>
            <p className="text-sm text-brand-text-secondary leading-relaxed max-w-xs">
              {isPersian
                ? 'مراقبت از پوست خود را با بهترین محصولات آغاز کنید'
                : 'Start your skincare journey with the best products'}
            </p>
            {/* Social Links - Using simple text links instead of icons */}
            <div className="flex items-center gap-4 mt-4">
              <Link
                href="#"
                className="text-sm text-brand-text-secondary hover:text-brand-primary transition"
              >
                Instagram
              </Link>
              <Link
                href="#"
                className="text-sm text-brand-text-secondary hover:text-brand-primary transition"
              >
                Facebook
              </Link>
              <Link
                href="#"
                className="text-sm text-brand-text-secondary hover:text-brand-primary transition"
              >
                Twitter
              </Link>
              <Link
                href="#"
                className="text-sm text-brand-text-secondary hover:text-brand-primary transition"
              >
                YouTube
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-brand-text mb-4">
              {isPersian ? 'دسترسی آسان' : 'Quick Links'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href={`/${locale}/shop`}
                  className="text-brand-text-secondary hover:text-brand-primary transition"
                >
                  {isPersian ? 'فروشگاه' : 'Shop'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-brand-text-secondary hover:text-brand-primary transition"
                >
                  {isPersian ? 'درباره ما' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="text-brand-text-secondary hover:text-brand-primary transition"
                >
                  {isPersian ? 'تماس با ما' : 'Contact'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/blog`}
                  className="text-brand-text-secondary hover:text-brand-primary transition"
                >
                  {isPersian ? 'وبلاگ' : 'Blog'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-brand-text mb-4">
              {isPersian ? 'پشتیبانی' : 'Support'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href={`/${locale}/faq`}
                  className="text-brand-text-secondary hover:text-brand-primary transition"
                >
                  {isPersian ? 'سوالات متداول' : 'FAQ'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/shipping`}
                  className="text-brand-text-secondary hover:text-brand-primary transition"
                >
                  {isPersian ? 'ارسال و تحویل' : 'Shipping & Delivery'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/returns`}
                  className="text-brand-text-secondary hover:text-brand-primary transition"
                >
                  {isPersian ? 'بازگرداندن کالا' : 'Returns Policy'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/privacy`}
                  className="text-brand-text-secondary hover:text-brand-primary transition"
                >
                  {isPersian ? 'حریم خصوصی' : 'Privacy Policy'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-brand-text mb-4">
              {isPersian ? 'تماس با ما' : 'Contact Us'}
            </h4>
            <ul className="space-y-3 text-sm text-brand-text-secondary">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-brand-secondary flex-shrink-0 mt-0.5" />
                <span>support.alluracare@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-brand-secondary flex-shrink-0 mt-0.5" />
                <span>+98 (913) 123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-secondary flex-shrink-0 mt-0.5" />
                <span>{isPersian ? 'تهران، ایران' : 'Tehran, Iran'}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-brand-secondary/20">
        <div className="container-custom py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-brand-text-secondary">
            &copy; {new Date().getFullYear()} AlluraCare. {isPersian ? 'تمامی حقوق محفوظ است.' : 'All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
}