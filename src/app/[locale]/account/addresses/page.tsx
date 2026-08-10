import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma/client';
import Link from 'next/link';
import { MapPin, Plus, Pencil, Trash2 } from 'lucide-react';

interface AddressesPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function AddressesPage({ params }: AddressesPageProps) {
  const { locale } = await params;
  const isPersian = locale === 'fa';

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/account/addresses`);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      addresses: true,
    },
  });

  if (!user) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-[#2D2D2D]">
          {isPersian ? 'آدرس‌ها' : 'My Addresses'}
        </h2>
        <Link
          href={`/${locale}/account/addresses/new`}
          className="btn-primary flex items-center gap-2 py-2 px-4 text-sm"
        >
          <Plus className="w-4 h-4" />
          {isPersian ? 'افزودن آدرس' : 'Add Address'}
        </Link>
      </div>

      {user.addresses.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-brand-secondary/20 p-12 text-center">
          <MapPin className="w-16 h-16 text-[#8A8A8A] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">
            {isPersian ? 'هیچ آدرسی ثبت نشده' : 'No addresses saved'}
          </h3>
          <p className="text-[#8A8A8A]">
            {isPersian
              ? 'برای تسریع در فرآیند خرید، آدرس خود را ذخیره کنید'
              : 'Save your address for faster checkout'}
          </p>
          <Link
            href={`/${locale}/account/addresses/new`}
            className="inline-block mt-4 text-[#874A58] hover:text-[#C397A0] font-medium transition"
          >
            {isPersian ? 'افزودن آدرس' : 'Add Address'} →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.addresses.map((address: any) => (
            <div
              key={address.id}
              className="bg-white/80 backdrop-blur-sm rounded-xl border border-brand-secondary/20 p-6 relative"
            >
              {address.isDefault && (
                <span className="absolute top-4 right-4 text-xs bg-[#874A58] text-white px-2 py-1 rounded-full">
                  {isPersian ? 'پیش‌فرض' : 'Default'}
                </span>
              )}
              <p className="font-medium text-[#2D2D2D]">{address.fullName}</p>
              <p className="text-sm text-[#8A8A8A] mt-1">{address.street}</p>
              <p className="text-sm text-[#8A8A8A]">
                {address.city}, {address.state} {address.zipCode}
              </p>
              <p className="text-sm text-[#8A8A8A]">{address.country}</p>
              {address.phone && (
                <p className="text-sm text-[#8A8A8A] mt-1">{address.phone}</p>
              )}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-brand-secondary/10">
                <Link
                  href={`/${locale}/account/addresses/${address.id}/edit`}
                  className="text-sm text-[#874A58] hover:text-[#C397A0] transition flex items-center gap-1"
                >
                  <Pencil className="w-3 h-3" />
                  {isPersian ? 'ویرایش' : 'Edit'}
                </Link>
                <button className="text-sm text-red-500 hover:text-red-700 transition flex items-center gap-1">
                  <Trash2 className="w-3 h-3" />
                  {isPersian ? 'حذف' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}