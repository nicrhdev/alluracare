// src/app/[locale]/terms/page.tsx

import PolicyContent from '@/components/common/PolicyContent';

interface TermsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  const isPersian = locale === 'fa';

  const title = isPersian ? 'قوانین و شرایط' : 'Terms & Conditions';
  const lastUpdated = 'August 2024';

  const sections = isPersian ? [
    {
      title: 'قبول شرایط',
      content: 'با استفاده از وب‌سایت آلوراکیـر، شما موافقت می‌کنید که به این شرایط و ضوابط پایبند باشید. اگر با هیچ بخشی از این شرایط موافق نیستید، لطفاً از وب‌سایت استفاده نکنید.'
    },
    {
      title: 'قوانین خرید',
      content: 'همه محصولات با دقت توصیف شده‌اند. ما تلاش می‌کنیم اطلاعات دقیقی ارائه دهیم، اما مسئولیت اشتباهات جزئی را نمی‌پذیریم. قیمت‌ها ممکن است بدون اطلاع قبلی تغییر کنند.'
    },
    {
      title: 'مالکیت فکری',
      content: 'تمام محتوای این وب‌سایت، از جمله متن، تصاویر، و لوگوها، متعلق به آلوراکیـر است و بدون اجازه کتبی قابل استفاده یا تکثیر نیست.'
    },
    {
      title: 'تغییرات شرایط',
      content: 'ما حق داریم این شرایط را در هر زمان تغییر دهیم. تغییرات در وب‌سایت منتشر می‌شوند و استفاده مداوم از وب‌سایت به معنای پذیرش شرایط جدید است.'
    }
  ] : [
    {
      title: 'Acceptance of Terms',
      content: 'By using the AlluraCare website, you agree to be bound by these terms and conditions. If you do not agree with any part of these terms, please do not use the website.'
    },
    {
      title: 'Purchase Rules',
      content: 'All products are described carefully. We strive to provide accurate information, but we are not responsible for minor errors. Prices may change without prior notice.'
    },
    {
      title: 'Intellectual Property',
      content: 'All content on this website, including text, images, and logos, is owned by AlluraCare and may not be used or reproduced without written permission.'
    },
    {
      title: 'Changes to Terms',
      content: 'We reserve the right to modify these terms at any time. Changes will be posted on the website, and continued use of the website constitutes acceptance of the new terms.'
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