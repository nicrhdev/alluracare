// src/app/[locale]/admin/products/[id]/edit/page.tsx

import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma/client';
import ProductForm from '../../components/ProductForm';

interface EditProductPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { locale, id } = await params;

  // Check if user is logged in and is admin
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/admin/products/${id}/edit`);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || user.role !== 'ADMIN') {
    redirect(`/${locale}/`);
  }

  // Fetch product with relations - use proper Prisma include syntax
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: true,
      category: true,
      skinTypes: {
        include: {
          skinType: true,
        },
      },
      concerns: {
        include: {
          concern: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
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

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Edit Product</h1>
      <p className="text-slate-600 mb-8">Update product details</p>

      <ProductForm
        product={product as any}
        categories={categories}
        skinTypes={skinTypes}
        concerns={concerns}
        locale={locale}
        isEdit={true}
      />
    </div>
  );
}