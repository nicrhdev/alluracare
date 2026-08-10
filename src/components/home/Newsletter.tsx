// src/components/home/Newsletter.tsx

'use client';

import { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface NewsletterProps {
  locale: string;
}

export default function Newsletter({ locale }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const isPersian = locale === 'fa';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error(isPersian ? 'لطفاً ایمیل خود را وارد کنید' : 'Please enter your email');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubscribed(true);
      setEmail('');
      toast.success(
        isPersian
          ? '✅ با موفقیت در خبرنامه عضو شدید!'
          : '✅ Successfully subscribed to the newsletter!'
      );
      setTimeout(() => setSubscribed(false), 5000);
    } catch (error) {
      toast.error(isPersian ? 'خطا در ثبت‌نام' : 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16" style={{ background: 'linear-gradient(135deg, #874A58 0%, #C397A0 40%, #C9CAE1 70%, #EDEDFA 100%)' }}>
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          {/* Decorative element - now with darker background for contrast */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Mail className="w-6 h-6 text-white" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {isPersian ? 'عضویت در خبرنامه' : 'Join Our Newsletter'}
          </h2>
          <p className="text-white/90 mb-8 max-w-md mx-auto">
            {isPersian
              ? 'از جدیدترین محصولات، تخفیف‌های ویژه و مقالات مطلع شوید'
              : 'Stay updated with our latest products, exclusive offers, and skincare tips'}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isPersian ? 'ایمیل خود را وارد کنید' : 'Enter your email'}
              className="flex-1 px-5 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || subscribed}
              className="px-8 py-3 bg-white text-[#874A58] rounded-xl font-medium hover:bg-white/90 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#874A58] border-t-transparent rounded-full animate-spin" />
                  {isPersian ? 'در حال ثبت...' : 'Subscribing...'}
                </>
              ) : subscribed ? (
                <>
                  <Check className="w-4 h-4" />
                  {isPersian ? 'ثبت شد!' : 'Subscribed!'}
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  {isPersian ? 'عضویت' : 'Subscribe'}
                </>
              )}
            </button>
          </form>

          <p className="text-white/70 text-xs mt-4">
            {isPersian
              ? 'با عضویت در خبرنامه، با سیاست‌های حریم خصوصی ما موافقت می‌کنید.'
              : 'By subscribing, you agree to our Privacy Policy'}
          </p>
        </div>
      </div>
    </section>
  );
}