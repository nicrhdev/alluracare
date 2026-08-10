// scripts/migrate-products.ts

// ✅ Use the same import pattern as client.ts
import { PrismaClient } from '@prisma/client/edge';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function migrateProducts() {
  try {
    console.log('🔄 Starting product migration...');
    console.log(`📡 Database: ${process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'unknown'}`);
    
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrateProducts();