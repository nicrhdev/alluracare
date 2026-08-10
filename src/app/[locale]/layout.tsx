// src/app/[locale]/layout.tsx

import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import AuthProvider from '@/components/providers/AuthProvider';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import AnnouncementBar from '@/components/common/AnnouncementBar';
import PageTransition from '@/components/providers/PageTransition';
import AIAssistant from '@/components/common/AIAssistant';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

// Persian-first metadata
export async function generateMetadata({ params }: RootLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const isPersian = locale === 'fa';

  // Persian SEO
  const persianMetadata = {
    title: {
      default: 'آلوراکـر | مراقبت از پوست با کیفیت بالا',
      template: '%s | آلوراکـر',
    },
    description: 'بهترین محصولات مراقبت از پوست کره ای و اروپایی با کیفیت و ضمانت اصالت. خرید محصولات مراقبتی و بهداشتی با کیفیت و ارسال رایگان برای سفارش‌های بالای ۳ میلیون تومان.',
    keywords: [
      'مراقبت از پوست',
      'محصولات آرایشی',
      'پوست',
      'آرایشی',
      'بهداشتی',
      'طبیعی',
      'کرم',
      'سرم',
      'ضدآفتاب',
      'ماسک صورت',
      'روتین پوست',
      'پوست خشک',
      'پوست چرب',
      'پوست حساس',
      'آلوراکـر',
      'AlluraCare',
      'مراقبت از پوست کره ای',
      'Korean skincare',
    ],
    openGraph: {
      title: 'آلوراکـر | مراقبت از پوست با کیفیت بالا',
      description: 'بهترین محصولات مراقبت از پوست کره ای و اروپایی با کیفیت و ضمانت اصالت. خرید محصولات مراقبتی و بهداشتی با کیفیت و ارسال رایگان.',
      url: 'https://alluracare.com/fa',
      siteName: 'آلوراکـر | AlluraCare',
      locale: 'fa_IR',
      type: 'website',
      images: [
        {
          url: 'https://alluracare.com/og-image-fa.jpg',
          width: 1200,
          height: 630,
          alt: 'آلوراکـر - مراقبت از پوست با کیفیت بالا',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'آلوراکـر | مراقبت از پوست با کیفیت بالا',
      description: 'بهترین محصولات مراقبت از پوست کره ای و اروپایی با کیفیت و ضمانت اصالت. خرید محصولات مراقبتی و بهداشتی با کیفیت و ارسال رایگان.',
      images: ['https://alluracare.com/og-image-fa.jpg'],
    },
    robots: {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-video-preview': -1,
    'max-image-preview': 'large' as const,  // ← Add 'as const'
    'max-snippet': -1,
  },
},
    alternates: {
      languages: {
        'fa': '/fa',
        'en': '/en',
      },
    },
  };

  // English SEO (secondary)
  const englishMetadata = {
    title: {
      default: 'AlluraCare | Premium Skincare',
      template: '%s | AlluraCare',
    },
    description: 'Discover premium Korean and European skincare products at AlluraCare. High quality, original, and effective skincare for all skin types. Free shipping on orders over $50.',
    keywords: [
      'skincare',
      'korean skincare',
      'natural skincare',
      'european skincare',
      'beauty',
      'skincare routine',
      'k-beauty',
      'AlluraCare',
    ],
    openGraph: {
      title: 'AlluraCare | Premium Skincare',
      description: 'Discover premium Korean and European skincare products at AlluraCare. High quality, original, and effective skincare for all skin types.',
      url: 'https://alluracare.com/en',
      siteName: 'AlluraCare',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: 'https://alluracare.com/og-image-en.jpg',
          width: 1200,
          height: 630,
          alt: 'AlluraCare - Premium Skincare',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AlluraCare | Premium Skincare',
      description: 'Discover premium Korean and European skincare products at AlluraCare. High quality, original, and effective skincare.',
      images: ['https://alluracare.com/og-image-en.jpg'],
    },
    robots: {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-video-preview': -1,
    'max-image-preview': 'large' as const,  // ← Add 'as const'
    'max-snippet': -1,
  },
},
    alternates: {
      languages: {
        'fa': '/fa',
        'en': '/en',
      },
    },
  };

  return isPersian ? persianMetadata : englishMetadata;
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;

  // Validate locale
  const locales = ['fa', 'en'];
  if (!locales.includes(locale)) {
    notFound();
  }

  // Load messages for the current locale
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === 'fa' ? 'rtl' : 'ltr'}
      className={`${inter.variable} ${playfair.variable}`}
    >
      <head>
        {/* Persian Fonts */}
        <link
          href="https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/font-face.css"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="https://cdn.jsdelivr.net/gh/rastikerdar/shabnam-font@v5.0.0/dist/font-face.css"
          rel="stylesheet"
          type="text/css"
        />
        
        {/* Persian SEO Meta Tags */}
        {locale === 'fa' && (
          <>
            <meta name="language" content="fa" />
            <meta name="geo.region" content="IR" />
            <meta name="geo.placename" content="Tehran" />
            <meta property="og:locale" content="fa_IR" />
            <link rel="alternate" hrefLang="fa" href="https://alluracare.com/fa" />
          </>
        )}
        
        {locale === 'en' && (
          <>
            <meta name="language" content="en" />
            <meta property="og:locale" content="en_US" />
            <link rel="alternate" hrefLang="en" href="https://alluracare.com/en" />
          </>
        )}
        
        {/* Canonical URL */}
        <link rel="canonical" href={`https://alluracare.com/${locale}`} />
        <link rel="alternate" hrefLang="x-default" href="https://alluracare.com/fa" />
        
        <style>{`
          :root {
            --font-persian: 'Shabnam', 'Vazir', 'Vazir-FD', sans-serif;
          }
        `}</style>
      </head>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <NextIntlClientProvider messages={messages}>
            <AnnouncementBar locale={locale} />
            <Header locale={locale} />
            <PageTransition>
              <main className="flex-1">{children}</main>
            </PageTransition>
            <Footer locale={locale} />
            <AIAssistant locale={locale} />
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}