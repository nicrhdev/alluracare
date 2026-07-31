// scripts/seed-options.ts

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

const skinTypes = [
  { nameEn: 'Dry', nameFa: 'خشک', slug: 'dry' },
  { nameEn: 'Oily', nameFa: 'چرب', slug: 'oily' },
  { nameEn: 'Combination', nameFa: 'مختلط', slug: 'combination' },
  { nameEn: 'Sensitive', nameFa: 'حساس', slug: 'sensitive' },
  { nameEn: 'Normal', nameFa: 'نرمال', slug: 'normal' },
  { nameEn: 'Acne-prone', nameFa: 'مستعد آکنه', slug: 'acne-prone' },
  { nameEn: 'Aging', nameFa: 'پیر', slug: 'aging' },
  { nameEn: 'Dehydrated', nameFa: 'کم آب', slug: 'dehydrated' },
];

const concerns = [
  { nameEn: 'Acne', nameFa: 'آکنه', slug: 'acne' },
  { nameEn: 'Aging', nameFa: 'پیری', slug: 'aging' },
  { nameEn: 'Dryness', nameFa: 'خشکی', slug: 'dryness' },
  { nameEn: 'Hyperpigmentation', nameFa: 'هایپرپیگمنتیشن', slug: 'hyperpigmentation' },
  { nameEn: 'Redness', nameFa: 'قرمزی', slug: 'redness' },
  { nameEn: 'Irritation', nameFa: 'تحریک', slug: 'irritation' },
  { nameEn: 'Oiliness', nameFa: 'چربی', slug: 'oiliness' },
  { nameEn: 'Large Pores', nameFa: 'منافذ باز', slug: 'large-pores' },
  { nameEn: 'Blackheads', nameFa: 'جوش سرسیاه', slug: 'blackheads' },
  { nameEn: 'Whiteheads', nameFa: 'جوش سرسفید', slug: 'whiteheads' },
  { nameEn: 'Fine Lines', nameFa: 'خطوط ریز', slug: 'fine-lines' },
  { nameEn: 'Wrinkles', nameFa: 'چین و چروک', slug: 'wrinkles' },
  { nameEn: 'Dullness', nameFa: 'کدری', slug: 'dullness' },
  { nameEn: 'Uneven Texture', nameFa: 'بافت ناهموار', slug: 'uneven-texture' },
  { nameEn: 'Sensitive Skin', nameFa: 'پوست حساس', slug: 'sensitive-skin' },
];

async function main() {
  console.log('🌱 Seeding skin types...');
  for (const st of skinTypes) {
    try {
      await prisma.skinType.upsert({
        where: { slug: st.slug },
        update: {},
        create: st,
      });
    } catch (error) {
      console.error(`Failed to create skin type ${st.slug}:`, error);
    }
  }
  console.log(`✅ Created ${skinTypes.length} skin types`);

  console.log('🌱 Seeding concerns...');
  for (const c of concerns) {
    try {
      await prisma.concern.upsert({
        where: { slug: c.slug },
        update: {},
        create: c,
      });
    } catch (error) {
      console.error(`Failed to create concern ${c.slug}:`, error);
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