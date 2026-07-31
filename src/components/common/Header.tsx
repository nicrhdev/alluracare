// src/components/common/Header.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, X, Heart, ShoppingBag, User, Search,
  ChevronDown, Sparkles
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import CartIcon from './CartIcon';

interface HeaderProps {
  locale: string;
}

const categories = [
  { nameEn: 'Cleansers', nameFa: 'پاک‌کننده‌ها', slug: 'cleansers' },
  { nameEn: 'Moisturizers', nameFa: 'مرطوب‌کننده‌ها', slug: 'moisturizers' },
  { nameEn: 'Serums', nameFa: 'سرم‌ها', slug: 'serums' },
  { nameEn: 'Sunscreens', nameFa: 'ضدآفتاب‌ها', slug: 'sunscreens' },
  { nameEn: 'Eye Creams', nameFa: 'کرم‌های دور چشم', slug: 'eye-creams' },
  { nameEn: 'Masks', nameFa: 'ماسک‌ها', slug: 'masks' },
  { nameEn: 'Toners', nameFa: 'تونرها', slug: 'toners' },
  { nameEn: 'Body Care', nameFa: 'مراقبت از بدن', slug: 'body-care' },
  { nameEn: 'Hair Care', nameFa: 'مراقبت از مو', slug: 'hair-care' },
];

const concerns = [
  { nameEn: 'Acne & Breakouts', nameFa: 'آکنه و جوش', slug: 'acne-breakouts' },
  { nameEn: 'Acne Scars', nameFa: 'جای جوش', slug: 'acne-scars' },
  { nameEn: 'Dark Spots & Hyperpigmentation', nameFa: 'لکه‌های تیره و هایپرپیگمنتیشن', slug: 'dark-spots' },
  { nameEn: 'Brightening & Dullness', nameFa: 'روشن‌کنندگی و رفع کدری', slug: 'brightening-dullness' },
  { nameEn: 'Dry & Dehydrated Skin', nameFa: 'پوست خشک و دهیدراته', slug: 'dry-dehydrated' },
  { nameEn: 'Oily Skin', nameFa: 'پوست چرب', slug: 'oily-skin' },
  { nameEn: 'Sensitive Skin', nameFa: 'پوست حساس', slug: 'sensitive-skin' },
  { nameEn: 'Redness', nameFa: 'قرمزی و التهاب', slug: 'redness' },
  { nameEn: 'Large Pores', nameFa: 'منافذ باز', slug: 'large-pores' },
  { nameEn: 'Blackheads & Whiteheads', nameFa: 'جوش سرسیاه و سرسفید', slug: 'blackheads-whiteheads' },
  { nameEn: 'Anti-Aging', nameFa: 'جوانسازی', slug: 'anti-aging' },
  { nameEn: 'Fine Lines & Wrinkles', nameFa: 'خطوط ریز و چین و چروک', slug: 'fine-lines-wrinkles' },
  { nameEn: 'Loss of Firmness', nameFa: 'افتادگی پوست', slug: 'loss-of-firmness' },
  { nameEn: 'Skin Barrier Repair', nameFa: 'ترمیم سد دفاعی پوست', slug: 'skin-barrier-repair' },
  { nameEn: 'Uneven Texture', nameFa: 'بافت ناهموار', slug: 'uneven-texture' },
];

