// src/app/[locale]/privacy/page.tsx

import PolicyContent from '@/components/common/PolicyContent';

interface PrivacyPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  const isPersian = locale === 'fa';

  const title = isPersian ? 'سیاست حریم خصوصی' : 'Privacy Policy';
  const lastUpdated = 'August 2024';

  const sections = isPersian ? [
    {
      title: 'اطلاعاتی که جمع‌آوری می‌کنیم',
      content: 'ما اطلاعات شخصی مانند نام، ایمیل، آدرس، و اطلاعات پرداخت را زمانی که شما حساب کاربری ایجاد می‌کنید، سفارش می‌دهید، یا با ما ارتباط برقرار می‌کنید، جمع‌آوری می‌کنیم.'
    },
    {
      title: 'چگونه از اطلاعات شما استفاده می‌کنیم',
      content: 'ما از اطلاعات شما برای پردازش سفارشات، بهبود خدمات، ارسال به‌روزرسانی‌ها، و ارائه تجربه شخصی‌سازی شده استفاده می‌کنیم. ما هرگز اطلاعات شما را بدون رضایت شما به اشتراک نمی‌گذاریم.'
    },
    {
      title: 'امنیت اطلاعات',
      content: 'ما اقدامات امنیتی مناسب را برای محافظت از اطلاعات شخصی شما در برابر دسترسی غیرمجاز، تغییر، افشا یا تخریب اتخاذ می‌کنیم.'
    },
    {
      title: 'حقوق شما',
      content: 'شما حق دارید در هر زمان به اطلاعات شخصی خود دسترسی داشته باشید، آنها را اصلاح کنید یا درخواست حذف کنید. لطفاً برای هرگونه درخواست با ما تماس بگیرید.'
    }
  ] : [
    {
      title: 'Information We Collect',
      content: 'We collect personal information such as name, email, address, and payment information when you create an account, place an order, or communicate with us.'
    },
    {
      title: 'How We Use Your Information',
      content: 'We use your information to process orders, improve our services, send updates, and provide a personalized experience. We never share your information without your consent.'
    },
    {
      title: 'Data Security',
      content: 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'
    },
    {
      title: 'Your Rights',
      content: 'You have the right to access, correct, or request deletion of your personal information at any time. Please contact us for any requests.'
    }
  ];

  return (
    <PolicyContent
      title={title}
      sections={sections}
      lastUpdated={lastUpdated}
      locale={locale}
    />
  );
}