// scripts/migrate-products.ts

// ✅ CORRECT: Standard PrismaClient import for Node.js scripts
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize Prisma Client
const prisma = new PrismaClient();

async function migrateProducts() {
  try {
    console.log('🔄 Starting product migration...');
    console.log(`📡 Database: ${process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'unknown'}`);
    
    // Your migration logic here
    // Example:
    // const products = await prisma.product.findMany({
    //   where: { status: 'DRAFT' },
    // });
    // console.log(`Found ${products.length} draft products`);
    
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateProducts();