// src/components/common/PolicyContent.tsx

interface PolicyContentProps {
  title: string;
  sections: {
    title: string;
    content: string;
  }[];
  lastUpdated: string;
  locale: string;
}

export default function PolicyContent({ title, sections, lastUpdated, locale }: PolicyContentProps) {
  const isPersian = locale === 'fa';

  return (
    <div className="min-h-screen py-12" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #EDEDFA 30%, #C1EODF 70%, #FFFFFF 100%)' }}>
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#2D2D2D] mb-2">{title}</h1>
          <p className="text-sm text-[#8A8A8A]">
            {isPersian ? `آخرین به‌روزرسانی: ${lastUpdated}` : `Last updated: ${lastUpdated}`}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-brand-secondary/20 p-8 space-y-6">
          {sections.map((section, index) => (
            <div key={index} className="border-b border-brand-secondary/10 last:border-b-0 pb-6 last:pb-0">
              <h2 className="text-xl font-semibold text-[#2D2D2D] mb-3">{section.title}</h2>
              <p className="text-[#8A8A8A] leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}