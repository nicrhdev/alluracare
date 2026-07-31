// src/app/[locale]/register/page.tsx

import { getTranslations } from 'next-intl/server';
import RegisterForm from './components/RegisterForm';
import { authOptions } from '@/lib/auth/config';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Sparkles } from 'lucide-react';

interface RegisterPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;

  // Check if user is already logged in
  const session = await getServerSession(authOptions);
  if (session) {
    redirect(`/${locale}/account`);
  }

  const t = await getTranslations('auth');

  return (
    <main className="min-h-screen bg-brand-background flex items-center justify-center py-12">
      <div className="container-custom max-w-md">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-brand-primary" />
            <span className="text-sm font-medium text-brand-primary bg-brand-pale-rose px-3 py-1 rounded-full">
              {locale === 'fa' ? '✨ خوش آمدید' : '✨ Join Us'}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-brand-text">{t('registerTitle')}</h1>
          <p className="text-brand-text-secondary mt-1">
            {locale === 'fa'
              ? 'ایجاد حساب کاربری جدید'
              : 'Create a new account'}
          </p>
        </div>

        <RegisterForm
          locale={locale}
          t={{
            title: t('registerTitle'),
            name: t('name'),
            email: t('email'),
            password: t('password'),
            confirmPassword: t('confirmPassword'),
            register: t('register'),
            registerWithGoogle: t('registerWithGoogle'),
            haveAccount: t('haveAccount'),
            login: t('login'),
          }}
        />
      </div>
    </main>
  );
}