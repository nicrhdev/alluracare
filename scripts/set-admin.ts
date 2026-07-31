// scripts/set-admin.ts

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { execSync } from 'child_process';

// Load environment variables
dotenv.config();

// In Prisma v7, we need to handle the client differently
// Use the same approach as the seed script

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in environment variables');
  process.exit(1);
}

console.log('🔍 Connecting to database...');

// Create PrismaClient with the URL from environment
const prisma = new PrismaClient({
  // This is the key for Prisma v7
  // We need to use the `adapter` or `accelerateUrl`
  // For local development, we use a direct connection
  // We'll use the `adapter` approach
});

// Override the connection URL at runtime
// This is a workaround for Prisma v7
(prisma as any)._engineConfig = {
  ...(prisma as any)._engineConfig,
  datasourceUrl: process.env.DATABASE_URL,
};

async function main() {
  // Get email from command line arguments
  const email = process.argv[2];
  
  if (!email) {
    console.error('❌ Please provide an email address:');
    console.error('  npm run set-admin user@example.com');
    process.exit(1);
  }

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`❌ User with email "${email}" not found.`);
      console.log('💡 Please register first, or check the email address.');
      process.exit(1);
    }

    // Update user to admin
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });

    console.log(`✅ User ${updatedUser.email} is now an ADMIN!`);
    console.log(`   Role: ${updatedUser.role}`);
    console.log(`   Name: ${updatedUser.name || 'Not set'}`);
  } catch (error) {
    console.error('❌ Error occurred:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();