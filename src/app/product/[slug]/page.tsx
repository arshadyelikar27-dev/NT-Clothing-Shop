export const revalidate = 60;

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetailClient } from "./ProductDetailClient";
import {
  getCachedProductBySlug,
  getCachedRelatedProducts,
} from "@/lib/cached-queries";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCachedProductBySlug(slug);

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.seoTitle || product.name} — NOBLE TEXTILE`,
    description:
      product.seoDescription ||
      product.shortDescription ||
      product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getCachedProductBySlug(slug);

  if (!product) notFound();

  // Related products from cache
  const related = await getCachedRelatedProducts(product.categoryId, product.id);

  return (
    <ProductDetailClient
      product={JSON.parse(JSON.stringify(product))}
      relatedProducts={JSON.parse(JSON.stringify(related))}
    />
  );
}
