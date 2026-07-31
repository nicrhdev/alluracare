// src/app/[locale]/login/page.tsx

import { getTranslations } from 'next-intl/server';
import LoginForm from './components/LoginForm';
import { authOptions } from '@/lib/auth/config';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Sparkles } from 'lucide-react';

interface LoginPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    callbackUrl?: string;
  }>;
}

export default async function LoginPage({
  params,
  searchParams,
}: LoginPageProps) {
  const { locale } = await params;
  const search = await searchParams;

  // Check if user is already logged in
  const session = await getServerSession(authOptions);
  if (session) {
    redirect(`/${locale}/account`);
  }

  const t = await getTranslations('auth');
  const errorMessage =
    search?.error === 'CredentialsSignin'
      ? 'Invalid email or password'
      : search?.error || undefined;

  return (
    <main className="min-h-screen bg-brand-background flex items-center justify-center py-12">
      <div className="container-custom max-w-md">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-brand-primary" />
            <span className="text-sm font-medium text-brand-primary bg-brand-pale-rose px-3 py-1 rounded-full">
              {locale === 'fa' ? '✨ خوش آمدید' : '✨ Welcome Back'}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-brand-text">{t('loginTitle')}</h1>
          <p className="text-brand-text-secondary mt-1">
            {locale === 'fa'
              ? 'وارد حساب کاربری خود شوید'
              : 'Sign in to your account'}
          </p>
        </div>

        <LoginForm
          locale={locale}
          error={errorMessage}
          callbackUrl={search?.callbackUrl || `/${locale}/account`}
          t={{
            title: t('loginTitle'),
            email: t('email'),
            password: t('password'),
            login: t('login'),
            loginWithGoogle: t('loginWithGoogle'),
            noAccount: t('noAccount'),
            register: t('register'),
          }}
        />
      </div>
    </main>
  );
}