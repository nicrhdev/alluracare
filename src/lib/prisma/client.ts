// src/lib/prisma/client.ts

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

declare global {
  var prisma: PrismaClient | undefined;
}

const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not defined');
  }
  return url;
};

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  const pool = new Pool({
    connectionString: getDatabaseUrl(),
  });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
} else {

  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  prisma = global.prisma;
}

export { prisma };