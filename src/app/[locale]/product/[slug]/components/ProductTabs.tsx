// src/app/[locale]/product/[slug]/components/ProductTabs.tsx

'use client';

import { useState } from 'react';
import { Sparkles, Droplets, BookOpen, Users } from 'lucide-react';

interface ProductTabsProps {
  benefitsEn: string[];
  benefitsFa: string[];
  ingredientsEn: string[];
  ingredientsFa: string[];
  howToUseEn: string | null;
  howToUseFa: string | null;
  skinTypes: { id: string; nameEn: string; nameFa: string }[];
  locale: string;
}

export default function ProductTabs({
  benefitsEn,
  benefitsFa,
  ingredientsEn,
  ingredientsFa,
  howToUseEn,
  howToUseFa,
  skinTypes,
  locale,
}: ProductTabsProps) {
  const isPersian = locale === 'fa';
  const [activeTab, setActiveTab] = useState('benefits');

  // Use the correct language version
  const benefits = isPersian ? benefitsFa : benefitsEn;
  const ingredients = isPersian ? ingredientsFa : ingredientsEn;

  // Debug logging
  console.log('🔍 ProductTabs - Skin Types:', skinTypes);
  console.log('🔍 ProductTabs - Benefits:', benefits);
  console.log('🔍 ProductTabs - Ingredients:', ingredients);

  const tabs = [
    {
      id: 'benefits',
      icon: Sparkles,
      label: isPersian ? 'مزایا' : 'Benefits',
      hasContent: benefits && benefits.length > 0,
    },
    {
      id: 'ingredients',
      icon: Droplets,
      label: isPersian ? 'مواد تشکیل‌دهنده' : 'Ingredients',
      hasContent: ingredients && ingredients.length > 0,
    },
    {
      id: 'how-to-use',
      icon: BookOpen,
      label: isPersian ? 'روش استفاده' : 'How to Use',
      hasContent: !!(isPersian ? howToUseFa : howToUseEn),
    },
    {
      id: 'skin-types',
      icon: Users,
      label: isPersian ? 'نوع پوست مناسب' : 'Skin Types',
      hasContent: skinTypes && skinTypes.length > 0,
    },
  ];

  // Filter out tabs with no content
  const visibleTabs = tabs.filter((tab) => tab.hasContent);

  if (visibleTabs.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 bg-white rounded-2xl border border-brand-secondary/10 overflow-hidden">
      {/* Tab Headers */}
      <div className="flex flex-wrap gap-1 border-b border-brand-secondary/10 bg-gradient-mint/10 px-4">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 ${
                isActive
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-brand-text-secondary hover:text-brand-text hover:border-brand-secondary/30'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Benefits */}
        {activeTab === 'benefits' && benefits && benefits.length > 0 && (
          <ul className="space-y-3">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-brand-primary mt-1 text-lg">✦</span>
                <span className="text-brand-text-secondary">{benefit}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Ingredients */}
        {activeTab === 'ingredients' && ingredients && ingredients.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ingredient, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-brand-mint-soft/20 text-brand-text rounded-full text-sm border border-brand-mint-soft/30"
              >
                {ingredient}
              </span>
            ))}
          </div>
        )}

        {/* How to Use */}
        {activeTab === 'how-to-use' && (
          <div className="prose prose-brand max-w-none">
            <p className="text-brand-text-secondary leading-relaxed">
              {isPersian ? howToUseFa || howToUseEn : howToUseEn || howToUseFa}
            </p>
          </div>
        )}

        {/* Skin Types */}
        {activeTab === 'skin-types' && skinTypes && skinTypes.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {skinTypes.map((type) => (
              <span
                key={type.id}
                className="px-4 py-2 bg-gradient-mint/20 text-brand-text rounded-full text-sm border border-brand-mint-soft/30"
              >
                {isPersian ? type.nameFa : type.nameEn}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}