// src/app/[locale]/about/page.tsx

import { getTranslations } from 'next-intl/server';
import { Sparkles, Leaf, Heart, Shield, Users, Award } from 'lucide-react';

interface AboutPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const isPersian = locale === 'fa';
  const t = await getTranslations('about');

  const values = [
    {
      icon: Leaf,
      titleEn: '100% Natural',
      titleFa: '۱۰۰٪ طبیعی',
      descEn: 'We believe in the power of nature. Our products are formulated with the finest natural ingredients.',
      descFa: 'ما به قدرت طبیعت اعتقاد داریم. محصولات ما با بهترین مواد طبیعی فرموله شده‌اند.',
    },
    {
      icon: Heart,
      titleEn: 'Cruelty-Free',
      titleFa: 'بدون تست روی حیوانات',
      descEn: 'We never test on animals. All our products are ethically sourced and produced.',
      descFa: 'ما هرگز روی حیوانات تست نمی‌کنیم. تمام محصولات ما به صورت اخلاقی تهیه و تولید می‌شوند.',
    },
    {
      icon: Shield,
      titleEn: 'Quality Guaranteed',
      titleFa: 'کیفیت تضمینی',
      descEn: 'Every product is carefully selected and tested for quality and efficacy.',
      descFa: 'هر محصول با دقت انتخاب و برای کیفیت و اثربخشی تست شده است.',
    },
    {
      icon: Users,
      titleEn: 'Community First',
      titleFa: 'جامعه‌محور',
      descEn: 'We value our community and strive to create products that enhance your skincare journey.',
      descFa: 'ما به جامعه خود اهمیت می‌دهیم و تلاش می‌کنیم محصولاتی ایجاد کنیم که سفر مراقبت از پوست شما را بهبود بخشد.',
    },
    {
      icon: Award,
      titleEn: 'Excellence',
      titleFa: 'تعالی',
      descEn: 'We are committed to excellence in everything we do, from sourcing to customer service.',
      descFa: 'ما به تعالی در همه چیز متعهد هستیم، از تهیه مواد تا خدمات مشتری.',
    },
    {
      icon: Sparkles,
      titleEn: 'Innovation',
      titleFa: 'نوآوری',
      descEn: 'We embrace innovation and continually seek new ways to improve your skincare experience.',
      descFa: 'ما نوآوری را پذیرفته و مدام به دنبال راه‌های جدید برای بهبود تجربه مراقبت از پوست شما هستیم.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #EDEDFA 0%, #C1EODF 50%, #FAFAF8 100%)' }}>
        <div className="container-custom text-center">
          <span className="text-sm font-medium text-white bg-[#874A58] px-4 py-1.5 rounded-full inline-block mb-4">
            {isPersian ? '✨ درباره ما' : '✨ About Us'}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-4">
            {isPersian ? 'داستان آلوراکیـر' : 'The AlluraCare Story'}
          </h1>
          <p className="text-[#8A8A8A] max-w-2xl mx-auto text-lg">
            {isPersian
              ? 'ما به قدرت مراقبت از پوست برای تغییر زندگی اعتقاد داریم'
              : 'We believe in the power of skincare to transform lives'}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-white">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">
              {isPersian ? 'داستان ما' : 'Our Story'}
            </h2>
            <p className="text-[#8A8A8A] leading-relaxed">
              {isPersian
                ? 'آلوراکیـر با یک هدف ساده متولد شد: ارائه محصولات مراقبت از پوست با کیفیت بالا که واقعاً کار می‌کنند. ما معتقدیم که پوست زیبا از درون شروع می‌شود و با استفاده از مواد طبیعی و مؤثر، می‌توانیم به شما کمک کنیم تا بهترین نسخه از خودتان باشید.'
                : 'AlluraCare was born with a simple mission: to provide high-quality skincare products that actually work. We believe that beautiful skin starts from within, and with the right natural and effective ingredients, we can help you become the best version of yourself.'}
            </p>
            <p className="text-[#8A8A8A] leading-relaxed mt-4">
              {isPersian
                ? 'تیم ما متعهد به ارائه محصولاتی است که نه تنها برای پوست شما مفید هستند، بلکه برای محیط زیست نیز خوب هستند. ما با تولیدکنندگانی کار می‌کنیم که ارزش‌های ما را در مورد پایداری و شیوه‌های اخلاقی به اشتراک می‌گذارند.'
                : 'Our team is dedicated to bringing you products that are not only good for your skin but also good for the planet. We work with manufacturers who share our values of sustainability and ethical practices.'}
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #EDEDFA 30%, #C1EODF 70%, #FFFFFF 100%)' }}>
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2D2D2D] mb-2">
              {isPersian ? 'ارزش‌های ما' : 'Our Values'}
            </h2>
            <p className="text-[#8A8A8A] max-w-lg mx-auto">
              {isPersian
                ? 'چیزهایی که ما به آنها اعتقاد داریم و شما را در اولویت قرار می‌دهند'
                : 'What we believe in and what puts you first'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-xl border border-brand-secondary/20 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  style={{
                    animation: `fade-up 0.6s ease-out ${index * 0.08}s both`,
                  }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EDEDFA] to-[#C9CAE1] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#874A58]" />
                  </div>
                  <h3 className="font-semibold text-[#2D2D2D]">
                    {isPersian ? value.titleFa : value.titleEn}
                  </h3>
                  <p className="text-sm text-[#8A8A8A] mt-2">
                    {isPersian ? value.descFa : value.descEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}