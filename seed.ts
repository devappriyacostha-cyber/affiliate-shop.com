import { db } from './src/db';
import { categories, products } from './src/db/schema';

async function seed() {
  console.log('--- Database Seeding Started ---');

  // 1. පවතින සියලුම දත්ත මකා දැමීම (Clean up)
  await db.delete(products);
  await db.delete(categories);

  console.log('Existing data cleared.');

  // 2. Categories ඇතුළත් කිරීම
  const insertedCategories = await db.insert(categories).values([
    { name: 'Electronics', slug: 'electronics', icon: 'Laptop', order: 1 },
    { name: 'Fashion', slug: 'fashion', icon: 'Shirt', order: 2 },
    { name: 'Home & Living', slug: 'home-living', icon: 'Home', order: 3 },
  ]).returning();

  const electronics = insertedCategories[0];
  const fashion = insertedCategories[1];
  const home = insertedCategories[2];

  console.log('Categories created successfully.');

  // 3. Products ඇතුළත් කිරීම (අලුත් Fields සමඟ)
  await db.insert(products).values([
    {
      name: 'Premium Smartphone X1 Pro Titanium Edition',
      shortName: 'Smartphone X1 Pro',
      description: 'Experience the next level of mobile technology with the X1 Pro. Featuring a titanium body and the fastest processor ever.',
      price: '285000.00',
      originalPrice: '320000.00',
      discountPercent: 11,
      imageUrls: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80'],
      categoryId: electronics.id,
      rating: '4.9',
      affiliateUrl: 'https://daraz.lk',
      isHot: true,
      isFeatured: true,
    },
    {
      name: 'Elite Smart Watch Series 7 with Health Tracking',
      shortName: 'Elite Smart Watch',
      description: 'Stay connected and healthy with the Elite Smart Watch. Real-time health tracking and 7-day battery life.',
      price: '45000.00',
      originalPrice: '55000.00',
      discountPercent: 18,
      imageUrls: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
      categoryId: electronics.id,
      rating: '4.8',
      affiliateUrl: 'https://daraz.lk',
      isHot: true,
      isFeatured: false,
    },
    {
      name: 'Sony WH-1000XM5 Premium Noise Cancelling Headphones',
      shortName: 'Sony WH-1000XM5',
      description: 'Industry-leading noise cancellation and superior sound quality.',
      price: '95000.00',
      originalPrice: '110000.00',
      discountPercent: 14,
      imageUrls: ['https://images.unsplash.com/photo-1618366712277-7bcfa203c39a?w=800&q=80'],
      categoryId: electronics.id,
      rating: '4.9',
      affiliateUrl: 'https://daraz.lk',
      isHot: false,
      isFeatured: true,
    },
    {
      name: 'Modern Slim-Fit Cotton T-Shirt',
      shortName: 'Cotton T-Shirt',
      description: 'Comfortable and stylish cotton t-shirt for everyday wear.',
      price: '1800.00',
      originalPrice: '2500.00',
      discountPercent: 28,
      imageUrls: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
      categoryId: fashion.id,
      rating: '4.5',
      affiliateUrl: 'https://daraz.lk',
      isHot: false,
      isFeatured: false,
    },
    {
      name: 'Professional Wireless Gaming Mouse RGB',
      shortName: 'Gaming Mouse',
      description: 'High-precision wireless gaming mouse with RGB lighting.',
      price: '12500.00',
      originalPrice: '15000.00',
      discountPercent: 16,
      imageUrls: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80'],
      categoryId: electronics.id,
      rating: '4.7',
      affiliateUrl: 'https://daraz.lk',
      isHot: true,
      isFeatured: true,
    },
    {
      name: 'LED Adjustable Desk Lamp for Workspace',
      shortName: 'LED Desk Lamp',
      description: 'Adjustable brightness and color temperature for your workspace.',
      price: '5500.00',
      originalPrice: '7500.00',
      discountPercent: 26,
      imageUrls: ['https://images.unsplash.com/photo-1507473884658-66a3ea93eafa?w=800&q=80'],
      categoryId: home.id,
      rating: '4.6',
      affiliateUrl: 'https://daraz.lk',
      isHot: false,
      isFeatured: false,
    },
  ]);

  console.log('--- Seeding Completed Successfully! ---');
}

seed().catch(err => {
  console.error('Seeding Failed:', err);
  process.exit(1);
});
