// src/app/[locale]/shipping/page.tsx

import PolicyContent from '@/components/common/PolicyContent';

interface ShippingPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function ShippingPage({ params }: ShippingPageProps) {
  const { locale } = await params;
  const isPersian = locale === 'fa';

  const title = isPersian ? 'سیاست ارسال' : 'Shipping Policy';
  const lastUpdated = 'August 2024';

  const sections = isPersian ? [
    {
      title: 'زمان پردازش',
      content: 'سفارش‌ها معمولاً در عرض ۱-۲ روز کاری پردازش می‌شوند. در روزهای تعطیل و آخر هفته، زمان پردازش ممکن است کمی بیشتر طول بکشد.'
    },
    {
      title: 'هزینه ارسال',
      content: 'ارسال رایگان برای تمام سفارش‌های بالای ۵۰ دلار در ایالات متحده. هزینه ارسال بین‌المللی بر اساس وزن و مقصد محاسبه می‌شود و در زمان تسویه حساب نمایش داده می‌شود.'
    },
    {
      title: 'زمان تحویل',
      content: 'زمان تحویل تخمینی: ایالات متحده: ۳-۵ روز کاری، بین‌المللی: ۷-۱۴ روز کاری. لطفاً توجه داشته باشید که این زمان‌ها تخمینی هستند و ممکن است تغییر کنند.'
    },
    {
      title: 'ردیابی سفارش',
      content: 'پس از ارسال سفارش، یک شماره رهگیری از طریق ایمیل برای شما ارسال می‌شود. می‌توانید سفارش خود را در هر زمان از طریق داشبورد حساب کاربری خود پیگیری کنید.'
    }
  ] : [
    {
      title: 'Processing Time',
      content: 'Orders are typically processed within 1-2 business days. During holidays and weekends, processing time may be slightly longer.'
    },
    {
      title: 'Shipping Cost',
      content: 'Free shipping on all US orders over $50. International shipping costs are calculated based on weight and destination and will be displayed at checkout.'
    },
    {
      title: 'Delivery Time',
      content: 'Estimated delivery times: US: 3-5 business days, International: 7-14 business days. Please note these are estimates and may vary.'
    },
    {
      title: 'Order Tracking',
      content: 'You will receive a tracking number via email once your order ships. You can track your order anytime through your account dashboard.'
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