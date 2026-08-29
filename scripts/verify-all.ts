import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function verify() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: { products: { include: { images: true } } }
  });

  console.log("=================== CATEGORIES & PRODUCTS CHECK ===================");
  for (const c of categories) {
    console.log(`Category: "${c.name}" | slug: "/category/${c.slug}" | products count: ${c.products.length}`);
    for (const p of c.products) {
      const imgPath = path.join(process.cwd(), "public", p.images[0]?.url || "");
      const exists = fs.existsSync(imgPath);
      console.log(`  └─ Product: "${p.name}" | slug: "/product/${p.slug}" | Price: ₹${p.price} | Image Exists: ${exists} (${p.images[0]?.url})`);
    }
  }
}

verify().catch(console.error).finally(() => prisma.$disconnect());
