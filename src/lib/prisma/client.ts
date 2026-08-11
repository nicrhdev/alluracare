// src/lib/prisma/client.ts

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Global declaration to prevent multiple instances
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create a function to get the database URL
const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not defined');
  }
  return url;
};

// Create Prisma client instance
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  // Production: Use PostgreSQL adapter
  try {
    const pool = new Pool({
      connectionString: getDatabaseUrl(),
    });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  } catch (error) {
    console.error('Failed to initialize Prisma client:', error);
    // Fallback to basic client
    prisma = new PrismaClient();
  }
} else {
  // Development: Simple client
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  prisma = global.prisma;
}

export { prisma };