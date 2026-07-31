// src/app/[locale]/page.tsx

import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma/client';
import Link from 'next/link';
import { ArrowRight, Sparkles, Star, Shield, Truck, Leaf, Heart } from 'lucide-react';
import HeroSlideshow from '@/components/home/HeroSlideshow';

interface HomePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations('home');

  const isPersian = locale === 'fa';

  // Fetch active hero slides
  const heroSlides = await prisma.heroSlide.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });

  // Fetch new arrivals (newest products first)
  const newArrivals = await prisma.product.findMany({
    where: {
      isActive: true,
      status: 'PUBLISHED',
    },
    include: {
      variants: true,
      category: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 4,
  });

  // Fetch categories
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    take: 6,
  });

  // Fetch concerns with product counts
  const concerns = await prisma.concern.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    include: {
      products: {
        select: {
          productId: true,
        },
      },
    },
  });

  // Get product counts for each concern
  const concernsWithCounts = concerns.map((concern) => ({
    ...concern,
    productCount: concern.products.length,
  }));

  // Concerns icons mapping
  const concernIcons: Record<string, string> = {
    'acne-breakouts': '🧊',
    'acne-scars': '🔬',
    'dark-spots': '☀️',
    'brightening-dullness': '✨',
    'dry-dehydrated': '💧',
    'oily-skin': '💫',
    'sensitive-skin': '🫧',
    redness: '🌸',
    'large-pores': '🔍',
    'blackheads-whiteheads': '⚫',
    'anti-aging': '🌟',
    'fine-lines-wrinkles': '📏',
    'loss-of-firmness': '🌊',
    'skin-barrier-repair': '🛡️',
    'uneven-texture': '🌀',
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  // Why Choose Us data
  const whyChooseUs = [
    {
      icon: Leaf,
      titleEn: '100% Natural',
      titleFa: '۱۰۰٪ طبیعی',
      descEn: 'Made with the finest natural ingredients',
      descFa: 'ساخته شده با بهترین مواد طبیعی',
    },
    {
      icon: Heart,
      titleEn: 'Cruelty-Free',
      titleFa: 'بدون تست روی حیوانات',
      descEn: 'Never tested on animals',
      descFa: 'هرگز روی حیوانات تست نشده',
    },
    {
      icon: Shield,
      titleEn: 'Quality Guaranteed',
      titleFa: 'کیفیت تضمینی',
      descEn: 'Premium quality products',
      descFa: 'محصولات با کیفیت برتر',
    },
    {
      icon: Truck,
      titleEn: 'Fast Shipping',
      titleFa: 'ارسال سریع',
      descEn: 'Free shipping on orders over $50',
      descFa: 'ارسال رایگان برای سفارش‌های بالای ۵۰ دلار',
    },
  ];

  // Sample reviews
  const reviews = [
    {
      name: 'Sarah M.',
      rating: 5,
      textEn: 'Absolutely love this product! My skin has never felt better.',
      textFa: 'واقعاً عاشق این محصول شدم! پوست من هرگز اینقدر خوب نبوده.',
    },
    {
      name: 'Jessica K.',
      rating: 5,
      textEn: 'The best skincare routine I\'ve ever had. Highly recommend!',
      textFa: 'بهترین روتین مراقبت از پوستی که تا به حال داشته‌ام. به شدت توصیه می‌کنم!',
    },
    {
      name: 'Emily R.',
      rating: 4,
      textEn: 'Great quality products that actually work. Will buy again.',
      textFa: 'محصولات با کیفیت عالی که واقعاً کار می‌کنند. دوباره خرید خواهم کرد.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Slideshow */}
      <HeroSlideshow slides={heroSlides} locale={locale} />

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 bg-brand-background">
          <div className="container-custom">
            <div className="section-header animate-fade-up">
              <span className="text-sm font-medium text-brand-primary bg-brand-pale-rose px-3 py-1 rounded-full inline-block">
                {isPersian ? 'دسته‌بندی‌ها' : 'Categories'}
              </span>
              <h2>
                {isPersian ? 'دسته‌بندی محصولات' : 'Shop by'}
                <span className="highlight"> {isPersian ? 'محصولات' : 'Category'}</span>
              </h2>
              <p className="subtitle">
                {isPersian ? 'محصولات را بر اساس دسته‌بندی مرور کنید' : 'Browse products by category'}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <Link
                  key={category.id}
                  href={`/${locale}/shop?category=${category.slug}`}
                  className="group bg-white rounded-xl p-6 text-center transition-all hover:shadow-soft-hover hover:-translate-y-2 border border-brand-secondary/10 animate-stagger-fade"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">✨</div>
                  <h3 className="text-sm font-medium text-brand-text group-hover:text-brand-primary transition">
                    {isPersian ? category.nameFa : category.nameEn}
                  </h3>
                  <p className="text-xs text-brand-text-secondary mt-1">
                    {isPersian ? 'مشاهده' : 'View'}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skin Concerns Section */}
      {concernsWithCounts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="section-header animate-fade-up">
              <span className="text-sm font-medium text-brand-primary bg-brand-pale-rose px-3 py-1 rounded-full inline-block">
                {isPersian ? 'مشکلات پوستی' : 'Skin Concerns'}
              </span>
              <h2>
                {isPersian ? 'بر اساس' : 'Shop by'}
                <span className="highlight"> {isPersian ? 'مشکلات پوستی' : 'Skin Concern'}</span>
              </h2>
              <p className="subtitle">
                {isPersian
                  ? 'محصولات مناسب برای نیازهای خاص پوست خود را پیدا کنید'
                  : 'Find products tailored to your specific skin needs'}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {concernsWithCounts.map((concern, index) => {
                const icon = concernIcons[concern.slug] || '🌸';
                const name = isPersian ? concern.nameFa : concern.nameEn;

                return (
                  <Link
                    key={concern.id}
                    href={`/${locale}/shop?concern=${concern.slug}`}
                    className="group relative bg-gradient-to-br from-brand-pale-rose/30 to-brand-light/30 rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-soft-hover hover:-translate-y-2 border border-brand-secondary/10 overflow-hidden animate-stagger-fade"
                    style={{ animationDelay: `${index * 0.06}s` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 relative z-10">
                      {icon}
                    </div>
                    <h3 className="text-sm font-semibold text-brand-text group-hover:text-brand-primary transition relative z-10">
                      {name}
                    </h3>
                    <p className="text-xs text-brand-text-secondary mt-1 relative z-10">
                      {concern.productCount}{' '}
                      {isPersian ? 'محصول' : 'products'}
                    </p>
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-brand-pale-rose/20 group-hover:scale-150 transition-transform duration-500"></div>
                  </Link>
                );
              })}
            </div>

            <div className="text-center mt-10">
              <Link
                href={`/${locale}/shop`}
                className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-hover font-medium transition group"
              >
                {isPersian ? 'مشاهده همه محصولات' : 'View All Products'}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className="py-16 bg-brand-background">
          <div className="container-custom">
            <div className="section-header animate-fade-up">
              <span className="text-sm font-medium text-brand-primary bg-brand-pale-rose px-3 py-1 rounded-full inline-block">
                {isPersian ? 'جدید' : 'New'}
              </span>
              <h2>
                {isPersian ? 'محصولات' : 'New'}
                <span className="highlight"> {isPersian ? 'جدید' : 'Arrivals'}</span>
              </h2>
              <p className="subtitle">
                {isPersian
                  ? 'جدیدترین محصولات添加到 فروشگاه'
                  : 'The latest products added to our store'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product, index) => {
                const lowestPrice = Math.min(...product.variants.map((v) => v.price));
                const productImage = product.images?.[0] || null;

                return (
                  <Link
                    key={product.id}
                    href={`/${locale}/product/${product.slug}`}
                    className="product-card group animate-stagger-fade"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="product-image">
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={isPersian ? product.nameFa : product.nameEn}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl">
                          🧴
                        </div>
                      )}
                      <div className="image-overlay"></div>
                      <div className="absolute top-3 left-3 z-10">
                        <span className="badge badge-gold text-xs">
                          {isPersian ? 'جدید' : 'New'}
                        </span>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="bg-white/90 backdrop-blur-sm text-brand-primary text-sm font-medium px-4 py-2 rounded-full shadow-soft">
                          {isPersian ? 'مشاهده محصول' : 'View Product'}
                        </span>
                      </div>
                    </div>
                    <div className="product-info">
                      <h3 className="product-name group-hover:text-brand-primary transition">
                        {isPersian ? product.nameFa : product.nameEn}
                      </h3>
                      <p className="product-brand">{product.brand}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="product-price">{formatPrice(lowestPrice)}</span>
                        <span className="text-xs text-brand-text-secondary bg-brand-pale-rose px-2 py-1 rounded-full">
                          {isPersian ? product.category.nameFa : product.category.nameEn}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="text-center mt-10">
              <Link href={`/${locale}/shop`} className="btn-primary group">
                {isPersian ? 'مشاهده همه محصولات' : 'View All Products'}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="section-header animate-fade-up">
            <span className="text-sm font-medium text-brand-primary bg-brand-pale-rose px-3 py-1 rounded-full inline-block">
              {isPersian ? 'چرا ما؟' : 'Why Us'}
            </span>
            <h2>
              {isPersian ? 'چرا' : 'Why'}
              <span className="highlight"> {isPersian ? 'آلوراکیـر' : 'AlluraCare'}</span>
            </h2>
            <p className="subtitle">
              {isPersian
                ? 'ما به کیفیت و مراقبت از پوست شما اهمیت می‌دهیم'
                : 'We care about quality and your skin'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {whyChooseUs.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-2xl bg-brand-pale-rose/20 hover:bg-brand-pale-rose/40 transition-all duration-300 animate-stagger-fade"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-brand-primary" />
                  </div>
                  <h3 className="font-semibold text-brand-text text-sm">
                    {isPersian ? item.titleFa : item.titleEn}
                  </h3>
                  <p className="text-xs text-brand-text-secondary mt-1">
                    {isPersian ? item.descFa : item.descEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 bg-brand-background">
        <div className="container-custom">
          <div className="section-header animate-fade-up">
            <span className="text-sm font-medium text-brand-primary bg-brand-pale-rose px-3 py-1 rounded-full inline-block">
              {isPersian ? 'نظرات مشتریان' : 'Reviews'}
            </span>
            <h2>
              {isPersian ? 'نظرات' : 'What Our'}
              <span className="highlight"> {isPersian ? 'مشتریان' : 'Customers Say'}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-soft border border-brand-secondary/10 animate-stagger-fade"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'fill-current text-yellow-400' : 'text-slate-200'}`}
                    />
                  ))}
                </div>
                <p className="text-brand-text-secondary text-sm italic">
                  "{isPersian ? review.textFa : review.textEn}"
                </p>
                <p className="text-sm font-medium text-brand-text mt-3">
                  — {review.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-primary text-white">
        <div className="container-custom text-center">
          <div className="max-w-2xl mx-auto animate-fade-up">
            <h2 className="text-3xl font-bold mb-2">
              {isPersian ? 'عضویت در خبرنامه' : 'Join Our Newsletter'}
            </h2>
            <p className="text-white/80 mb-6">
              {isPersian
                ? 'از جدیدترین محصولات و تخفیف‌های ویژه مطلع شوید'
                : 'Stay updated with our latest products and exclusive offers'}
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder={isPersian ? 'ایمیل خود را وارد کنید' : 'Enter your email'}
                className="flex-1 px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-brand-primary rounded-xl font-medium hover:bg-white/90 transition"
              >
                {isPersian ? 'عضویت' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}