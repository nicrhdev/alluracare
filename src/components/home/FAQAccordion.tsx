// src/components/home/FAQAccordion.tsx

'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQ {
  id: string;
  questionEn: string;
  questionFa: string;
  answerEn: string;
  answerFa: string;
}

interface FAQAccordionProps {
  faqs: FAQ[];
  locale: string;
}

export default function FAQAccordion({ faqs, locale }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isPersian = locale === 'fa';

  if (!faqs || faqs.length === 0) {
    return null;
  }

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #C1EODF 30%, #EDEDFA 70%, #FFFFFF 100%)' }}>
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-sm font-medium text-white bg-[#874A58] px-4 py-1.5 rounded-full inline-block mb-3 shadow-md">
            {isPersian ? 'سوالات متداول' : 'FAQ'}
          </span>
          <h2 className="heading-2 text-[#2D2D2D]">
            {isPersian ? 'پرسش‌های' : 'Frequently'}
            <span className="text-[#874A58]"> {isPersian ? 'متداول' : 'Asked Questions'}</span>
          </h2>
          <p className="text-[#8A8A8A] mt-2 max-w-lg mx-auto">
            {isPersian
              ? 'پاسخ به سوالات رایج در مورد محصولات و مراقبت از پوست'
              : 'Answers to common questions about our products and skincare'}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const question = isPersian ? faq.questionFa : faq.questionEn;
            const answer = isPersian ? faq.answerFa : faq.answerEn;
            const isEven = index % 2 === 0;

            return (
              <div
                key={faq.id}
                className={`rounded-xl overflow-hidden border transition-all duration-300 ${
                  isEven
                    ? 'bg-white border-[#C9CAE1]/30 hover:border-[#C9CAE1]'
                    : 'bg-white border-[#C1EODF]/30 hover:border-[#C1EODF]'
                } ${isOpen ? 'shadow-lg' : ''}`}
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-[#EDEDFA]/20 transition-colors duration-200"
                >
                  <span className="font-medium text-[#2D2D2D]">
                    {question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#8A8A8A] flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    isOpen ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className={`p-5 pt-0 text-[#8A8A8A] leading-relaxed border-t ${
                    isEven
                      ? 'border-[#C9CAE1]/20 bg-[#EDEDFA]/10'
                      : 'border-[#C1EODF]/20 bg-[#C1EODF]/10'
                  } rounded-b-xl`}>
                    {answer}
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