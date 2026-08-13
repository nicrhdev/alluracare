// src/lib/prisma/client.ts

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Global declaration for hot reloading
declare global {
  var prisma: PrismaClient | undefined;
}

// Check if DATABASE_URL is set
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

// ✅ CORRECT: Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: databaseUrl,
});

// ✅ CORRECT: Create Prisma adapter
const adapter = new PrismaPg(pool);

// ✅ CORRECT: Create Prisma client with adapter
const prisma = global.prisma || new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export { prisma };