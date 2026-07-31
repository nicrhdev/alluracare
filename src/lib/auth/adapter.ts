// src/lib/auth/adapter.ts

import { Adapter, AdapterUser, AdapterSession, AdapterAccount } from 'next-auth/adapters';
import { prisma } from '@/lib/prisma/client';

export function PrismaAdapter(): Adapter {
  return {
    // Create a new user - this is called when Google OAuth creates a user
    async createUser(data: Omit<AdapterUser, 'id'>): Promise<AdapterUser> {
      console.log('🔵 Creating user via adapter:', data);
      const user = await prisma.user.create({
        data: {
          email: data.email!,
          name: data.name || null,
          image: data.image || null,
          provider: 'google', // Set provider for Google users
          role: 'USER',
        },
      });
      console.log('✅ User created:', user);
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        emailVerified: user.emailVerified || null,
      };
    },

    // Get a user by ID
    async getUser(id: string): Promise<AdapterUser | null> {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) return null;
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        emailVerified: user.emailVerified || null,
      };
    },

    // Get a user by email
    async getUserByEmail(email: string): Promise<AdapterUser | null> {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return null;
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        emailVerified: user.emailVerified || null,
      };
    },

    // Get a user by account - this is called during Google OAuth callback
    async getUserByAccount({ provider, providerAccountId }: { provider: string; providerAccountId: string }): Promise<AdapterUser | null> {
      console.log('🔵 Looking for user by account:', { provider, providerAccountId });
      const user = await prisma.user.findFirst({
        where: {
          provider: provider,
          providerId: providerAccountId,
        },
      });
      if (!user) {
        console.log('❌ User not found by account');
        return null;
      }
      console.log('✅ User found by account:', user);
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        emailVerified: user.emailVerified || null,
      };
    },

    // Update a user
    async updateUser(data: Partial<AdapterUser> & { id: string }): Promise<AdapterUser> {
      const user = await prisma.user.update({
        where: { id: data.id },
        data: {
          name: data.name || undefined,
          image: data.image || undefined,
        },
      });
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        emailVerified: user.emailVerified || null,
      };
    },

    // Delete a user
    async deleteUser(id: string): Promise<AdapterUser | null> {
      const user = await prisma.user.delete({ where: { id } });
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        emailVerified: user.emailVerified || null,
      };
    },

    // Link an account (Google OAuth)
    async linkAccount(account: AdapterAccount): Promise<void> {
      console.log('🔵 Linking account:', account);
      // Find the user by ID first
      const user = await prisma.user.findUnique({
        where: { id: account.userId },
      });
      
      if (!user) {
        console.log('❌ User not found for linking');
        return;
      }

      // Update the user with provider info
      await prisma.user.update({
        where: { id: account.userId },
        data: {
          provider: account.provider,
          providerId: account.providerAccountId,
        },
      });
      console.log('✅ Account linked successfully');
    },

    // Create a session
    async createSession(session: { sessionToken: string; userId: string; expires: Date }): Promise<AdapterSession> {
      return {
        sessionToken: session.sessionToken,
        userId: session.userId,
        expires: session.expires,
      };
    },

    // Get a session and user
    async getSessionAndUser(sessionToken: string): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
      const user = await prisma.user.findFirst({
        where: { id: sessionToken },
      });
      if (!user) return null;
      
      const session: AdapterSession = {
        sessionToken: sessionToken,
        userId: user.id,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };
      
      return {
        session,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          emailVerified: user.emailVerified || null,
        },
      };
    },

    // Update a session
    async updateSession(session: Partial<AdapterSession> & { sessionToken: string }): Promise<AdapterSession | null> {
      return {
        sessionToken: session.sessionToken,
        userId: session.userId || '',
        expires: session.expires || new Date(),
      };
    },

    // Delete a session
    async deleteSession(sessionToken: string): Promise<void> {
      return;
    },
  };
}