export default function Header({ locale }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { data: session } = useSession();
  const t = useTranslations('navigation');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isPersian = locale === 'fa';

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown with delay to allow moving to it
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpenDropdown('categories');
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const isActive = (path: string) => {
    return pathname === `/${locale}${path}` || pathname?.startsWith(`/${locale}${path}`);
  };

  const navLinks = [
    { href: '/shop', label: t('shop') },
    { href: '/about', label: t('about') },
  ];

  const getCategoryName = (cat: { nameEn: string; nameFa: string }) => {
    return isPersian ? cat.nameFa : cat.nameEn;
  };

  const getConcernName = (concern: { nameEn: string; nameFa: string }) => {
    return isPersian ? concern.nameFa : concern.nameEn;
  };

  const megaMenuItems = [
    {
      title: isPersian ? 'محصولات' : 'Products',
      items: categories,
      getLabel: getCategoryName,
      param: 'category'
    },
    {
      title: isPersian ? 'مشکلات پوستی' : 'Skin Concerns',
      items: concerns,
      getLabel: getConcernName,
      param: 'concern'
    },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-soft border-b border-brand-secondary/20'
          : 'bg-white/80 backdrop-blur-sm border-b border-brand-secondary/10'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 text-xl font-bold text-brand-primary hover:text-brand-hover transition group"
          >
            <Sparkles className="w-5 h-5 text-brand-primary group-hover:rotate-12 transition-transform duration-300" />
            <span>AlluraCare</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {/* Categories with Mega Menu */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-1 text-sm font-medium transition ${
                  openDropdown === 'categories'
                    ? 'text-brand-primary'
                    : 'text-brand-text-secondary hover:text-brand-primary'
                }`}
                onClick={() => setOpenDropdown(openDropdown === 'categories' ? null : 'categories')}
              >
                {isPersian ? 'دسته‌بندی‌ها' : 'Categories'}
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${
                  openDropdown === 'categories' ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Mega Menu Dropdown */}
              {openDropdown === 'categories' && (
                <div className="absolute top-full left-0 mt-2 w-[600px] bg-white rounded-2xl shadow-hover border border-brand-secondary/20 p-6 animate-fade-in">
                  <div className="grid grid-cols-2 gap-8">
                    {megaMenuItems.map((section) => (
                      <div key={section.title}>
                        <h4 className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wider mb-3">
                          {section.title}
                        </h4>
                        <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
                          {section.items.map((item) => (
                            <li key={item.slug}>
                              <Link
                                href={`/${locale}/shop?${section.param}=${item.slug}`}
                                className="text-sm text-brand-text-secondary hover:text-brand-primary transition block py-0.5"
                                onClick={() => setOpenDropdown(null)}
                              >
                                {section.getLabel(item)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-brand-secondary/10">
                    <Link
                      href={`/${locale}/shop`}
                      className="text-sm text-brand-primary hover:underline flex items-center gap-1"
                    >
                      {isPersian ? 'مشاهده همه محصولات' : 'View All Products'} →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className={`text-sm font-medium transition ${
                  isActive(link.href)
                    ? 'text-brand-primary'
                    : 'text-brand-text-secondary hover:text-brand-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-brand-text-secondary hover:text-brand-primary transition rounded-full hover:bg-brand-pale-rose"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            {session && (
              <Link
                href={`/${locale}/wishlist`}
                className="p-2 text-brand-text-secondary hover:text-brand-primary transition rounded-full hover:bg-brand-pale-rose"
              >
                <Heart className="w-5 h-5" />
              </Link>
            )}

            {/* Account */}
            <Link
              href={session ? `/${locale}/account` : `/${locale}/login`}
              className="p-2 text-brand-text-secondary hover:text-brand-primary transition rounded-full hover:bg-brand-pale-rose"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <CartIcon locale={locale} />

            {/* Language Switcher */}
            <Link
              href={`/${locale === 'fa' ? 'en' : 'fa'}${pathname?.replace(/^\/[a-z]{2}/, '') || ''}`}
              className="text-xs text-brand-text-secondary hover:text-brand-primary transition px-3 py-1 rounded-full hover:bg-brand-pale-rose font-medium"
            >
              {locale === 'fa' ? 'EN' : 'FA'}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-brand-text-secondary hover:text-brand-primary transition rounded-lg hover:bg-brand-pale-rose"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-brand-secondary/20 py-4 px-4 space-y-1 animate-slide-in max-h-[80vh] overflow-y-auto">
          {/* Categories with submenu */}
          <div className="space-y-1">
            <button
              className="flex items-center justify-between w-full py-2 text-sm font-medium text-brand-text hover:text-brand-primary transition"
              onClick={() => setOpenDropdown(openDropdown === 'mobile-categories' ? null : 'mobile-categories')}
            >
              {isPersian ? 'دسته‌بندی‌ها' : 'Categories'}
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                openDropdown === 'mobile-categories' ? 'rotate-180' : ''
              }`} />
            </button>
            {openDropdown === 'mobile-categories' && (
              <div className="pl-4 space-y-2 pb-2 animate-fade-in">
                {megaMenuItems.map((section) => (
                  <div key={section.title}>
                    <h4 className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wider mt-2 mb-1">
                      {section.title}
                    </h4>
                    {section.items.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/${locale}/shop?${section.param}=${item.slug}`}
                        className="block py-1 text-sm text-brand-text-secondary hover:text-brand-primary transition"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setOpenDropdown(null);
                        }}
                      >
                        {section.getLabel(item)}
                      </Link>
                    ))}
                  </div>
                ))}
                <Link
                  href={`/${locale}/shop`}
                  className="block py-1 text-sm text-brand-primary font-medium"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setOpenDropdown(null);
                  }}
                >
                  {isPersian ? 'مشاهده همه محصولات' : 'View All Products'} →
                </Link>
              </div>
            )}
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={`/${locale}${link.href}`}
              className={`block py-2 text-sm font-medium transition ${
                isActive(link.href)
                  ? 'text-brand-primary'
                  : 'text-brand-text-secondary hover:text-brand-primary'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-4 mt-4 border-t border-brand-secondary/20 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-brand-text-secondary hover:text-brand-primary transition"
            >
              <Search className="w-5 h-5" />
            </button>
            {session && (
              <Link
                href={`/${locale}/wishlist`}
                className="text-brand-text-secondary hover:text-brand-primary transition"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="w-5 h-5" />
              </Link>
            )}
            <Link
              href={session ? `/${locale}/account` : `/${locale}/login`}
              className="text-brand-text-secondary hover:text-brand-primary transition"
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="w-5 h-5" />
            </Link>
            <CartIcon locale={locale} />
            <Link
              href={`/${locale === 'fa' ? 'en' : 'fa'}${pathname?.replace(/^\/[a-z]{2}/, '') || ''}`}
              className="text-sm text-brand-text-secondary hover:text-brand-primary transition"
              onClick={() => setIsMenuOpen(false)}
            >
              {locale === 'fa' ? 'English' : 'فارسی'}
            </Link>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white/95 backdrop-blur-md shadow-hover">
            <div className="container-custom py-6">
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder={isPersian ? 'جستجوی محصولات...' : 'Search products...'}
                  className="flex-1 text-lg bg-transparent border-none focus:outline-none text-brand-text placeholder-brand-text-secondary"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 text-brand-text-secondary hover:text-brand-primary transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="mt-4 text-sm text-brand-text-secondary">
                <p>{isPersian ? 'جستجوهای محبوب:' : 'Popular searches:'}</p>
                <div className="flex flex-wrap gap-3 mt-2">
                  <span className="px-3 py-1 bg-brand-pale-rose rounded-full text-brand-text text-sm">Serum</span>
                  <span className="px-3 py-1 bg-brand-pale-rose rounded-full text-brand-text text-sm">Moisturizer</span>
                  <span className="px-3 py-1 bg-brand-pale-rose rounded-full text-brand-text text-sm">Sunscreen</span>
                  <span className="px-3 py-1 bg-brand-pale-rose rounded-full text-brand-text text-sm">Cleanser</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}