// src/components/common/Header.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Heart,
  ShoppingBag,
  User,
  Search,
  ChevronDown,
  LogIn,
  Globe,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/store/cartStore';
import CartDrawer from '@/components/cart/CartDrawer';

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
  { nameEn: 'Dark Spots', nameFa: 'لکه‌های تیره', slug: 'dark-spots' },
  { nameEn: 'Brightening & Dullness', nameFa: 'روشن‌کنندگی', slug: 'brightening-dullness' },
  { nameEn: 'Dry & Dehydrated', nameFa: 'پوست خشک', slug: 'dry-dehydrated' },
  { nameEn: 'Oily Skin', nameFa: 'پوست چرب', slug: 'oily-skin' },
  { nameEn: 'Sensitive Skin', nameFa: 'پوست حساس', slug: 'sensitive-skin' },
  { nameEn: 'Redness', nameFa: 'قرمزی و التهاب', slug: 'redness' },
  { nameEn: 'Large Pores', nameFa: 'منافذ باز', slug: 'large-pores' },
  { nameEn: 'Anti-Aging', nameFa: 'جوانسازی', slug: 'anti-aging' },
  { nameEn: 'Fine Lines & Wrinkles', nameFa: 'خطوط ریز', slug: 'fine-lines-wrinkles' },
  { nameEn: 'Loss of Firmness', nameFa: 'افتادگی پوست', slug: 'loss-of-firmness' },
];

