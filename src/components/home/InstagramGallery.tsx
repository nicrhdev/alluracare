// src/components/home/InstagramGallery.tsx

'use client';

import Link from 'next/link';
import { Heart, MessageCircle } from 'lucide-react';

interface InstagramPost {
  id: string;
  image: string;
  likes: number;
  comments: number;
  url: string;
}

interface InstagramGalleryProps {
  posts: InstagramPost[];
  locale: string;
}

export default function InstagramGallery({ posts, locale }: InstagramGalleryProps) {
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
            <span className="inline-block mr-1">📸</span>
            {isPersian ? 'اینستاگرام' : 'Instagram'}
          </span>
          <h2 className="heading-2 text-brand-text">
            {isPersian ? 'ما را در' : 'Follow Us'}
            <span className="text-brand-primary"> {isPersian ? 'اینستاگرام' : 'on Instagram'}</span>
          </h2>
          <p className="text-brand-text-secondary mt-2 max-w-lg mx-auto">
            {isPersian
              ? '@alluracare  ما را دنبال کنید'
              : 'Follow us @alluracare for daily skincare inspiration'}
          </p>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {posts.map((post, index) => (
            <Link
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xl"
              style={{
                animation: `fade-up 0.6s ease-out ${index * 0.08}s both`,
              }}
            >
              <img
                src={post.image || '/images/instagram-placeholder.jpg'}
                alt="Instagram post"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/instagram-placeholder.jpg';
                }}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex items-center gap-6 text-white">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 fill-white" />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span className="text-sm font-medium">{post.comments}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Follow Button */}
        <div className="text-center mt-8">
          <Link
            href="https://instagram.com/alluracare"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105"
          >
            <span>📸</span>
            {isPersian ? 'ما را دنبال کنید' : 'Follow Us'}
          </Link>
        </div>
      </div>
    </section>
  );
}