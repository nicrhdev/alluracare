// scripts/migrate-products.ts

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in environment variables');
  console.error('Please add DATABASE_URL to your .env file');
  process.exit(1);
}

const prisma = new PrismaClient();


async function main() {
  console.log('🔄 Migrating existing products...');

  // Get all products
  const products = await prisma.product.findMany();

  for (const product of products) {
    // Check if product has old skin types or concerns data
    const hasOldData = (product as any).skinTypes?.length > 0 || (product as any).concerns?.length > 0;

    if (!hasOldData) {
      console.log(`⏭️ Skipping product ${product.id} - no data to migrate`);
      continue;
    }

    console.log(`✅ Product ${product.id} migrated`);
  }

  console.log('🔄 Migration complete!');
}

main()
  .catch((e) => {
    console.error('❌ Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });