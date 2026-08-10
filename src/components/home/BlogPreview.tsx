// src/components/home/BlogPreview.tsx

'use client';

import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface BlogPost {
  id: string;
  titleEn: string;
  titleFa: string;
  slug: string;
  excerptEn: string;
  excerptFa: string;
  image: string;
  categoryEn: string;
  categoryFa: string;
  date: string;
  readTime: number;
}

interface BlogPreviewProps {
  posts: BlogPost[];
  locale: string;
}

export default function BlogPreview({ posts, locale }: BlogPreviewProps) {
  const isPersian = locale === 'fa';

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-sm font-medium text-brand-primary bg-brand-pale-rose px-4 py-1.5 rounded-full inline-block mb-3">
            {isPersian ? 'مقالات آموزشی' : 'Blog'}
          </span>
          <h2 className="heading-2 text-brand-text">
            {isPersian ? 'مطالب' : 'Latest'}
            <span className="text-brand-primary"> {isPersian ? 'آموزشی' : 'Articles'}</span>
          </h2>
          <p className="text-brand-text-secondary mt-2 max-w-lg mx-auto">
            {isPersian
              ? 'جدیدترین مقالات آموزشی در مورد مراقبت از پوست'
              : 'Latest educational articles about skincare'}
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => {
            const title = isPersian ? post.titleFa : post.titleEn;
            const excerpt = isPersian ? post.excerptFa : post.excerptEn;
            const category = isPersian ? post.categoryFa : post.categoryEn;

            return (
              <Link
                key={post.id}
                href={`/${locale}/blog/${post.slug}`}
                className="group bg-white rounded-xl overflow-hidden transition-all duration-500 hover:shadow-hover hover:-translate-y-2 border border-brand-secondary/10"
                style={{
                  animation: `fade-up 0.6s ease-out ${index * 0.08}s both`,
                }}
              >
                {/* Image - use regular img tag instead of CldImage */}
<div className="relative aspect-[16/9] overflow-hidden bg-brand-pale-rose/20">
  <img
    src={post.image || '/images/blog-placeholder.jpg'}
    alt={title}
    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    onError={(e) => {
      (e.target as HTMLImageElement).src = '/images/blog-placeholder.jpg';
    }}
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
</div>

                {/* Content */}
                <div className="p-6">
                  {/* Category & Meta */}
                  <div className="flex items-center gap-3 text-xs text-brand-text-secondary mb-3">
                    <span className="px-3 py-1 bg-brand-pale-rose/50 rounded-full font-medium">
                      {category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime} {isPersian ? 'دقیقه' : 'min'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-brand-text text-lg group-hover:text-brand-primary transition line-clamp-2">
                    {title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm text-brand-text-secondary mt-2 line-clamp-3">
                    {excerpt}
                  </p>

                  {/* Read More */}
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-brand-primary group-hover:gap-3 transition-all">
                    {isPersian ? 'ادامه مطلب' : 'Read More'}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-hover font-medium transition group"
          >
            {isPersian ? 'مشاهده همه مقالات' : 'View All Articles'}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}