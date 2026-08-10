// src/app/[locale]/account/components/OrderStatusTimeline.tsx

'use client';

import { Check, Package, Truck, Home, X } from 'lucide-react';

interface OrderStatusTimelineProps {
  status: string;
  createdAt: Date;
  locale: string;
}

export default function OrderStatusTimeline({ status, createdAt, locale }: OrderStatusTimelineProps) {
  const isPersian = locale === 'fa';

  const steps = [
    { key: 'PENDING', label: isPersian ? 'ثبت سفارش' : 'Order Placed', icon: Check },
    { key: 'PROCESSING', label: isPersian ? 'در حال پردازش' : 'Processing', icon: Package },
    { key: 'SHIPPED', label: isPersian ? 'ارسال شده' : 'Shipped', icon: Truck },
    { key: 'DELIVERED', label: isPersian ? 'تحویل داده شده' : 'Delivered', icon: Home },
  ];

  const statusOrder = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const currentIndex = statusOrder.indexOf(status);
  const isCancelled = status === 'CANCELLED';

  return (
    <div className="relative">
      {isCancelled ? (
        <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-200">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <X className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="font-medium text-red-600">
              {isPersian ? 'سفارش لغو شده' : 'Order Cancelled'}
            </p>
            <p className="text-sm text-red-400">
              {isPersian
                ? 'این سفارش توسط شما لغو شده است'
                : 'This order has been cancelled'}
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Progress line */}
          <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-brand-secondary/30">
            <div
              className="w-0.5 bg-brand-primary transition-all duration-1000"
              style={{ height: `${(currentIndex / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentIndex;
              const isActive = index === currentIndex;

              return (
                <div key={step.key} className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                      isCompleted
                        ? 'bg-brand-primary text-white'
                        : 'bg-brand-secondary/30 text-[#8A8A8A]'
                    } ${isActive ? 'ring-4 ring-brand-primary/20 scale-110' : ''}`}
                    style={{ transitionDelay: `${index * 200}ms` }}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div className="pt-1">
                    <p className={`font-medium ${isActive ? 'text-brand-primary' : 'text-[#2D2D2D]'}`}>
                      {step.label}
                    </p>
                    {isActive && (
                      <p className="text-sm text-[#8A8A8A] animate-fade-up">
                        {isPersian
                          ? `سفارش در تاریخ ${new Date(createdAt).toLocaleDateString('fa-IR')} ثبت شده است`
                          : `Order placed on ${new Date(createdAt).toLocaleDateString('en-US')}`}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}