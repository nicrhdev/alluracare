// src/app/[locale]/register/components/RegisterForm.tsx

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, Loader2 } from 'lucide-react';

interface RegisterFormProps {
  locale: string;
  t: {
    title: string;
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    register: string;
    registerWithGoogle: string;
    haveAccount: string;
    login: string;
  };
}

export default function RegisterForm({ locale, t }: RegisterFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      setSuccessMsg('Account created successfully! Redirecting...');

      // Login after successful registration
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: `/${locale}/account`,
      });

      if (result?.error) {
        setErrorMsg('Registration successful, but login failed. Please try logging in.');
        setLoading(false);
        return;
      }

      router.push(`/${locale}/account`);
      router.refresh();
    } catch (error) {
      setErrorMsg('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signIn('google', { callbackUrl: `/${locale}/account` });
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-brand-secondary/20 p-8">
      {/* Messages */}
      {errorMsg && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 border border-red-200">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4 border border-green-200">
          {successMsg}
        </div>
      )}

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-brand-text mb-1.5">
            {t.name}
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={locale === 'fa' ? 'نام کامل' : 'Full Name'}
              className="input-pastel pl-10"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-text mb-1.5">
            {t.email}
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="input-pastel pl-10"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-text mb-1.5">
            {t.password}
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-pastel pl-10"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-text mb-1.5">
            {t.confirmPassword}
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="input-pastel pl-10"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-3"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {locale === 'fa' ? 'در حال ثبت‌نام...' : 'Creating account...'}
            </span>
          ) : (
            t.register
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-brand-secondary/30"></div>
        <span className="text-sm text-brand-text-secondary">or</span>
        <div className="flex-1 h-px bg-brand-secondary/30"></div>
      </div>

      {/* Google Register */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full py-3 border border-brand-secondary/30 rounded-xl text-brand-text hover:bg-brand-pale-rose hover:border-brand-primary transition flex items-center justify-center gap-3"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {t.registerWithGoogle}
      </button>

      {/* Login Link */}
      <p className="text-center text-sm text-brand-text-secondary mt-6">
        {t.haveAccount}{' '}
        <Link
          href={`/${locale}/login`}
          className="text-brand-primary font-medium hover:underline"
        >
          {t.login}
        </Link>
      </p>
    </div>
  );
}