import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany({
    include: {
      children: true,
      products: {
        include: { images: true }
      }
    }
  });

  console.log("CATEGORIES IN DB:", JSON.stringify(categories, null, 2));

  const allProducts = await prisma.product.findMany({
    include: {
      category: true,
      images: true,
      variants: true
    }
  });

  console.log("TOTAL PRODUCTS:", allProducts.length);
}

main().catch(console.error).finally(() => prisma.$disconnect());
