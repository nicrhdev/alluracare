// src/app/[locale]/page.tsx

import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma/client';
import HeroSlideshow from '@/components/home/HeroSlideshow';
import CategoryGrid from '@/components/home/CategoryGrid';
import ProductGrid from '@/components/home/ProductGrid';
import FeaturedBrands from '@/components/home/FeaturedBrands';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import SkincareQuiz from '@/components/home/SkincareQuiz';
import ReviewCarousel from '@/components/home/ReviewCarousel';
import BlogPreview from '@/components/home/BlogPreview';
import FAQAccordion from '@/components/home/FAQAccordion';
import Newsletter from '@/components/home/Newsletter';
import InstagramGallery from '@/components/home/InstagramGallery';

interface CategoryWithCount {
  id: string;
  nameEn: string;
  nameFa: string;
  slug: string;
  image: string | null;
  productCount?: number;
  products: { id: string }[];
  [key: string]: any;
}
interface HomePageProps {
  params: Promise<{
    locale: string;
  }>;
}

// Sample FAQ data
const faqData = [
  {
    id: '1',
    questionEn: 'What is the best skincare routine for my skin type?',
    questionFa: 'بهترین روتین مراقبت از پوست برای نوع پوست من چیست؟',
    answerEn: 'The best routine depends on your skin type. Generally, it includes cleansing, toning, moisturizing, and sun protection. Our skin quiz can help you find the perfect routine.',
    answerFa: 'بهترین روتین به نوع پوست شما بستگی دارد. یک روتین مراقبتی به طور کلی شامل پاکسازی، مرطوب‌کنندگی و محافظت در برابر آفتاب است، اما با توجه به نوع پوست و مشکلات پوستی مختص به شما ممکن است به استفاده از محصولات درمانی نیز نیاز داشته باشید. تست پوست ما می‌تواند به شما در پیدا کردن روتین مناسب کمک کند.',
  },
  {
    id: '3',
    questionEn: 'How long does shipping take?',
    questionFa: 'ارسال چقدر طول می‌کشد؟',
    answerEn: 'Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days.',
    answerFa: 'ارسال معمولی ۳-۵ روز کاری طول می‌کشد. اما امکان ارسال سریع در ۱-۲ روز کاری نیز در دسترس است.',
  },
  {
    id: '5',
    questionEn: 'What is your return policy?',
    questionFa: 'روند عودت کالا به چه صورت است؟',
    answerEn: 'We offer a 30-day return policy for all products. Simply contact our support team to initiate a return.',
    answerFa: 'ما سیاست عودت وجه ۳۰ روزه برای تمام محصولات داریم. شما می‌توانید با تماس با تیم پشتیبانی ما از شرایط بازگرداندن کالا آگاه شوید و فرآیند بازگشت کالا را انجام بدهید.',
  },
];

