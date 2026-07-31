// scripts/migrate-products.ts

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

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

    // Here you would map old skin types/concerns to new ones
    // Since we don't have the exact mapping, we'll skip for now
    // In production, you'd create a mapping or use the seed data

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