export default function Header({ locale }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get cart items
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const isPersian = locale === 'fa';

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown with delay
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const handleMouseEnter = (dropdown: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpenDropdown(dropdown);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Close mobile menu on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
        setIsCartOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const isActive = (path: string) => {
    return pathname === `/${locale}${path}` || pathname?.startsWith(`/${locale}${path}`);
  };

  const getCategoryName = (cat: { nameEn: string; nameFa: string }) => {
    return isPersian ? cat.nameFa : cat.nameEn;
  };

  const getConcernName = (concern: { nameEn: string; nameFa: string }) => {
    return isPersian ? concern.nameFa : concern.nameEn;
  };

  const navLinks = [
    { href: '/shop', label: isPersian ? 'فروشگاه' : 'Shop' },
    { href: '/about', label: isPersian ? 'درباره ما' : 'About' },
  ];

  const megaMenuItems = [
    {
      id: 'categories',
      title: isPersian ? 'محصولات' : 'Products',
      items: categories,
      getLabel: getCategoryName,
      param: 'category',
    },
    {
      id: 'concerns',
      title: isPersian ? 'مشکلات پوستی' : 'Skin Concerns',
      items: concerns,
      getLabel: getConcernName,
      param: 'concern',
    },
  ];

  // Popular searches
  const popularSearches = isPersian
    ? ['سرم', 'مرطوب‌کننده', 'ضدآفتاب', 'پاک‌کننده']
    : ['Serum', 'Moisturizer', 'Sunscreen', 'Cleanser'];

  return (
    <>
      {/* Main Header */}
      <header className={`header-main ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 lg:h-20">
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

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 mx-4">
              {megaMenuItems.map((section) => (
                <div
                  key={section.id}
                  ref={dropdownRef}
                  className="mega-menu-trigger"
                  onMouseEnter={() => handleMouseEnter(section.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={`flex items-center gap-1 nav-link ${
                      openDropdown === section.id ? 'active' : ''
                    }`}
                    onClick={() =>
                      setOpenDropdown(openDropdown === section.id ? null : section.id)
                    }
                  >
                    {section.title}
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-300 ${
                        openDropdown === section.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {openDropdown === section.id && (
                    <div className="mega-menu-dropdown">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {section.items.map((item) => (
                          <Link
                            key={item.slug}
                            href={`/${locale}/shop?${section.param}=${item.slug}`}
                            className="block px-3 py-2 text-sm text-brand-text-secondary hover:text-brand-primary hover:bg-brand-pale-rose rounded-lg transition-all"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {section.getLabel(item)}
                          </Link>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-brand-secondary/10">
                        <Link
                          href={`/${locale}/shop`}
                          className="text-sm font-medium text-brand-primary hover:underline flex items-center gap-1"
                        >
                          {isPersian ? 'مشاهده همه محصولات' : 'View All Products'} →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={`/${locale}${link.href}`}
                  className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="header-action-btn"
                aria-label={isPersian ? 'جستجو' : 'Search'}
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                href={session ? `/${locale}/wishlist` : `/${locale}/login`}
                className="header-action-btn"
                aria-label={isPersian ? 'علاقه‌مندی‌ها' : 'Wishlist'}
              >
                <Heart className="w-5 h-5" />
              </Link>

              <Link
                href={session ? `/${locale}/account` : `/${locale}/login`}
                className="header-action-btn"
                aria-label={isPersian ? 'حساب کاربری' : 'Account'}
              >
                {session ? <User className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
              </Link>

              {/* Cart Button - Opens Drawer */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="header-action-btn"
                aria-label={isPersian ? 'سبد خرید' : 'Cart'}
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="badge">{totalItems > 99 ? '99+' : totalItems}</span>
                )}
              </button>

              <Link
                href={`/${locale === 'fa' ? 'en' : 'fa'}${pathname?.replace(/^\/[a-z]{2}/, '') || ''}`}
                className="lang-switcher"
              >
                <span className={locale === 'en' ? 'active' : ''}>EN</span>
                <span className="text-xs opacity-30">|</span>
                <span className={locale === 'fa' ? 'active' : ''}>FA</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2 text-brand-text-secondary hover:text-brand-primary transition rounded-lg hover:bg-brand-pale-rose"
              aria-label={isPersian ? 'باز کردن منو' : 'Open menu'}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div
        className={`mobile-nav-overlay ${isMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-nav-drawer ${isMenuOpen ? 'open' : ''}`}>
        {/* Close Button */}
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-4 left-4 p-2 text-brand-text-secondary hover:text-brand-primary transition rounded-lg hover:bg-brand-pale-rose z-10"
          aria-label={isPersian ? 'بستن منو' : 'Close menu'}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Mobile Logo - Centered */}
<div className="flex justify-center mb-3 pt-4">
  <Link
    href={`/${locale}`}
    onClick={() => setIsMenuOpen(false)}
  >
    <img
      src="/logo.png"
      alt="AlluraCare"
      className="h-8 md:h-10 w-auto object-contain"
    />
  </Link>
</div>

        {/* Language Switcher - Top Right */}
        <div className="flex items-center justify-end mb-3">
          <Link
            href={`/${locale === 'fa' ? 'en' : 'fa'}${pathname?.replace(/^\/[a-z]{2}/, '') || ''}`}
            className="lang-switcher text-sm flex items-center gap-1 px-3 py-1.5"
            onClick={() => setIsMenuOpen(false)}
          >
            <Globe className="w-3.5 h-3.5" />
            <span className={locale === 'en' ? 'active' : ''}>EN</span>
            <span className="text-xs opacity-30">|</span>
            <span className={locale === 'fa' ? 'active' : ''}>FA</span>
          </Link>
        </div>

        {/* Mobile Action Icons - Top Row with Animations */}
        <div className="grid grid-cols-4 gap-1 mb-4 p-2 bg-brand-pale-rose/20 rounded-xl">
          <button
            onClick={() => {
              setIsMenuOpen(false);
              setIsSearchOpen(true);
            }}
            className="mobile-icon-btn group"
            aria-label={isPersian ? 'جستجو' : 'Search'}
          >
            <div className="relative">
              <Search className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <span className="text-[10px] font-medium">{isPersian ? 'جستجو' : 'Search'}</span>
          </button>

          <Link
            href={session ? `/${locale}/wishlist` : `/${locale}/login`}
            className="mobile-icon-btn group"
            onClick={() => setIsMenuOpen(false)}
            aria-label={isPersian ? 'علاقه‌مندی‌ها' : 'Wishlist'}
          >
            <div className="relative">
              <Heart className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <span className="text-[10px] font-medium">{isPersian ? 'علاقه‌مندی‌ها' : 'Wishlist'}</span>
          </Link>

          <Link
            href={session ? `/${locale}/account` : `/${locale}/login`}
            className="mobile-icon-btn group"
            onClick={() => setIsMenuOpen(false)}
            aria-label={isPersian ? 'حساب کاربری' : 'Account'}
          >
            <div className="relative">
              {session ? (
                <User className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              ) : (
                <LogIn className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              )}
            </div>
            <span className="text-[10px] font-medium">
              {session ? (isPersian ? 'حساب' : 'Account') : isPersian ? 'ورود' : 'Login'}
            </span>
          </Link>

          {/* Mobile Cart Button */}
          <button
            onClick={() => {
              setIsMenuOpen(false);
              setIsCartOpen(true);
            }}
            className="mobile-icon-btn group"
            aria-label={isPersian ? 'سبد خرید' : 'Cart'}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white cart-badge">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{isPersian ? 'سبد خرید' : 'Cart'}</span>
          </button>
        </div>

        {/* Mobile Navigation Items - With padding for footer */}
        <nav className="mobile-nav-items">
          {/* Categories */}
          <div>
            <button
              className="mobile-nav-item w-full text-left flex items-center justify-between"
              onClick={() =>
                setOpenDropdown(openDropdown === 'mobile-categories' ? null : 'mobile-categories')
              }
            >
              <span>{isPersian ? 'دسته‌بندی‌ها' : 'Categories'}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  openDropdown === 'mobile-categories' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openDropdown === 'mobile-categories' && (
              <div className="mobile-sub-nav space-y-1">
                {megaMenuItems.map((section) => (
                  <div key={section.id}>
                    <div className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wider mt-3 mb-1">
                      {section.title}
                    </div>
                    {section.items.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/${locale}/shop?${section.param}=${item.slug}`}
                        className="mobile-nav-item"
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
                  className="block mt-3 text-sm font-medium text-brand-primary"
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
              className={`mobile-nav-item ${isActive(link.href) ? 'text-brand-primary' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Footer - Fixed at bottom */}
        <div className="mobile-footer">
          <div className="flex items-center justify-between">
            <Link
              href={session ? `/${locale}/account` : `/${locale}/login`}
              className="text-sm font-medium text-brand-text-secondary hover:text-brand-primary transition flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {session ? (
                <>
                  <User className="w-4 h-4" />
                  {isPersian ? 'حساب کاربری' : 'Account'}
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  {isPersian ? 'ورود / ثبت نام' : 'Login / Register'}
                </>
              )}
            </Link>

            <Link
              href={`/${locale === 'fa' ? 'en' : 'fa'}${pathname?.replace(/^\/[a-z]{2}/, '') || ''}`}
              className="lang-switcher text-sm flex items-center gap-1"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className={locale === 'en' ? 'active' : ''}>EN</span>
              <span className="text-xs opacity-30">|</span>
              <span className={locale === 'fa' ? 'active' : ''}>FA</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      <div
        className={`search-overlay ${isSearchOpen ? 'open' : ''}`}
        onClick={() => setIsSearchOpen(false)}
      >
        <div
          className="search-overlay-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="container-custom max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isPersian ? 'جستجوی محصولات...' : 'Search products...'}
                  className="w-full pl-12 pr-4 py-3 text-lg bg-transparent border-b-2 border-brand-secondary/30 focus:border-brand-primary outline-none transition-colors text-brand-text placeholder-brand-text-secondary"
                  autoFocus
                />
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-brand-text-secondary hover:text-brand-primary transition rounded-lg hover:bg-brand-pale-rose"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mt-6">
              <p className="text-sm text-brand-text-secondary mb-3">
                {isPersian ? 'جستجوهای محبوب:' : 'Popular searches:'}
              </p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    className="px-4 py-1.5 bg-brand-pale-rose/50 hover:bg-brand-pale-rose text-brand-text rounded-full text-sm transition-all hover:scale-105"
                    onClick={() => setSearchQuery(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* CART DRAWER - Added at the end of the JSX */}
      {/* ============================================ */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        locale={locale}
      />
    </>
  );
}