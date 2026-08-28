import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const newCategories = [
  {
    name: "Men's Wear",
    slug: "mens-wear",
    description: "Premium shirts, trousers, and ethnic wear for men.",
    image: "/images/products/mens-formal-shirt-white.jpg",
    sortOrder: 1,
    isActive: true,
  },
  {
    name: "Women's Wear",
    slug: "womens-wear",
    description: "Elegant ethnic and western wear for women.",
    image: "/images/products/womens-kurti-olive.jpg",
    sortOrder: 2,
    isActive: true,
  },
  {
    name: "Dress Materials",
    slug: "dress-materials",
    description: "Unstitched premium dress materials and suit sets.",
    image: "/images/products/chanderi-dress-material-green.jpg",
    sortOrder: 3,
    isActive: true,
  },
  {
    name: "Kurtis",
    slug: "kurtis",
    description: "Beautiful kurtis for everyday and festive wear.",
    image: "/images/products/chikankari-kurti-pink.jpg",
    sortOrder: 4,
    isActive: true,
  },
  {
    name: "Sarees",
    slug: "sarees",
    description: "Handwoven, silk, and cotton sarees.",
    image: "/images/products/paithani-silk-saree-blue.jpg",
    sortOrder: 5,
    isActive: true,
  },
  {
    name: "Suits",
    slug: "suits",
    description: "Premium suit sets and tailoring materials.",
    image: "/images/products/suit-fabric-charcoal-grey.jpg",
    sortOrder: 6,
    isActive: true,
  },
  {
    name: "Fabrics",
    slug: "fabrics",
    description: "High-quality unstitched fabrics for shirting, suiting, and more.",
    image: "/images/products/premium-cotton-fabric.jpg",
    sortOrder: 7,
    isActive: true,
  },
];

async function main() {
  console.log("Starting category restructuring...");

  try {
    // 1. We need to handle existing products that point to old categories.
    // Let's create a 'General' fallback category temporarily if we delete old ones,
    // or we just delete all products (but user said they want to manage them).
    // Actually, better to just update existing categories or create them if they don't exist.
    
    // First, let's fetch all existing categories
    const existingCategories = await prisma.category.findMany();
    
    // Delete categories that are not in our new list, but wait, this might fail due to foreign key constraints.
    // If a product belongs to a category we delete, Prisma will throw an error.
    // Let's first ensure the new categories exist.
    for (const cat of newCategories) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: cat,
        create: cat,
      });
    }

    // Now, let's get all slugs of new categories
    const newSlugs = newCategories.map(c => c.slug);
    
    // For any category that is NOT in newSlugs, we either delete it or deactivate it.
    // Deactivating is safer so we don't break products.
    for (const oldCat of existingCategories) {
      if (!newSlugs.includes(oldCat.slug)) {
        await prisma.category.update({
          where: { id: oldCat.id },
          data: { isActive: false },
        });
        console.log(`Deactivated old category: ${oldCat.name}`);
      }
    }

    console.log("Categories successfully restructured!");
  } catch (error) {
    console.error("Error restructuring categories:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
