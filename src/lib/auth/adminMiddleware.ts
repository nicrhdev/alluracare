// src/lib/auth/adminMiddleware.ts

import { getServerSession } from 'next-auth';
import { authOptions } from './config';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma/client';

export async function requireAdmin(locale: string = 'fa') {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !session.user.email) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/admin`);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || user.role !== 'ADMIN') {
    redirect(`/${locale}/`);
  }

  return user;
}