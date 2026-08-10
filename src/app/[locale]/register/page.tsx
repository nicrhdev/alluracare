// src/app/[locale]/register/page.tsx

'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface RegisterPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default function RegisterPage({ params }: RegisterPageProps) {
  // Unwrap params using React.use()
  const { locale } = React.use(params);
  const router = useRouter();
  const isPersian = locale === 'fa';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error(isPersian ? 'رمز عبور و تکرار آن مطابقت ندارند' : 'Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error(isPersian ? 'رمز عبور باید حداقل ۶ کاراکتر باشد' : 'Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || (isPersian ? 'خطا در ثبت نام' : 'Registration failed'));
        setLoading(false);
        return;
      }

      toast.success(isPersian ? '✅ ثبت نام با موفقیت انجام شد!' : '✅ Registration successful!');
      
      // Auto sign in
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(isPersian ? 'خطا در ورود خودکار' : 'Auto-login failed');
        router.push(`/${locale}/login`);
      } else {
        router.push(`/${locale}/account`);
      }
    } catch (error) {
      toast.error(isPersian ? 'خطا در ثبت نام' : 'Registration failed');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: `/${locale}/account` });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ background: 'linear-gradient(135deg, #C1EODF 0%, #EDEDFA 50%, #FAFAF8 100%)' }}>
      {/* Floating decorative elements */}
      <div className="absolute top-20 right-10 w-32 h-32 rounded-full bg-brand-mint-soft/20 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-20 left-10 w-40 h-40 rounded-full bg-brand-purple-light/20 blur-3xl animate-float" style={{ animationDelay: '3s' }} />

      <div className={`w-full max-w-md transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            {/* Logo - using image instead of Sparkles */}
            <img
              src="/logo.png"
              alt="AlluraCare"
              className="h-40 w-auto object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-brand-text mb-2 animate-fade-up">
            {isPersian ? 'ایجاد حساب کاربری' : 'Create Account'}
          </h1>
          <p className="text-brand-text-secondary animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {isPersian ? 'به جمع آلوراکـر بپیوندید' : 'Join the AlluraCare community'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-brand-secondary/20 p-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-brand-text">
                {isPersian ? 'نام کامل' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isPersian ? 'نام خود را وارد کنید' : 'Enter your name'}
                  className="w-full pl-10 pr-4 py-2.5 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition text-brand-text placeholder:text-brand-text-secondary bg-white/50"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-brand-text">
                {isPersian ? 'ایمیل' : 'Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isPersian ? 'ایمیل خود را وارد کنید' : 'Enter your email'}
                  className="w-full pl-10 pr-4 py-2.5 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition text-brand-text placeholder:text-brand-text-secondary bg-white/50"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-brand-text">
                {isPersian ? 'رمز عبور' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isPersian ? 'رمز عبور (حداقل ۶ کاراکتر)' : 'Password (min 6 characters)'}
                  className="w-full pl-10 pr-12 py-2.5 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition text-brand-text placeholder:text-brand-text-secondary bg-white/50"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-secondary hover:text-brand-primary transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-brand-text">
                {isPersian ? 'تکرار رمز عبور' : 'Confirm Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={isPersian ? 'رمز عبور را تکرار کنید' : 'Confirm your password'}
                  className="w-full pl-10 pr-4 py-2.5 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition text-brand-text placeholder:text-brand-text-secondary bg-white/50"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2.5 text-base flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isPersian ? 'در حال ثبت نام...' : 'Creating account...'}
                </span>
              ) : (
                <>
                  {isPersian ? 'ثبت نام' : 'Sign Up'}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-secondary/20" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white/50 text-brand-text-secondary">
                {isPersian ? 'یا' : 'OR'}
              </span>
            </div>
          </div>

          {/* Google Sign Up */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-2.5 border border-brand-secondary/30 rounded-lg hover:bg-brand-pale-rose/20 transition group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3.97C17.782 2.096 15.03 1 12 1 7.386 1 3.394 3.432 1.645 6.73l3.62 3.035z"/>
              <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078-3.298 0-6.156-1.752-7.734-4.37l-3.62 3.035C3.394 20.568 7.386 23 12 23c3.03 0 5.782-1.096 7.91-2.969l-3.87-2.018z"/>
              <path fill="#4A90E2" d="M19.91 20.03c1.87-1.44 3.09-3.56 3.09-6.03 0-.67-.06-1.32-.18-1.94H12v3.89h4.54c-.23 1.26-.94 2.33-2.06 3.05l3.43 2.03z"/>
              <path fill="#FBBC05" d="M5.266 9.765a7.077 7.077 0 0 1 6.734-4.856c1.69 0 3.218.6 4.418 1.582l3.62-3.035C17.782 2.096 15.03 1 12 1 7.386 1 3.394 3.432 1.645 6.73l3.62 3.035z"/>
            </svg>
            <span className="text-sm font-medium text-brand-text">
              {isPersian ? 'ثبت نام با گوگل' : 'Sign up with Google'}
            </span>
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-brand-text-secondary mt-6">
            {isPersian ? 'قبلاً حساب کاربری دارید؟' : 'Already have an account?'}{' '}
            <Link
              href={`/${locale}/login`}
              className="text-brand-primary hover:text-brand-hover font-medium transition"
            >
              {isPersian ? 'ورود' : 'Sign In'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}