// src/app/[locale]/returns/page.tsx

import PolicyContent from '@/components/common/PolicyContent';

interface ReturnsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function ReturnsPage({ params }: ReturnsPageProps) {
  const { locale } = await params;
  const isPersian = locale === 'fa';

  const title = isPersian ? 'سیاست بازگشت کالا' : 'Returns Policy';
  const lastUpdated = 'August 2024';

  const sections = isPersian ? [
    {
      title: 'دوره بازگشت',
      content: 'ما بازگشت کالا را تا ۳۰ روز پس از تاریخ خرید می‌پذیریم. برای واجد شرایط بودن برای بازگشت، محصول باید استفاده نشده و در بسته‌بندی اصلی خود باشد.'
    },
    {
      title: 'فرآیند بازگشت',
      content: 'برای شروع بازگشت، لطفاً با تیم پشتیبانی ما تماس بگیرید. ما دستورالعمل‌های لازم را برای بازگشت محصول به شما ارائه خواهیم داد.'
    },
    {
      title: 'بازپرداخت',
      content: 'پس از دریافت و بررسی محصول بازگشتی، بازپرداخت شما به روش پرداخت اصلی شما صادر خواهد شد. لطفاً توجه داشته باشید که ممکن است ۳-۵ روز کاری طول بکشد تا بازپرداخت در حساب شما ظاهر شود.'
    },
    {
      title: 'هزینه بازگشت',
      content: 'هزینه حمل و نقل برای بازگشت کالا بر عهده مشتری است، مگر اینکه محصول معیوب باشد یا اشتباه ارسال شده باشد.'
    }
  ] : [
    {
      title: 'Return Period',
      content: 'We accept returns within 30 days of the purchase date. To be eligible for a return, the product must be unused and in its original packaging.'
    },
    {
      title: 'Return Process',
      content: 'To initiate a return, please contact our support team. We will provide you with instructions on how to return the product.'
    },
    {
      title: 'Refunds',
      content: 'Once we receive and inspect your returned item, your refund will be issued to your original payment method. Please allow 3-5 business days for the refund to appear in your account.'
    },
    {
      title: 'Return Shipping',
      content: 'Return shipping costs are the responsibility of the customer, unless the product is defective or was sent in error.'
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