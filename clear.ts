import { db } from './src/db';
import { products, categories, banners, settings } from './src/db/schema';

async function clearAll() {
  console.log('Clearing all data...');

  await db.delete(products);
  console.log('Cleared products.');
  
  await db.delete(categories);
  console.log('Cleared categories.');
  
  await db.delete(banners);
  console.log('Cleared banners.');
  
  await db.delete(settings);
  console.log('Cleared settings.');

  console.log('All data cleared successfully! Your website is now a fresh slate.');
}

clearAll().catch(err => {
  console.error(err);
  process.exit(1);
});
