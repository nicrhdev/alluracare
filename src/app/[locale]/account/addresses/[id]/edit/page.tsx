// src/app/[locale]/account/addresses/[id]/edit/page.tsx

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma/client';
import Link from 'next/link';

interface EditAddressPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function EditAddressPage({ params }: EditAddressPageProps) {
  const { locale, id } = await params;
  const isPersian = locale === 'fa';

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/account/addresses/${id}/edit`);
  }

  const address = await prisma.address.findUnique({
    where: { id },
  });

  if (!address) {
    redirect(`/${locale}/account/addresses`);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-[#2D2D2D]">
        {isPersian ? 'ویرایش آدرس' : 'Edit Address'}
      </h2>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-brand-secondary/20 p-6">
        <p className="text-[#8A8A8A]">
          {isPersian ? 'صفحه ویرایش آدرس در حال ساخت است' : 'Edit address page is under construction'}
        </p>
        <Link
          href={`/${locale}/account/addresses`}
          className="mt-4 inline-block text-[#874A58] hover:text-[#C397A0] transition"
        >
          {isPersian ? 'بازگشت به آدرس‌ها' : 'Back to Addresses'}
        </Link>
      </div>
    </div>
  );
}