// src/lib/prisma/client.ts

import { PrismaClient } from '@prisma/client';

// Global declaration for hot reloading
declare global {
  var prisma: PrismaClient | undefined;
}

// Create the Prisma client with proper connection
const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export { prisma };