// Sample Instagram posts
const instagramPosts = [
  { id: '1', image: '/images/insta-1.jpg', likes: 1234, comments: 56, url: '#' },
  { id: '2', image: '/images/insta-2.jpg', likes: 892, comments: 34, url: '#' },
  { id: '3', image: '/images/insta-3.jpg', likes: 2100, comments: 89, url: '#' },
  { id: '4', image: '/images/insta-4.jpg', likes: 1567, comments: 67, url: '#' },
  { id: '5', image: '/images/insta-5.jpg', likes: 945, comments: 42, url: '#' },
  { id: '6', image: '/images/insta-6.jpg', likes: 1876, comments: 73, url: '#' },
  { id: '7', image: '/images/insta-7.jpg', likes: 1123, comments: 51, url: '#' },
  { id: '8', image: '/images/insta-8.jpg', likes: 2345, comments: 98, url: '#' },
];

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations('home');
  const isPersian = locale === 'fa';

  // Fetch data
  const heroSlides = await prisma.heroSlide.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    include: {
      products: {
        where: { isActive: true, status: 'PUBLISHED' },
        select: { id: true },
      },
    },
  });

  // Format categories with product count
  const categoriesWithCount = categories.map((cat: CategoryWithCount) => ({
  ...cat,
  productCount: cat.products.length,
}));

  // Fetch products for "New Arrivals"
  const newArrivals = await prisma.product.findMany({
    where: { isActive: true, status: 'PUBLISHED' },
    include: {
      variants: true,
      category: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 8,
  });

  // Fetch products for "Best Sellers" (most ordered)
  const bestSellers = await prisma.product.findMany({
    where: { isActive: true, status: 'PUBLISHED' },
    include: {
      variants: true,
      category: true,
    },
    orderBy: { createdAt: 'desc' }, // Replace with actual order count logic
    take: 8,
  });

  // Fetch Sale Products
const saleProducts = await prisma.product.findMany({
  where: {
    isActive: true,
    status: 'PUBLISHED',
    variants: {
      some: {
        discountPercent: {
          gt: 0, // Any product with discount > 0
        },
      },
    },
  },
  include: {
    variants: true,
    category: true,
  },
  take: 8,
});

  const brands = [
  { id: '1', name: 'Anua', slug: 'anua', logo: '/images/brand-1.png' },
  { id: '2', name: 'Beauty of Joseon', slug: 'beauty-of-joseon', logo: '/images/brand-2.png' },
  { id: '3', name: 'SKIN1004', slug: 'skin-1004', logo: '/images/brand-3.png' },
  { id: '4', name: 'Medicube', slug: 'medicube', logo: '/images/brand-4.png' },
  { id: '5', name: 'AXIS-Y', slug: 'axis-y', logo: '/images/brand-5.png' },
  { id: '6', name: 'Dr.Althea', slug: 'dr-althea', logo: '/images/brand-6.png' },
  { id: '7', name: 'COSRX', slug: 'cosrx', logo: '/images/brand-7.png' },
  { id: '8', name: 'LANEIGE', slug: 'laneige', logo: '/images/brand-8.png' },
  { id: '9', name: 'TOCOBO', slug: 'tocobo', logo: '/images/brand-9.png' },
  { id: '10', name: 'Purito', slug: 'purito', logo: '/images/brand-10.png' },
  { id: '11', name: 'numbuzin', slug: 'numbuzin', logo: '/images/brand-11.png' },
  { id: '12', name: 'The Ordinary', slug: 'the-ordinary', logo: '/images/brand-12.png' },
  { id: '13', name: 'K-SECRET', slug: 'k-secret', logo: '/images/brand-13.png' },
  { id: '14', name: 'SOME BY MI', slug: 'some-by-mi', logo: '/images/brand-14.png' },
  { id: '15', name: 'La Roche-Posay', slug: 'la-roche-posay', logo: '/images/brand-15.png' },
  { id: '16', name: 'Arencia', slug: 'arencia', logo: '/images/brand-16.png' },
];


  // Sample reviews - replace with actual reviews from database
  const reviews = [
    {
      id: '1',
      name: 'Sarah M.',
      rating: 5,
      textEn: 'Absolutely love this product! My skin has never felt better.',
      textFa: 'واقعاً عاشق این محصول شدم! پوست من هرگز اینقدر خوب نبوده.',
      date: '2024-01-15',
    },
    {
      id: '2',
      name: 'Jessica K.',
      rating: 5,
      textEn: 'The best skincare routine I\'ve ever had. Highly recommend!',
      textFa: 'بهترین روتین مراقبت از پوستی که تا به حال داشته‌ام. به شدت توصیه می‌کنم!',
      date: '2024-01-20',
    },
    {
      id: '3',
      name: 'Emily R.',
      rating: 4,
      textEn: 'Great quality products that actually work. Will buy again.',
      textFa: 'محصولات با کیفیت عالی که واقعاً کار می‌کنند. دوباره خرید خواهم کرد.',
      date: '2024-02-01',
    },
  ];

  // Sample blog posts - replace with actual blog posts from database
  const blogPosts = [
    {
      id: '1',
      titleEn: 'The Ultimate Guide to Korean Skincare',
      titleFa: 'راهنمای جامع مراقبت از پوست کرهای',
      slug: 'ultimate-guide-korean-skincare',
      excerptEn: 'Discover the secrets of K-beauty and how to achieve that glass skin glow.',
      excerptFa: 'اسرار زیبایی کرهای و چگونه به درخشش پوست شیشه‌ای دست پیدا کنید.',
      image: '/images/blog-1.jpg',
      categoryEn: 'Skincare',
      categoryFa: 'مراقبت از پوست',
      date: '2024-02-10',
      readTime: 5,
    },
    {
      id: '2',
      titleEn: 'Understanding Your Skin Type',
      titleFa: 'شناخت نوع پوست شما',
      slug: 'understanding-skin-type',
      excerptEn: 'Learn how to identify your skin type and choose the right products.',
      excerptFa: 'یاد بگیرید چگونه نوع پوست خود را شناسایی کنید و محصولات مناسب را انتخاب کنید.',
      image: '/images/blog-2.jpg',
      categoryEn: 'Education',
      categoryFa: 'آموزشی',
      date: '2024-02-15',
      readTime: 4,
    },
    {
      id: '3',
      titleEn: 'The Benefits of Vitamin C for Skin',
      titleFa: 'فواید ویتامین C برای پوست',
      slug: 'benefits-vitamin-c-skin',
      excerptEn: 'Discover why Vitamin C is a must-have in your skincare routine.',
      excerptFa: 'کشف کنید چرا ویتامین C یک ضرورت در روتین مراقبت از پوست شماست.',
      image: '/images/blog-3.jpg',
      categoryEn: 'Ingredients',
      categoryFa: 'مواد تشکیل‌دهنده',
      date: '2024-02-20',
      readTime: 6,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <HeroSlideshow slides={heroSlides} locale={locale} />

      {/* Categories */}
      <CategoryGrid categories={categoriesWithCount} locale={locale} />

      {/* New Arrivals */}
      <ProductGrid
        products={newArrivals}
        locale={locale}
        title={isPersian ? 'محصولات جدید' : 'New Arrivals'}
        subtitle={isPersian
          ? 'جدیدترین محصولات اضافه شده به فروشگاه'
          : 'The latest products added to our store'}
        viewAllLink={`/${locale}/shop`}
        showBadge
        badgeText={isPersian ? 'جدید' : 'New'}
      />

      {/* Best Sellers */}
      <ProductGrid
        products={bestSellers}
        locale={locale}
        title={isPersian ? 'پرفروش‌ترین‌ها' : 'Best Sellers'}
        subtitle={isPersian
          ? 'محصولات محبوب و پرطرفدار مشتریان'
          : 'Our customers\' favorite products'}
        viewAllLink={`/${locale}/shop`}
      />

      {/* Sale */}
      {saleProducts.length > 0 && (
      <ProductGrid
    products={saleProducts}
    locale={locale}
    title={isPersian ? 'تخفیف‌های ویژه' : 'Sale'}
    subtitle={isPersian
      ? 'محصولات با تخفیف ویژه'
      : 'Products with special discounts'}
    viewAllLink={`/${locale}/shop`}
        showBadge={false}
    badgeText={isPersian ? 'تخفیف' : 'SALE'}
  />
)}

      {/* Featured Brands */}
      <FeaturedBrands brands={brands} locale={locale} />

      {/* Why Choose Us */}
      <WhyChooseUs locale={locale} />

      {/* Skincare Quiz */}
      <SkincareQuiz locale={locale} />

      {/* Blog Preview */}
      <BlogPreview posts={blogPosts} locale={locale} />

      {/* FAQ */}
      <FAQAccordion faqs={faqData} locale={locale} />

      {/* Instagram Gallery */}
      <InstagramGallery posts={instagramPosts} locale={locale} />

      {/* Newsletter */}
      <Newsletter locale={locale} />
    </div>
  );
}