-- prisma/seed.sql
-- Complete seed file for AlluraCare with product images

-- ==================== CLEANUP ====================
-- Uncomment to clear existing data
-- DELETE FROM variants;
-- DELETE FROM products;
-- DELETE FROM categories;

-- ==================== CATEGORIES ====================
INSERT INTO categories (id, "nameEn", "nameFa", slug, "isActive", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid()::text, 'Cleansers', 'پاک‌کننده‌ها', 'cleansers', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Moisturizers', 'مرطوب‌کننده‌ها', 'moisturizers', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Serums & Treatments', 'سرم‌ها و درمان‌ها', 'serums', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Sunscreens', 'ضدآفتاب‌ها', 'sunscreens', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Eye Creams', 'کرم‌های دور چشم', 'eye-creams', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Exfoliants', 'لایه‌بردارها', 'exfoliants', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Masks', 'ماسک‌ها', 'masks', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Toners & Essences', 'تونرها و اسانس‌ها', 'toners', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Body Care', 'مراقبت از بدن', 'body-care', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Hair Care', 'مراقبت از مو', 'hair-care', true, NOW(), NOW());

-- ==================== GET CATEGORY IDs ====================
WITH category_ids AS (
  SELECT id, slug FROM categories
)

-- ==================== PRODUCTS WITH IMAGES ====================
-- 1. Anua Heartleaf Pore Control Cleansing Oil (Cleansers)
INSERT INTO products (
  id, "nameEn", "nameFa", slug, "descriptionEn", "descriptionFa",
  benefits, ingredients, "howToUseEn", "howToUseFa",
  "skinTypes", concerns, origin, brand, "categoryId", images, "isActive", "isFeatured",
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid()::text,
  'Anua Heartleaf Pore Control Cleansing Oil',
  'روغن پاک‌کننده آنوا هارتلیف',
  'anua-heartleaf-cleansing-oil',
  'A gentle cleansing oil that removes makeup and impurities while controlling pores.',
  'روغن پاک‌کننده ملایم که آرایش و آلودگی‌ها را پاک کرده و منافذ را کنترل می‌کند.',
  ARRAY['Removes makeup', 'Controls pores', 'Gentle formula'],
  ARRAY['Heartleaf extract', 'Olive oil', 'Jojoba oil'],
  'Apply to dry face, massage gently, rinse with water.',
  'روی پوست خشک بمالید، ماساژ دهید و با آب بشویید.',
  ARRAY['All', 'Combination', 'Oily'],
  ARRAY['Acne', 'Blackheads'],
  'South Korea',
  'Anua',
  id,
  ARRAY[
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/anua-cleansing-oil-main.jpg',
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/anua-cleansing-oil-2.jpg',
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/anua-cleansing-oil-3.jpg'
  ],
  true,
  true,
  NOW(),
  NOW()
FROM category_ids WHERE slug = 'cleansers';

-- 2. Beauty of Joseon Green Plum Refreshing Cleanser (Cleansers)
INSERT INTO products (
  id, "nameEn", "nameFa", slug, "descriptionEn", "descriptionFa",
  benefits, ingredients, "howToUseEn", "howToUseFa",
  "skinTypes", concerns, origin, brand, "categoryId", images, "isActive", "isFeatured",
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid()::text,
  'Beauty of Joseon Green Plum Refreshing Cleanser',
  'پاک‌کننده تازه‌کننده بویتی آو جوسون',
  'boj-green-plum-cleanser',
  'A refreshing cleanser with green plum extract for smooth, glowing skin.',
  'پاک‌کننده تازه‌کننده با عصاره آلو سبز برای پوستی صاف و درخشان.',
  ARRAY['Exfoliates gently', 'Brightens skin', 'Removes impurities'],
  ARRAY['Green plum extract', 'Rice water', 'Papaya extract'],
  'Lather with water, massage onto face, rinse thoroughly.',
  'با آب کف کنید، روی صورت ماساژ دهید و کاملاً آبکشی کنید.',
  ARRAY['All', 'Dull skin'],
  ARRAY['Dullness', 'Uneven texture'],
  'South Korea',
  'Beauty of Joseon',
  id,
  ARRAY[
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/boj-cleanser-main.jpg',
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/boj-cleanser-2.jpg'
  ],
  true,
  true,
  NOW(),
  NOW()
FROM category_ids WHERE slug = 'cleansers';

-- 3. Skin1004 Madagascar Centella Hyalu-Cica Moisture Cream (Moisturizers)
INSERT INTO products (
  id, "nameEn", "nameFa", slug, "descriptionEn", "descriptionFa",
  benefits, ingredients, "howToUseEn", "howToUseFa",
  "skinTypes", concerns, origin, brand, "categoryId", images, "isActive", "isFeatured",
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid()::text,
  'Skin1004 Madagascar Centella Hyalu-Cica Moisture Cream',
  'کرم مرطوب‌کننده اسکین صد و چهار',
  'skin1004-hyalu-cica-cream',
  'A soothing moisturizer with Centella Asiatica and Hyaluronic Acid for deep hydration.',
  'مرطوب‌کننده تسکین‌دهنده با سنتلا آسیاتیکا و اسید هیالورونیک برای آبرسانی عمیق.',
  ARRAY['Deep hydration', 'Soothes irritation', 'Strengthens skin barrier'],
  ARRAY['Centella Asiatica', 'Hyaluronic Acid', 'Niacinamide'],
  'Apply a small amount to cleansed face, gently pat until absorbed.',
  'مقدار کمی روی پوست تمیز بمالید و به آرامی ضربه بزنید تا جذب شود.',
  ARRAY['All', 'Sensitive', 'Dry'],
  ARRAY['Dryness', 'Sensitivity', 'Redness'],
  'South Korea',
  'Skin1004',
  id,
  ARRAY[
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/skin1004-cream-main.jpg',
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/skin1004-cream-2.jpg',
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/skin1004-cream-3.jpg'
  ],
  true,
  true,
  NOW(),
  NOW()
FROM category_ids WHERE slug = 'moisturizers';

-- 4. CosRx Advanced Snail 92 All in One Cream (Moisturizers)
INSERT INTO products (
  id, "nameEn", "nameFa", slug, "descriptionEn", "descriptionFa",
  benefits, ingredients, "howToUseEn", "howToUseFa",
  "skinTypes", concerns, origin, brand, "categoryId", images, "isActive", "isFeatured",
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid()::text,
  'CosRx Advanced Snail 92 All in One Cream',
  'کرم اسنیل کاستی‌آر',
  'cosrx-snail-92-cream',
  'A multi-purpose cream with 92% snail mucin for intense hydration and repair.',
  'کرم چندمنظوره با ۹۲٪ موسین حلزون برای آبرسانی و ترمیم شدید.',
  ARRAY['Intense hydration', 'Repairs damaged skin', 'Improves texture'],
  ARRAY['Snail mucin', 'Hyaluronic Acid', 'Betaine'],
  'Apply to cleansed face and neck, gently massage into skin.',
  'روی صورت و گردن تمیز بمالید و به آرامی ماساژ دهید.',
  ARRAY['All', 'Dry', 'Damaged'],
  ARRAY['Dryness', 'Fine lines', 'Acne scars'],
  'South Korea',
  'CosRx',
  id,
  ARRAY[
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/cosrx-snail-main.jpg',
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/cosrx-snail-2.jpg'
  ],
  true,
  true,
  NOW(),
  NOW()
FROM category_ids WHERE slug = 'moisturizers';

-- 5. Medicube Deep Vita C Serum (Serums)
INSERT INTO products (
  id, "nameEn", "nameFa", slug, "descriptionEn", "descriptionFa",
  benefits, ingredients, "howToUseEn", "howToUseFa",
  "skinTypes", concerns, origin, brand, "categoryId", images, "isActive", "isFeatured",
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid()::text,
  'Medicube Deep Vita C Serum',
  'سرم ویتامین سی مدیکیوب',
  'medicube-vita-c-serum',
  'A powerful vitamin C serum that brightens and evens skin tone.',
  'سرم قوی ویتامین سی که پوست را روشن و یکدست می‌کند.',
  ARRAY['Brightens skin', 'Reduces hyperpigmentation', 'Boosts collagen'],
  ARRAY['Vitamin C', 'Vitamin E', 'Ferulic Acid'],
  'Apply a few drops to cleansed face, gently pat until absorbed.',
  'چند قطره روی پوست تمیز بمالید و به آرامی ضربه بزنید تا جذب شود.',
  ARRAY['All', 'Dull skin'],
  ARRAY['Hyperpigmentation', 'Dullness', 'Dark spots'],
  'South Korea',
  'Medicube',
  id,
  ARRAY[
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/medicube-vitac-main.jpg',
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/medicube-vitac-2.jpg'
  ],
  true,
  true,
  NOW(),
  NOW()
FROM category_ids WHERE slug = 'serums';

-- 6. Laneige Water Bank Blue Hyaluronic Serum (Serums)
INSERT INTO products (
  id, "nameEn", "nameFa", slug, "descriptionEn", "descriptionFa",
  benefits, ingredients, "howToUseEn", "howToUseFa",
  "skinTypes", concerns, origin, brand, "categoryId", images, "isActive", "isFeatured",
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid()::text,
  'Laneige Water Bank Blue Hyaluronic Serum',
  'سرم هیالورونیک لانژ',
  'laneige-blue-hyaluronic-serum',
  'A hydrating serum with blue hyaluronic acid for deep moisture.',
  'سرم آبرسان با هیالورونیک اسید آبی برای رطوبت عمیق.',
  ARRAY['Deep hydration', 'Plumps skin', 'Strengthens barrier'],
  ARRAY['Blue hyaluronic acid', 'Squalane', 'Panthenol'],
  'Apply to cleansed face, gently press into skin.',
  'روی پوست تمیز بمالید و به آرامی فشار دهید تا جذب شود.',
  ARRAY['All', 'Dry', 'Dehydrated'],
  ARRAY['Dryness', 'Dehydration', 'Fine lines'],
  'South Korea',
  'Laneige',
  id,
  ARRAY[
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/laneige-serum-main.jpg',
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/laneige-serum-2.jpg',
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/laneige-serum-3.jpg'
  ],
  true,
  true,
  NOW(),
  NOW()
FROM category_ids WHERE slug = 'serums';

-- 7. Beauty of Joseon Relief Sun Rice + Probiotics SPF 50+ (Sunscreens)
INSERT INTO products (
  id, "nameEn", "nameFa", slug, "descriptionEn", "descriptionFa",
  benefits, ingredients, "howToUseEn", "howToUseFa",
  "skinTypes", concerns, origin, brand, "categoryId", images, "isActive", "isFeatured",
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid()::text,
  'Beauty of Joseon Relief Sun Rice + Probiotics SPF 50+',
  'ضدآفتاب بویتی آو جوسون',
  'boj-relief-sun-spf50',
  'A lightweight sunscreen with rice extract and probiotics for daily protection.',
  'ضدآفتاب سبک با عصاره برنج و پروبیوتیک‌ها برای محافظت روزانه.',
  ARRAY['SPF 50+ protection', 'Lightweight formula', 'Nourishes skin'],
  ARRAY['Rice extract', 'Probiotics', 'Niacinamide'],
  'Apply generously to face 15 minutes before sun exposure.',
  '۱۵ دقیقه قبل از قرار گرفتن در معرض آفتاب روی صورت بمالید.',
  ARRAY['All', 'Sensitive'],
  ARRAY['Sun protection', 'Sensitivity'],
  'South Korea',
  'Beauty of Joseon',
  id,
  ARRAY[
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/boj-sunscreen-main.jpg',
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/boj-sunscreen-2.jpg'
  ],
  true,
  true,
  NOW(),
  NOW()
FROM category_ids WHERE slug = 'sunscreens';

-- 8. La Roche-Posay Anthelios UVMUNE 400 SPF 50+ (Sunscreens)
INSERT INTO products (
  id, "nameEn", "nameFa", slug, "descriptionEn", "descriptionFa",
  benefits, ingredients, "howToUseEn", "howToUseFa",
  "skinTypes", concerns, origin, brand, "categoryId", images, "isActive", "isFeatured",
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid()::text,
  'La Roche-Posay Anthelios UVMUNE 400 SPF 50+',
  'ضدآفتاب لاروش پوزای',
  'laroche-anthelios-spf50',
  'Advanced sunscreen with UVMUNE 400 technology for broad-spectrum protection.',
  'ضدآفتاب پیشرفته با فناوری UVMUNE 400 برای محافظت طیف گسترده.',
  ARRAY['SPF 50+ protection', 'Broad-spectrum', 'Oil-free formula'],
  ARRAY['UV filters', 'Niacinamide', 'Glycerin'],
  'Apply to face and neck before sun exposure.',
  'قبل از قرار گرفتن در معرض آفتاب روی صورت و گردن بمالید.',
  ARRAY['All', 'Sensitive', 'Oily'],
  ARRAY['Sun protection', 'Sensitive skin'],
  'France',
  'La Roche-Posay',
  id,
  ARRAY[
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/lrp-sunscreen-main.jpg',
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/lrp-sunscreen-2.jpg'
  ],
  true,
  true,
  NOW(),
  NOW()
FROM category_ids WHERE slug = 'sunscreens';

-- 9. Caudalie Premier Cru The Eye Cream (Eye Creams)
INSERT INTO products (
  id, "nameEn", "nameFa", slug, "descriptionEn", "descriptionFa",
  benefits, ingredients, "howToUseEn", "howToUseFa",
  "skinTypes", concerns, origin, brand, "categoryId", images, "isActive", "isFeatured",
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid()::text,
  'Caudalie Premier Cru The Eye Cream',
  'کرم دور چشم کودالی',
  'caudalie-premier-cru-eye',
  'A luxurious eye cream that reduces wrinkles, dark circles, and puffiness.',
  'کرم دور چشم لوکس که چین و چروک، تیرگی و پف را کاهش می‌دهد.',
  ARRAY['Reduces wrinkles', 'Brightens dark circles', 'De-puffs eyes'],
  ARRAY['Resveratrol', 'Hyaluronic Acid', 'Vitamins C and E'],
  'Gently tap around the eye area with ring finger.',
  'با انگشت حلقه به آرامی دور چشم ضربه بزنید.',
  ARRAY['All', 'Mature'],
  ARRAY['Fine lines', 'Dark circles', 'Puffiness'],
  'France',
  'Caudalie',
  id,
  ARRAY[
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/caudalie-eye-main.jpg',
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/caudalie-eye-2.jpg'
  ],
  true,
  true,
  NOW(),
  NOW()
FROM category_ids WHERE slug = 'eye-creams';

-- 10. Some By Mi AHA BHA PHA 30 Days Miracle Serum (Exfoliants)
INSERT INTO products (
  id, "nameEn", "nameFa", slug, "descriptionEn", "descriptionFa",
  benefits, ingredients, "howToUseEn", "howToUseFa",
  "skinTypes", concerns, origin, brand, "categoryId", images, "isActive", "isFeatured",
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid()::text,
  'Some By Mi AHA BHA PHA 30 Days Miracle Serum',
  'سرم لایه‌بردار سام بای می',
  'somebymi-miracle-serum',
  'A gentle exfoliating serum with AHA, BHA, and PHA for smooth, clear skin.',
  'سرم لایه‌بردار ملایم با AHA، BHA و PHA برای پوستی صاف و شفاف.',
  ARRAY['Gentle exfoliation', 'Reduces acne', 'Improves texture'],
  ARRAY['AHA', 'BHA', 'PHA', 'Tea tree extract'],
  'Apply to cleansed face, leave for 15 minutes, rinse.',
  'روی پوست تمیز بمالید، ۱۵ دقیقه بگذارید و آبکشی کنید.',
  ARRAY['All', 'Acne-prone'],
  ARRAY['Acne', 'Uneven texture', 'Blackheads'],
  'South Korea',
  'Some By Mi',
  id,
  ARRAY[
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/somebymi-serum-main.jpg',
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/somebymi-serum-2.jpg'
  ],
  true,
  true,
  NOW(),
  NOW()
FROM category_ids WHERE slug = 'exfoliants';

-- 11. Innisfree Super Volcanic Pore Clay Mask (Masks)
INSERT INTO products (
  id, "nameEn", "nameFa", slug, "descriptionEn", "descriptionFa",
  benefits, ingredients, "howToUseEn", "howToUseFa",
  "skinTypes", concerns, origin, brand, "categoryId", images, "isActive", "isFeatured",
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid()::text,
  'Innisfree Super Volcanic Pore Clay Mask',
  'ماسک خاک رس اینیسفری',
  'innisfree-volcanic-clay-mask',
  'A pore-tightening clay mask with volcanic ash to absorb excess oil.',
  'ماسک خاک رس سفت‌کننده منافذ با خاکستر آتشفشانی برای جذب چربی اضافی.',
  ARRAY['Tightens pores', 'Absorbs oil', 'Clears blackheads'],
  ARRAY['Volcanic ash', 'Kaolin', 'Bentonite'],
  'Apply to clean, dry skin, leave for 10-15 minutes, rinse.',
  'روی پوست تمیز و خشک بمالید، ۱۰-۱۵ دقیقه بگذارید و آبکشی کنید.',
  ARRAY['Oily', 'Combination'],
  ARRAY['Large pores', 'Excess oil', 'Blackheads'],
  'South Korea',
  'Innisfree',
  id,
  ARRAY[
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/innisfree-mask-main.jpg',
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/innisfree-mask-2.jpg',
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/innisfree-mask-3.jpg'
  ],
  true,
  true,
  NOW(),
  NOW()
FROM category_ids WHERE slug = 'masks';

-- 12. Anua Heartleaf 77% Soothing Toner (Toners)
INSERT INTO products (
  id, "nameEn", "nameFa", slug, "descriptionEn", "descriptionFa",
  benefits, ingredients, "howToUseEn", "howToUseFa",
  "skinTypes", concerns, origin, brand, "categoryId", images, "isActive", "isFeatured",
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid()::text,
  'Anua Heartleaf 77% Soothing Toner',
  'تونر آنوا هارتلیف',
  'anua-heartleaf-toner',
  'A soothing toner with 77% heartleaf extract to calm irritated skin.',
  'تونر تسکین‌دهنده با ۷۷٪ عصاره هارتلیف برای آرام‌کردن پوست تحریک‌شده.',
  ARRAY['Soothes irritation', 'Hydrates skin', 'Balances pH'],
  ARRAY['Heartleaf extract', 'Panthenol', 'Allantoin'],
  'Apply to cleansed face using a cotton pad or hands.',
  'با پد پنبه‌ای یا دست روی پوست تمیز بمالید.',
  ARRAY['All', 'Sensitive'],
  ARRAY['Irritation', 'Redness', 'Dryness'],
  'South Korea',
  'Anua',
  id,
  ARRAY[
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/anua-toner-main.jpg',
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/anua-toner-2.jpg'
  ],
  true,
  true,
  NOW(),
  NOW()
FROM category_ids WHERE slug = 'toners';

-- 13. Olaplex No. 3 Hair Perfector (Hair Care)
INSERT INTO products (
  id, "nameEn", "nameFa", slug, "descriptionEn", "descriptionFa",
  benefits, ingredients, "howToUseEn", "howToUseFa",
  "skinTypes", concerns, origin, brand, "categoryId", images, "isActive", "isFeatured",
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid()::text,
  'Olaplex No. 3 Hair Perfector',
  'ترمیم‌کننده مو اولاپلکس',
  'olaplex-no3-hair-perfector',
  'A bond-building treatment that repairs and strengthens damaged hair.',
  'درمان ترمیم‌کننده پیوندهای مو که موهای آسیب‌دیده را ترمیم و تقویت می‌کند.',
  ARRAY['Repairs bonds', 'Strengthens hair', 'Reduces breakage'],
  ARRAY['Bis-Aminopropyl Diglycol Dimaleate', 'Hydrolyzed Vegetable Protein'],
  'Apply to damp hair, leave for 10-20 minutes, shampoo and condition.',
  'روی موهای مرطوب بمالید، ۱۰-۲۰ دقیقه بگذارید و شامپو و نرم‌کننده بزنید.',
  ARRAY['All'],
  ARRAY['Damaged hair', 'Breakage', 'Dryness'],
  'USA',
  'Olaplex',
  id,
  ARRAY[
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/olaplex-main.jpg',
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/olaplex-2.jpg'
  ],
  true,
  true,
  NOW(),
  NOW()
FROM category_ids WHERE slug = 'hair-care';

-- 14. Dove Deeply Nourishing Body Lotion (Body Care)
INSERT INTO products (
  id, "nameEn", "nameFa", slug, "descriptionEn", "descriptionFa",
  benefits, ingredients, "howToUseEn", "howToUseFa",
  "skinTypes", concerns, origin, brand, "categoryId", images, "isActive", "isFeatured",
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid()::text,
  'Dove Deeply Nourishing Body Lotion',
  'لوسیون بدن داو',
  'dove-deeply-nourishing-lotion',
  'A deeply nourishing body lotion with 24-hour moisturization.',
  'لوسیون بدن مغذی با آبرسانی ۲۴ ساعته.',
  ARRAY['24-hour hydration', 'Nourishes skin', 'Non-greasy'],
  ARRAY['Glycerin', 'Stearic acid', 'Shea butter'],
  'Apply all over body after shower, massage into skin.',
  'بعد از حمام روی تمام بدن بمالید و ماساژ دهید.',
  ARRAY['All', 'Dry'],
  ARRAY['Dryness', 'Rough skin'],
  'USA',
  'Dove',
  id,
  ARRAY[
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/dove-lotion-main.jpg',
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/dove-lotion-2.jpg'
  ],
  true,
  true,
  NOW(),
  NOW()
FROM category_ids WHERE slug = 'body-care';

-- 15. Purito Centella Unscented Serum (Serums)
INSERT INTO products (
  id, "nameEn", "nameFa", slug, "descriptionEn", "descriptionFa",
  benefits, ingredients, "howToUseEn", "howToUseFa",
  "skinTypes", concerns, origin, brand, "categoryId", images, "isActive", "isFeatured",
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid()::text,
  'Purito Centella Unscented Serum',
  'سرم سنتلا پوریتو',
  'purito-centella-serum',
  'A soothing serum with centella asiatica for sensitive, irritated skin.',
  'سرم تسکین‌دهنده با سنتلا آسیاتیکا برای پوست حساس و تحریک‌شده.',
  ARRAY['Soothes irritation', 'Calms redness', 'Strengthens barrier'],
  ARRAY['Centella Asiatica', 'Panthenol', 'Niacinamide'],
  'Apply a few drops to cleansed face, gently pat until absorbed.',
  'چند قطره روی پوست تمیز بمالید و به آرامی ضربه بزنید تا جذب شود.',
  ARRAY['All', 'Sensitive'],
  ARRAY['Sensitivity', 'Redness', 'Irritation'],
  'South Korea',
  'Purito',
  id,
  ARRAY[
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/purito-serum-main.jpg',
    'https://res.cloudinary.com/demo/image/upload/v1/skincare/purito-serum-2.jpg'
  ],
  true,
  true,
  NOW(),
  NOW()
FROM category_ids WHERE slug = 'serums';

-- ==================== VARIANTS ====================
-- Get product IDs for variant insertion
WITH product_ids AS (
  SELECT id, slug FROM products
)

-- 1. Anua Heartleaf Pore Control Cleansing Oil
INSERT INTO variants (id, "productId", size, price, "comparePrice", stock, sku, "isDefault", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid()::text,
  id,
  '200ml',
  25.00,
  30.00,
  50,
  'ANUA-001',
  true,
  NOW(),
  NOW()
FROM product_ids WHERE slug = 'anua-heartleaf-cleansing-oil'
UNION ALL
SELECT 
  gen_random_uuid()::text,
  id,
  '350ml',
  38.00,
  45.00,
  30,
  'ANUA-002',
  false,
  NOW(),
  NOW()
FROM product_ids WHERE slug = 'anua-heartleaf-cleansing-oil';

-- 2. Beauty of Joseon Green Plum Refreshing Cleanser
INSERT INTO variants (id, "productId", size, price, "comparePrice", stock, sku, "isDefault", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid()::text,
  id,
  '100ml',
  15.00,
  18.00,
  60,
  'BOJ-001',
  true,
  NOW(),
  NOW()
FROM product_ids WHERE slug = 'boj-green-plum-cleanser';

-- 3. Skin1004 Madagascar Centella Hyalu-Cica Moisture Cream
INSERT INTO variants (id, "productId", size, price, "comparePrice", stock, sku, "isDefault", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid()::text,
  id,
  '50ml',
  28.00,
  35.00,
  40,
  'SKIN-001',
  true,
  NOW(),
  NOW()
FROM product_ids WHERE slug = 'skin1004-hyalu-cica-cream'
UNION ALL
SELECT 
  gen_random_uuid()::text,
  id,
  '100ml',
  45.00,
  55.00,
  25,
  'SKIN-002',
  false,
  NOW(),
  NOW()
FROM product_ids WHERE slug = 'skin1004-hyalu-cica-cream';

-- 4. CosRx Advanced Snail 92 All in One Cream
INSERT INTO variants (id, "productId", size, price, "comparePrice", stock, sku, "isDefault", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid()::text,
  id,
  '100ml',
  22.00,
  28.00,
  55,
  'COSRX-001',
  true,
  NOW(),
  NOW()
FROM product_ids WHERE slug = 'cosrx-snail-92-cream';

-- 5. Medicube Deep Vita C Serum
INSERT INTO variants (id, "productId", size, price, "comparePrice", stock, sku, "isDefault", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid()::text,
  id,
  '30ml',
  35.00,
  42.00,
  35,
  'MEDI-001',
  true,
  NOW(),
  NOW()
FROM product_ids WHERE slug = 'medicube-vita-c-serum'
UNION ALL
SELECT 
  gen_random_uuid()::text,
  id,
  '60ml',
  55.00,
  65.00,
  20,
  'MEDI-002',
  false,
  NOW(),
  NOW()
FROM product_ids WHERE slug = 'medicube-vita-c-serum';

-- 6. Laneige Water Bank Blue Hyaluronic Serum
INSERT INTO variants (id, "productId", size, price, "comparePrice", stock, sku, "isDefault", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid()::text,
  id,
  '50ml',
  32.00,
  38.00,
  30,
  'LANE-001',
  true,
  NOW(),
  NOW()
FROM product_ids WHERE slug = 'laneige-blue-hyaluronic-serum';

-- 7. Beauty of Joseon Relief Sun SPF 50+
INSERT INTO variants (id, "productId", size, price, "comparePrice", stock, sku, "isDefault", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid()::text,
  id,
  '50ml',
  18.00,
  22.00,
  60,
  'BOJ-002',
  true,
  NOW(),
  NOW()
FROM product_ids WHERE slug = 'boj-relief-sun-spf50';

-- 8. La Roche-Posay Anthelios UVMUNE 400 SPF 50+
INSERT INTO variants (id, "productId", size, price, "comparePrice", stock, sku, "isDefault", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid()::text,
  id,
  '50ml',
  32.00,
  38.00,
  45,
  'LRP-001',
  true,
  NOW(),
  NOW()
FROM product_ids WHERE slug = 'laroche-anthelios-spf50';

-- 9. Caudalie Premier Cru The Eye Cream
INSERT INTO variants (id, "productId", size, price, "comparePrice", stock, sku, "isDefault", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid()::text,
  id,
  '15ml',
  48.00,
  55.00,
  20,
  'CAUD-001',
  true,
  NOW(),
  NOW()
FROM product_ids WHERE slug = 'caudalie-premier-cru-eye';

-- 10. Some By Mi AHA BHA PHA 30 Days Miracle Serum
INSERT INTO variants (id, "productId", size, price, "comparePrice", stock, sku, "isDefault", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid()::text,
  id,
  '100ml',
  20.00,
  25.00,
  40,
  'SBM-001',
  true,
  NOW(),
  NOW()
FROM product_ids WHERE slug = 'somebymi-miracle-serum';

-- 11. Innisfree Super Volcanic Pore Clay Mask
INSERT INTO variants (id, "productId", size, price, "comparePrice", stock, sku, "isDefault", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid()::text,
  id,
  '100ml',
  15.00,
  18.00,
  50,
  'INNI-001',
  true,
  NOW(),
  NOW()
FROM product_ids WHERE slug = 'innisfree-volcanic-clay-mask'
UNION ALL
SELECT 
  gen_random_uuid()::text,
  id,
  '200ml',
  25.00,
  30.00,
  30,
  'INNI-002',
  false,
  NOW(),
  NOW()
FROM product_ids WHERE slug = 'innisfree-volcanic-clay-mask';

-- 12. Anua Heartleaf 77% Soothing Toner
INSERT INTO variants (id, "productId", size, price, "comparePrice", stock, sku, "isDefault", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid()::text,
  id,
  '250ml',
  18.00,
  22.00,
  55,
  'ANUA-003',
  true,
  NOW(),
  NOW()
FROM product_ids WHERE slug = 'anua-heartleaf-toner';

-- 13. Olaplex No. 3 Hair Perfector
INSERT INTO variants (id, "productId", size, price, "comparePrice", stock, sku, "isDefault", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid()::text,
  id,
  '100ml',
  30.00,
  35.00,
  25,
  'OLAP-001',
  true,
  NOW(),
  NOW()
FROM product_ids WHERE slug = 'olaplex-no3-hair-perfector'
UNION ALL
SELECT 
  gen_random_uuid()::text,
  id,
  '250ml',
  60.00,
  70.00,
  15,
  'OLAP-002',
  false,
  NOW(),
  NOW()
FROM product_ids WHERE slug = 'olaplex-no3-hair-perfector';

-- 14. Dove Deeply Nourishing Body Lotion
INSERT INTO variants (id, "productId", size, price, "comparePrice", stock, sku, "isDefault", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid()::text,
  id,
  '400ml',
  12.00,
  15.00,
  60,
  'DOVE-001',
  true,
  NOW(),
  NOW()
FROM product_ids WHERE slug = 'dove-deeply-nourishing-lotion';

-- 15. Purito Centella Unscented Serum
INSERT INTO variants (id, "productId", size, price, "comparePrice", stock, sku, "isDefault", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid()::text,
  id,
  '30ml',
  20.00,
  25.00,
  40,
  'PUR-001',
  true,
  NOW(),
  NOW()
FROM product_ids WHERE slug = 'purito-centella-serum';

-- ==================== VERIFICATION ====================
SELECT 'Categories' as "Table", COUNT(*) as "Count" FROM categories
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Variants', COUNT(*) FROM variants;
