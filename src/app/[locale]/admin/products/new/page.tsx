// src/app/[locale]/admin/products/new/page.tsx

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma/client';
import ProductForm from '../components/ProductForm';

interface NewProductPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function NewProductPage({ params }: NewProductPageProps) {
  const { locale } = await params;

  // Check if user is logged in and is admin
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/admin/products/new`);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || user.role !== 'ADMIN') {
    redirect(`/${locale}/`);
  }

  // Fetch categories, skin types, and concerns
  const [categories, skinTypes, concerns] = await Promise.all([
    prisma.category.findMany({
      orderBy: { order: 'asc' },
    }),
    prisma.skinType.findMany({
      orderBy: { order: 'asc' },
    }),
    prisma.concern.findMany({
      orderBy: { order: 'asc' },
    }),
  ]);

  // Debug: Log the data
  console.log('📦 Skin Types:', skinTypes);
  console.log('📦 Concerns:', concerns);
  console.log('📦 Categories:', categories);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Add Product</h1>
      <p className="text-slate-600 mb-8">Create a new product</p>

      <ProductForm
        categories={categories || []}
        skinTypes={skinTypes || []}
        concerns={concerns || []}
        locale={locale}
        isEdit={false}
      />
    </div>
  );
}