// src/components/common/SEO.tsx

'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  locale: string;
  isPersian?: boolean;
}

export default function SEO({
  title,
  description,
  keywords,
  image,
  locale,
  isPersian = true,
}: SEOProps) {
  const pathname = usePathname();
  const baseUrl = 'https://alluracare.com';
  const url = `${baseUrl}${pathname}`;

  // Persian-first titles and descriptions
  const defaultTitle = isPersian
    ? 'آلوراکـر | مراقبت از پوست با کیفیت بالا'
    : 'AlluraCare | Premium Skincare';

  const defaultDescription = isPersian
    ? 'بهترین محصولات مراقبت از پوست کره ای و اروپایی با کیفیت و ضمانت اصالت. خرید محصولات مراقبتی و بهداشتی با کیفیت و ارسال رایگان.'
    : 'Discover premium Korean skincare products at AlluraCare. Natural, cruelty-free, and effective skincare.';

  const defaultKeywords = isPersian
    ? ['مراقبت از پوست', 'محصولات آرایشی', 'پوست', 'آرایشی', 'اورجینال', 'بهداشتی', 'اصل', 'با کیفیت']
    : ['skincare', 'korean skincare', 'european skincare', 'natural skincare', 'original', 'beauty'];

  const metaTitle = title || defaultTitle;
  const metaDescription = description || defaultDescription;
  const metaKeywords = keywords || defaultKeywords;
  const metaImage = image || (isPersian
    ? 'https://alluracare.com/og-image-fa.jpg'
    : 'https://alluracare.com/og-image-en.jpg'
  );

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords.join(', ')} />
      
      {/* Open Graph */}
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={isPersian ? 'fa_IR' : 'en_US'} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      
      {/* Additional Persian SEO */}
      {isPersian && (
        <>
          <meta name="language" content="fa" />
          <meta name="geo.region" content="IR" />
          <meta name="geo.placename" content="Tehran" />
          <meta property="og:locale:alternate" content="en_US" />
        </>
      )}
    </Head>
  );
}