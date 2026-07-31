// scripts/seed-concerns.ts

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create the Prisma adapter
const adapter = new PrismaPg(pool);

// Initialize Prisma Client with the adapter
const prisma = new PrismaClient({ adapter });

const concerns = [
  { nameEn: 'Acne & Breakouts', nameFa: 'آکنه و جوش', slug: 'acne-breakouts' },
  { nameEn: 'Acne Scars', nameFa: 'جای جوش', slug: 'acne-scars' },
  { nameEn: 'Dark Spots & Hyperpigmentation', nameFa: 'لکه‌های تیره و هایپرپیگمنتیشن', slug: 'dark-spots' },
  { nameEn: 'Brightening & Dullness', nameFa: 'روشن‌کنندگی و رفع کدری', slug: 'brightening-dullness' },
  { nameEn: 'Dry & Dehydrated Skin', nameFa: 'پوست خشک و دهیدراته', slug: 'dry-dehydrated' },
  { nameEn: 'Oily Skin', nameFa: 'پوست چرب', slug: 'oily-skin' },
  { nameEn: 'Sensitive Skin', nameFa: 'پوست حساس', slug: 'sensitive-skin' },
  { nameEn: 'Redness', nameFa: 'قرمزی و التهاب', slug: 'redness' },
  { nameEn: 'Large Pores', nameFa: 'منافذ باز', slug: 'large-pores' },
  { nameEn: 'Blackheads & Whiteheads', nameFa: 'جوش سرسیاه و سرسفید', slug: 'blackheads-whiteheads' },
  { nameEn: 'Anti-Aging', nameFa: 'جوانسازی', slug: 'anti-aging' },
  { nameEn: 'Fine Lines & Wrinkles', nameFa: 'خطوط ریز و چین و چروک', slug: 'fine-lines-wrinkles' },
  { nameEn: 'Loss of Firmness', nameFa: 'افتادگی پوست', slug: 'loss-of-firmness' },
  { nameEn: 'Skin Barrier Repair', nameFa: 'ترمیم سد دفاعی پوست', slug: 'skin-barrier-repair' },
  { nameEn: 'Uneven Texture', nameFa: 'بافت ناهموار', slug: 'uneven-texture' },
];

async function main() {
  console.log('🌱 Seeding concerns...');
  for (const c of concerns) {
    try {
      await prisma.concern.upsert({
        where: { slug: c.slug },
        update: {},
        create: {
          nameEn: c.nameEn,
          nameFa: c.nameFa,
          slug: c.slug,
        },
      });
      console.log(`✅ Created concern: ${c.nameEn} / ${c.nameFa}`);
    } catch (error) {
      console.error(`Failed to seed concern "${c.nameEn}":`, error);
    }
  }
  console.log(`✅ Created ${concerns.length} concerns`);
  console.log('🌱 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });