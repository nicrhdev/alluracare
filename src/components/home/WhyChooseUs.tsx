// src/components/home/WhyChooseUs.tsx

'use client';

import { Shield, Truck, Microscope } from 'lucide-react';

interface WhyChooseUsProps {
  locale: string;
}

const reasons = [
  {
    icon: Shield,
    titleEn: 'Quality Guaranteed',
    titleFa: 'کیفیت تضمینی',
    descEn: 'Premium quality, original products you can trust',
    descFa: 'محصولات با کیفیت، اورجینال و قابل اعتماد',
  },
  {
    icon: Truck,
    titleEn: 'Fast Shipping',
    titleFa: 'ارسال سریع',
    descEn: 'Reliable and fast shipping',
    descFa: 'ارسال مطمئن سفارشات در سریع ترین زمان ممکن',
  },
  {
    icon: Microscope,
    titleEn: 'Expert Formulated',
    titleFa: 'مورد تایید متخصصان',
    descEn: 'Trusted by skincare experts',
    descFa: 'تایید شده توسط متخصصان پوست',
  },
];

export default function WhyChooseUs({ locale }: WhyChooseUsProps) {
  const isPersian = locale === 'fa';

  return (
    <section className="py-16" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #C9CAE1 20%, #EDEDFA 50%, #C1EODF 80%, #FFFFFF 100%)' }}>
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-white bg-[#874A58] px-4 py-1.5 rounded-full inline-block mb-3 shadow-md">
            {isPersian ? 'چرا آلوراکـر؟' : 'Why AlluraCare?'}
          </span>
          <p className="text-[#8A8A8A] mt-2 max-w-lg mx-auto">
            {isPersian
              ? 'ما به کیفیت، شفافیت و مراقبت از پوست شما اهمیت می‌دهیم'
              : 'We care about quality, transparency, and your skin'}
          </p>
        </div>

        {/* Reasons Grid - Now 3 items in a row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                className={`group p-6 rounded-2xl transition-all duration-500 hover:shadow-xl hover:-translate-y-2 border ${
                  isEven
                    ? 'bg-white/90 border-[#C9CAE1]/30 hover:border-[#C9CAE1]'
                    : 'bg-white/90 border-[#C1EODF]/30 hover:border-[#C1EODF]'
                }`}
                style={{
                  animation: `fade-up 0.6s ease-out ${index * 0.08}s both`,
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isEven
                      ? 'bg-gradient-to-br from-[#EDEDFA] to-[#C9CAE1] group-hover:scale-110'
                      : 'bg-gradient-to-br from-[#C1EODF] to-[#D3E3E3] group-hover:scale-110'
                  }`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="font-semibold text-[#2D2D2D] group-hover:text-[#874A58] transition">
                      {isPersian ? reason.titleFa : reason.titleEn}
                    </h3>
                    <p className="text-sm text-[#8A8A8A] mt-1">
                      {isPersian ? reason.descFa : reason.descEn}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}