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
import '../globals.css';

// Premium fonts
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

export const metadata: Metadata = {
  title: {
    default: 'آلوراکیـر | مراقبت از پوست',
    template: '%s | آلوراکیـر',
  },
  description: 'بهترین محصولات مراقبت از پوست با کیفیت بالا',
  keywords: ['مراقبت از پوست', 'محصولات آرایشی', 'سلامتی پوست'],
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
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
        {/* Vazir font - keeping it but we'll use a lighter weight */}
        <link
          href="https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/font-face.css"
          rel="stylesheet"
          type="text/css"
        />
        {/* Alternative: Shabnam Font - more minimal and elegant for Persian */}
        <link
          href="https://cdn.jsdelivr.net/gh/rastikerdar/shabnam-font@v5.0.0/dist/font-face.css"
          rel="stylesheet"
          type="text/css"
        />
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
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}