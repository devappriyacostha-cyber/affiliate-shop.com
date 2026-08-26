import React from 'react';
import ProductForm from '../../ProductForm';
import { db } from '@/db';

export default async function NewProductPage() {
  const categories = await db.query.categories.findMany();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <ProductForm categories={categories} />
    </div>
  );
}
