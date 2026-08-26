import React from 'react';
import ProductForm from '../../../ProductForm';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.query.products.findFirst({
    where: eq(products.id, parseInt(id)),
  });

  if (!product) notFound();

  const categories = await db.query.categories.findMany();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <ProductForm categories={categories} initialData={product} />
    </div>
  );
}
