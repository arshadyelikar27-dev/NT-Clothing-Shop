import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.findFirst();
  if (!category) {
    console.log("No category found. Please create a category first.");
    return;
  }

  const colors = [
    { name: "Ruby Red", img: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=500&q=80" },
    { name: "Emerald Green", img: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500&q=80" },
    { name: "Sapphire Blue", img: "https://images.unsplash.com/photo-1584483726514-98ce073c66f5?w=500&q=80" },
    { name: "Midnight Black", img: "https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?w=500&q=80" },
    { name: "Pearl White", img: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=500&q=80" },
    { name: "Golden Yellow", img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80" },
    { name: "Lavender Purple", img: "https://images.unsplash.com/photo-1520108933519-7557161b96a9?w=500&q=80" },
    { name: "Coral Pink", img: "https://images.unsplash.com/photo-1512413914619-35a11c1e7a56?w=500&q=80" },
  ];

  const variantsToCreate = colors.map(c => ({
    name: "Color",
    type: "COLOR",
    value: c.name,
    imageUrl: c.img
  }));

  const sizes = ["S", "M", "L", "XL"].map(s => ({
    name: "Size",
    type: "SIZE",
    value: s
  }));

  const product = await prisma.product.create({
    data: {
      name: "Premium Demo Dress (8 Colors)",
      slug: "premium-demo-dress-" + Date.now(),
      description: "A demo dress featuring 8 distinct colors to test the Flipkart-like variant selection.",
      sku: "DEMO-8C",
      price: 1500,
      categoryId: category.id,
      stock: 100,
      unitType: "PER_PIECE",
      images: {
        create: [
          { url: colors[0].img, sortOrder: 0, isPrimary: true },
          { url: colors[1].img, sortOrder: 1, isPrimary: false }
        ]
      },
      variants: {
        create: [...variantsToCreate, ...sizes]
      }
    }
  });

  console.log("Created Demo Product: " + product.slug);
}

main().catch(console.error).finally(() => prisma.$disconnect());
