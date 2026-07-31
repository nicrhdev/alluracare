// src/components/common/Footer.tsx

'use client';

import Link from 'next/link';
import { Mail, MapPin, Phone, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const isPersian = locale === 'fa';
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const links = {
    shop: isPersian ? 'فروشگاه' : 'Shop',
    about: isPersian ? 'درباره ما' : 'About Us',
    contact: isPersian ? 'تماس با ما' : 'Contact',
    privacy: isPersian ? 'حریم خصوصی' : 'Privacy Policy',
    terms: isPersian ? 'قوانین و مقررات' : 'Terms & Conditions',
  };

  return (
    <footer className="bg-white border-t border-brand-secondary/20">
      {/* Main Footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-brand-primary" />
              <h3 className="text-xl font-bold text-brand-primary">AlluraCare</h3>
            </div>
            <p className="text-brand-text-secondary text-sm leading-relaxed max-w-xs">
              {isPersian
                ? 'مراقبت از پوست خود را با بهترین محصولات آغاز کنید'
                : 'Start your skincare journey with the best products'}
            </p>
            {/* Social Links - Text based */}
            <div className="flex items-center gap-4 mt-4">
              <Link
                href="#"
                className="text-sm text-brand-text-secondary hover:text-brand-primary transition duration-200"
              >
                Instagram
              </Link>
              <Link
                href="#"
                className="text-sm text-brand-text-secondary hover:text-brand-primary transition duration-200"
              >
                Facebook
              </Link>
              <Link
                href="#"
                className="text-sm text-brand-text-secondary hover:text-brand-primary transition duration-200"
              >
                Twitter
              </Link>
              <Link
                href="#"
                className="text-sm text-brand-text-secondary hover:text-brand-primary transition duration-200"
              >
                YouTube
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-brand-text mb-4">
              {isPersian ? 'لینک‌های سریع' : 'Quick Links'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href={`/${locale}/shop`}
                  className="text-brand-text-secondary hover:text-brand-primary transition duration-200"
                >
                  {links.shop}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-brand-text-secondary hover:text-brand-primary transition duration-200"
                >
                  {links.about}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="text-brand-text-secondary hover:text-brand-primary transition duration-200"
                >
                  {links.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-brand-text mb-4">
              {isPersian ? 'قوانین' : 'Legal'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href={`/${locale}/privacy`}
                  className="text-brand-text-secondary hover:text-brand-primary transition duration-200"
                >
                  {links.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/terms`}
                  className="text-brand-text-secondary hover:text-brand-primary transition duration-200"
                >
                  {links.terms}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="font-semibold text-brand-text mb-4">
              {isPersian ? 'تماس با ما' : 'Contact Us'}
            </h4>
            <ul className="space-y-2.5 text-sm text-brand-text-secondary">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-secondary flex-shrink-0" />
                <span>support@alluracare.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-secondary flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-brand-secondary flex-shrink-0" />
                <span>{isPersian ? 'تهران، ایران' : 'Tehran, Iran'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section - Centered with Info Bao style */}
        <div className="mt-12 pt-8 border-t border-brand-secondary/20">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-lg font-semibold text-brand-text mb-2">
              {isPersian ? 'عضویت در خبرنامه' : 'Join Our Newsletter'}
            </h4>
            <p className="text-sm text-brand-text-secondary mb-4">
              {isPersian
                ? 'از جدیدترین محصولات و تخفیف‌های ویژه مطلع شوید'
                : 'Stay updated with our latest products and exclusive offers'}
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isPersian ? 'ایمیل خود را وارد کنید' : 'Enter your email'}
                className="flex-1 px-4 py-2.5 border border-brand-secondary/40 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary bg-white text-brand-text placeholder-brand-text-secondary transition outline-none"
                required
              />
              <button
                type="submit"
                className="btn-primary py-2.5 px-6 whitespace-nowrap"
              >
                {subscribed
                  ? isPersian
                    ? '✅ ثبت شد!'
                    : '✅ Subscribed!'
                  : isPersian
                  ? 'عضویت'
                  : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar - Info Bao style */}
        <div className="mt-8 pt-6 border-t border-brand-secondary/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-brand-text-secondary">
            &copy; {new Date().getFullYear()} AlluraCare. {isPersian ? 'تمامی حقوق محفوظ است' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-6 text-xs text-brand-text-secondary">
            <Link href={`/${locale}/privacy`} className="hover:text-brand-primary transition">
              {isPersian ? 'حریم خصوصی' : 'Privacy'}
            </Link>
            <Link href={`/${locale}/terms`} className="hover:text-brand-primary transition">
              {isPersian ? 'قوانین' : 'Terms'}
            </Link>
            <Link href={`/${locale}/contact`} className="hover:text-brand-primary transition">
              {isPersian ? 'تماس' : 'Contact'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}