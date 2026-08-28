import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting fresh database seed for NOBLE TEXTILE...");

  // ─── Admin User ───
  const adminPassword = await bcrypt.hash("Admin@12345", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@nobletextile.com" },
    update: {
      password: adminPassword,
      role: "ADMIN",
    },
    create: {
      email: "admin@nobletextile.com",
      name: "Store Administrator",
      password: adminPassword,
      role: "ADMIN",
      phone: "+917821059350",
    },
  });
  console.log(`✓ Admin user configured: ${admin.email}`);

  // ─── Categories with Dedicated Photography ───
  const categoriesData = [
    {
      name: "Sarees",
      slug: "sarees",
      description: "Handloom Banarasi, Paithani, and festive silk drapery",
      image: "/images/products/paithani-silk-saree-blue.jpg",
      sortOrder: 1,
    },
    {
      name: "Dress Materials",
      slug: "dress-materials",
      description: "Unstitched Chanderi, cotton, and embroidered suit sets",
      image: "/images/products/chanderi-dress-material-green.jpg",
      sortOrder: 2,
    },
    {
      name: "Fabrics",
      slug: "fabrics",
      description: "Quality running fabrics sold by the meter",
      image: "/images/products/printed-cotton-fabric.jpg",
      sortOrder: 3,
    },
    {
      name: "Kurtis",
      slug: "kurtis",
      description: "Ready-to-wear designer & Chikankari kurtis for women",
      image: "/images/products/chikankari-kurti-pink.jpg",
      sortOrder: 4,
    },
    {
      name: "Men's Wear",
      slug: "mens-wear",
      description: "Oxford shirts, premium shirt fabrics, and luxury suiting",
      image: "/images/products/mens-shirt-fabric-blue-check.jpg",
      sortOrder: 5,
    },
    {
      name: "Dupattas",
      slug: "dupattas",
      description: "Handcrafted Banarasi silk and cotton dupattas & stoles",
      image: "/images/products/banarasi-silk-saree-maroon.jpg",
      sortOrder: 6,
    },
    {
      name: "Kids Wear",
      slug: "kids-wear",
      description: "Festive and comfortable ethnic wear for children",
      image: "/images/products/womens-kurti-olive.jpg",
      sortOrder: 7,
    },
    {
      name: "Seasonal Collection",
      slug: "seasonal",
      description: "Curated festive and monsoon textile picks",
      image: "/images/products/linen-blend-fabric.jpg",
      sortOrder: 8,
    },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        image: cat.image,
        sortOrder: cat.sortOrder,
      },
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
  }
  console.log(`✓ ${categoriesData.length} categories created with dedicated photography`);

  // ─── Products Catalog ───
  const products = [
    // ─── SAREES ───
    {
      name: "Banarasi Silk Saree — Maroon & Gold Zari",
      slug: "banarasi-silk-saree-maroon",
      description: "Handloom Banarasi silk saree in deep royal maroon with gold zari motifs. Features a rich pallu with traditional bel-buta pattern and a matching unstitched blouse piece. A timeless occasion saree for weddings and festivals.",
      shortDescription: "Handloom Banarasi silk with gold zari work",
      sku: "NT-SAR-001",
      price: 4500,
      compareAtPrice: 5500,
      categoryId: categoryMap["sarees"],
      fabric: "Pure Silk",
      weave: "Jacquard / Zari",
      careInstructions: "Dry clean only. Store wrapped in muslin cloth.",
      unitType: "PER_PIECE",
      stock: 15,
      isFeatured: true,
      tags: "saree,silk,banarasi,wedding",
      imageUrl: "/images/products/banarasi-silk-saree-maroon.jpg",
    },
    {
      name: "Paithani Silk Saree — Royal Peacock Blue",
      slug: "paithani-silk-saree-royal-blue",
      description: "Authentic Maharashtrian Paithani saree in striking royal peacock blue with an ornate gold zari pallu featuring handwoven peacock and parrot motifs. Sourced for traditional weddings and festive occasions.",
      shortDescription: "Royal peacock blue Paithani with gold pallu",
      sku: "NT-SAR-002",
      price: 6800,
      compareAtPrice: 8200,
      categoryId: categoryMap["sarees"],
      fabric: "100% Pure Silk",
      weave: "Handloom Paithani Tapestry",
      careInstructions: "Dry clean only. Roll in muslin cloth.",
      unitType: "PER_PIECE",
      stock: 8,
      isFeatured: true,
      tags: "saree,paithani,silk,maharashtra,wedding",
      imageUrl: "/images/products/paithani-silk-saree-blue.jpg",
    },
    {
      name: "Printed Chiffon Saree — Teal & Floral",
      slug: "printed-chiffon-saree-teal",
      description: "Lightweight, airy chiffon saree with contemporary floral digital print in teal and seafoam. Soft fall and easy to drape, perfect for day functions and summer parties. Comes with an unstitched printed blouse piece.",
      shortDescription: "Lightweight printed chiffon saree in teal",
      sku: "NT-SAR-003",
      price: 1650,
      compareAtPrice: 2100,
      categoryId: categoryMap["sarees"],
      fabric: "Poly Chiffon",
      weave: "Plain Weave",
      careInstructions: "Hand wash cold. Do not wring. Dry flat in shade.",
      unitType: "PER_PIECE",
      stock: 25,
      tags: "saree,chiffon,printed,party",
      imageUrl: "/images/products/paithani-silk-saree-blue.jpg",
    },

    // ─── DRESS MATERIALS ───
    {
      name: "Chanderi Silk Dress Material — Emerald Green",
      slug: "chanderi-silk-dress-material",
      description: "3-piece unstitched Chanderi silk suit set in rich emerald green with intricate gold zari embroidered neckline. Includes 2.5m Chanderi top fabric, 2m santoon bottom lining/salwar, and a 2.25m woven zari border dupatta.",
      shortDescription: "3-piece unstitched Chanderi silk suit set",
      sku: "NT-DRM-001",
      price: 2450,
      compareAtPrice: 2950,
      categoryId: categoryMap["dress-materials"],
      fabric: "Chanderi Silk Blend",
      careInstructions: "Dry clean recommended for first wash.",
      unitType: "PER_SET",
      stock: 20,
      isFeatured: true,
      tags: "dress-material,chanderi,suit,green",
      imageUrl: "/images/products/chanderi-dress-material-green.jpg",
    },
    {
      name: "Embroidered Dress Material — Chanderi Zari",
      slug: "embroidered-dress-material",
      description: "Unstitched suit material featuring subtle thread embroidery on Chanderi silk-blend fabric. Includes top fabric (2.5m), bottom fabric (2m), and a matching chiffon dupatta with delicate lace border.",
      shortDescription: "3-piece unstitched suit material with embroidery",
      sku: "NT-DRM-002",
      price: 1450,
      compareAtPrice: 1800,
      categoryId: categoryMap["dress-materials"],
      fabric: "Chanderi Silk Blend",
      careInstructions: "Dry clean recommended. Gentle hand wash in cold water.",
      unitType: "PER_SET",
      stock: 25,
      isFeatured: true,
      tags: "dress-material,embroidered,suit",
      imageUrl: "/images/products/chanderi-dress-material-green.jpg",
    },
    {
      name: "Hand-Block Printed Pure Cotton Dress Material",
      slug: "printed-dress-material",
      description: "Daily wear unstitched cotton dress material with Jaipur floral block print in indigo and rust. Pure 60s cotton top (2.5m), solid cambric cotton bottom (2m), and a lightweight mulmul dupatta (2.25m).",
      shortDescription: "Pure cotton 3-piece unstitched dress material",
      sku: "NT-DRM-003",
      price: 850,
      compareAtPrice: 1100,
      categoryId: categoryMap["dress-materials"],
      fabric: "100% Pure Cotton",
      careInstructions: "Machine wash cold. Wash separately first wash.",
      unitType: "PER_SET",
      stock: 35,
      tags: "dress-material,printed,cotton,daily",
      imageUrl: "/images/products/printed-cotton-fabric.jpg",
    },

    // ─── FABRICS BY THE METER ───
    {
      name: "Premium Pure Cambric Cotton Fabric",
      slug: "premium-cotton-fabric",
      description: "Soft-spun 60s cambric cotton in a rich indigo tone. Ideal for summer shirts, dresses, and light kurtas. Pre-shrunk and colour-fast with a crisp hand feel that softens beautifully after the first wash.",
      shortDescription: "60s cambric cotton, ideal for summer wear",
      sku: "NT-COT-001",
      price: 350,
      compareAtPrice: 450,
      categoryId: categoryMap["fabrics"],
      fabric: "100% Cotton",
      weave: "Cambric",
      gsm: "110 GSM",
      widthInches: "44 inches",
      careInstructions: "Machine wash cold. Do not bleach. Iron on medium heat.",
      unitType: "PER_METER",
      minQuantity: 1,
      maxQuantity: 50,
      quantityStep: 0.5,
      stock: 120,
      isFeatured: true,
      tags: "cotton,summer,fabric",
      imageUrl: "/images/products/premium-cotton-fabric.jpg",
    },
    {
      name: "Sanganeri Floral Hand-Block Print Cotton",
      slug: "printed-cotton-fabric",
      description: "Fine 60s cotton fabric printed with traditional Sanganeri floral bootis in vegetable dyes. Smooth texture with high breathability. Popular for tailored kurtas, tunics, shirts, and artisanal home textiles.",
      shortDescription: "Traditional hand block print on 60s cotton",
      sku: "NT-COT-002",
      price: 280,
      compareAtPrice: 350,
      categoryId: categoryMap["fabrics"],
      fabric: "100% Cotton",
      weave: "Plain Weave",
      gsm: "100 GSM",
      widthInches: "44 inches",
      careInstructions: "Gentle hand wash in cold water. Dry in shade. Light iron on reverse.",
      unitType: "PER_METER",
      minQuantity: 1,
      maxQuantity: 50,
      quantityStep: 0.5,
      stock: 85,
      tags: "cotton,printed,block-print",
      imageUrl: "/images/products/printed-cotton-fabric.jpg",
    },
    {
      name: "Natural Oatmeal Linen Blend Fabric",
      slug: "linen-blend-fabric",
      description: "European flax and cotton-linen blend with a natural slub texture in oatmeal. Breathable and structured, perfect for tailored trousers, blazers, and relaxed-fit shirts. Develops a lived-in softness over time.",
      shortDescription: "Cotton-linen blend with natural slub texture",
      sku: "NT-LIN-001",
      price: 480,
      compareAtPrice: 600,
      categoryId: categoryMap["fabrics"],
      fabric: "55% Linen, 45% Cotton",
      weave: "Plain Slub",
      gsm: "160 GSM",
      widthInches: "54 inches",
      careInstructions: "Machine wash gentle. Line dry. Iron while slightly damp.",
      unitType: "PER_METER",
      minQuantity: 1,
      maxQuantity: 40,
      quantityStep: 0.5,
      stock: 70,
      isFeatured: true,
      tags: "linen,natural,breathable,shirting",
      imageUrl: "/images/products/linen-blend-fabric.jpg",
    },
    {
      name: "Fluid Rayon Fabric — Deep Teal",
      slug: "rayon-fabric",
      description: "Fluid rayon fabric with a silky drape in deep teal. Breathable and lightweight with a subtle lustre. Drapes beautifully for palazzo pants, A-line kurtas, and wrap dresses.",
      shortDescription: "Fluid rayon with silky drape",
      sku: "NT-RAY-001",
      price: 220,
      compareAtPrice: 300,
      categoryId: categoryMap["fabrics"],
      fabric: "100% Rayon",
      weave: "Plain Weave",
      gsm: "120 GSM",
      widthInches: "54 inches",
      careInstructions: "Hand wash cold. Do not wring. Dry flat in shade.",
      unitType: "PER_METER",
      minQuantity: 1,
      maxQuantity: 50,
      quantityStep: 0.5,
      stock: 95,
      tags: "rayon,drape,fluid",
      imageUrl: "/images/products/chanderi-dress-material-green.jpg",
    },

    // ─── KURTIS ───
    {
      name: "Lucknowi Chikankari Embroidered Kurti — Blush Pink",
      slug: "chikankari-kurti-pink",
      description: "Handcrafted Lucknowi Chikankari embroidered kurti in pastel blush pink. Intricate white cotton thread embroidery across neckline and 3/4 sleeves. Made from breathable pure cotton cambric, comfortable for daily elegance.",
      shortDescription: "Handmade Chikankari embroidery on pure cotton",
      sku: "NT-KUR-003",
      price: 1290,
      compareAtPrice: 1550,
      categoryId: categoryMap["kurtis"],
      fabric: "100% Cotton Cambric",
      careInstructions: "Gentle hand wash cold. Dry in shade.",
      unitType: "PER_PIECE",
      stock: 24,
      isFeatured: true,
      tags: "kurti,chikankari,pink,handcrafted",
      imageUrl: "/images/products/chikankari-kurti-pink.jpg",
    },
    {
      name: "Women's A-Line Kurti — Olive Green",
      slug: "womens-kurti-olive",
      description: "A-line kurti in olive green with subtle thread work on the yoke. Made from soft cotton blend fabric. Features 3/4 sleeves, a mandarin collar, and side slits for ease. Regular fit, falls below the knee.",
      shortDescription: "A-line cotton kurti with yoke detailing",
      sku: "NT-KUR-001",
      price: 780,
      compareAtPrice: 950,
      categoryId: categoryMap["kurtis"],
      fabric: "Cotton Blend",
      careInstructions: "Machine wash cold. Iron on medium.",
      unitType: "PER_PIECE",
      stock: 30,
      isFeatured: true,
      tags: "kurti,women,cotton",
      imageUrl: "/images/products/womens-kurti-olive.jpg",
    },
    {
      name: "Designer Kurti — Hand-Block Print Indigo",
      slug: "designer-kurti-block-print",
      description: "Straight-cut kurti with hand block print in indigo and white. Made from premium cotton voile with a soft hand feel. Features a round neck, full sleeves with button cuffs, and a curved hem.",
      shortDescription: "Block-printed cotton voile straight kurti",
      sku: "NT-KUR-002",
      price: 1100,
      compareAtPrice: 1350,
      categoryId: categoryMap["kurtis"],
      fabric: "Cotton Voile",
      careInstructions: "Hand wash in cold water. Do not wring. Dry in shade.",
      unitType: "PER_PIECE",
      stock: 20,
      tags: "kurti,designer,block-print",
      imageUrl: "/images/products/chikankari-kurti-pink.jpg",
    },

    // ─── MEN'S WEAR ───
    {
      name: "Men's Shirt Fabric — Blue Check Oxford",
      slug: "mens-shirt-fabric-blue-check",
      description: "Premium shirting fabric in a classic sky-blue-and-white micro check. 80s 2-ply yarn for a smooth, wrinkle-resistant finish. Enough fabric for one full-sleeve shirt when purchased at 2.5 meters.",
      shortDescription: "80s 2-ply shirting in sky blue micro check",
      sku: "NT-MSF-001",
      price: 420,
      compareAtPrice: 520,
      categoryId: categoryMap["mens-wear"],
      fabric: "100% Cotton Oxford",
      weave: "Twill",
      gsm: "120 GSM",
      widthInches: "58 inches",
      careInstructions: "Machine wash cold. Iron on medium. Do not bleach.",
      unitType: "PER_METER",
      minQuantity: 1,
      maxQuantity: 20,
      quantityStep: 0.5,
      stock: 65,
      isFeatured: true,
      tags: "shirting,men,fabric,check",
      imageUrl: "/images/products/mens-shirt-fabric-blue-check.jpg",
    },
    {
      name: "Men's Formal Pure Linen Shirt Length — White",
      slug: "mens-formal-shirt-white",
      description: "Classic regular-fit pure European linen shirt piece in crisp white. High breathability with natural slub yarn. Suitable for office, wedding kurtas, and formal summer shirts.",
      shortDescription: "Pure European linen shirt length",
      sku: "NT-MSH-001",
      price: 950,
      compareAtPrice: 1200,
      categoryId: categoryMap["mens-wear"],
      fabric: "100% Pure Linen",
      careInstructions: "Machine wash warm. Iron on high heat.",
      unitType: "PER_PIECE",
      stock: 40,
      tags: "shirt,men,formal,white,linen",
      imageUrl: "/images/products/linen-blend-fabric.jpg",
    },
    {
      name: "Suit Fabric — Charcoal Grey Twill",
      slug: "suit-fabric-charcoal-grey",
      description: "Wool-blend suiting fabric in charcoal grey with a subtle self-stripe. Smooth drape with medium weight, suitable for formal trousers and two-piece suits. Year-round fabric with a refined finish.",
      shortDescription: "Wool-blend suiting with subtle self-stripe",
      sku: "NT-SUT-001",
      price: 680,
      compareAtPrice: 850,
      categoryId: categoryMap["mens-wear"],
      fabric: "Wool-Polyester Blend",
      weave: "Twill",
      gsm: "220 GSM",
      widthInches: "58 inches",
      careInstructions: "Dry clean only. Store on a hanger to maintain drape.",
      unitType: "PER_METER",
      minQuantity: 1,
      maxQuantity: 15,
      quantityStep: 0.5,
      stock: 30,
      tags: "suiting,men,fabric,formal",
      imageUrl: "/images/products/premium-cotton-fabric.jpg",
    },

    // ─── DUPATTAS & KIDS & SEASONAL ───
    {
      name: "Handloom Banarasi Silk Dupatta — Magenta Zari",
      slug: "cotton-dupatta-block-print",
      description: "Rich Banarasi silk dupatta in festive magenta with full gold zari jaal weaving and finished border tassels. Adds instant grandeur to any plain suit, anarkali, or lehenga.",
      shortDescription: "Banarasi silk dupatta with gold zari work",
      sku: "NT-DUP-001",
      price: 1850,
      compareAtPrice: 2400,
      categoryId: categoryMap["dupattas"],
      fabric: "Banarasi Silk",
      careInstructions: "Dry clean only.",
      unitType: "PER_PIECE",
      stock: 18,
      isFeatured: true,
      tags: "dupatta,silk,banarasi,magenta",
      imageUrl: "/images/products/banarasi-silk-saree-maroon.jpg",
    },
    {
      name: "Kids Ethnic Kurta-Pyjama Set — Festive Ivory",
      slug: "kids-ethnic-kurta-set",
      description: "Boys' ethnic kurta-pyjama set in ivory with gold printed motifs. Soft cotton fabric with a comfortable relaxed fit. Features a mandarin collar and front button placket. Comes with matching churidar pyjama.",
      shortDescription: "Cotton kurta-pyjama set for boys",
      sku: "NT-KID-001",
      price: 650,
      compareAtPrice: 850,
      categoryId: categoryMap["kids-wear"],
      fabric: "Pure Cotton",
      careInstructions: "Machine wash cold. Iron on low heat.",
      unitType: "PER_SET",
      stock: 22,
      tags: "kids,ethnic,kurta,boys",
      imageUrl: "/images/products/chikankari-kurti-pink.jpg",
    },
    {
      name: "Monsoon Festive 3-Piece Textile Set",
      slug: "seasonal-collection-monsoon",
      description: "Curated seasonal collection featuring a 3-piece set: quick-dry cotton-blend kurta fabric (2.5m), matching palazzo fabric (2m), and a printed poly-chiffon dupatta in rain-washed teal and grey palette.",
      shortDescription: "Quick-dry monsoon collection set",
      sku: "NT-SEA-001",
      price: 1800,
      compareAtPrice: 2200,
      categoryId: categoryMap["seasonal"],
      fabric: "Cotton Blend + Poly Chiffon",
      careInstructions: "Kurta and bottom: Machine wash cold. Dupatta: Hand wash.",
      unitType: "PER_SET",
      stock: 15,
      tags: "seasonal,monsoon,collection,set",
      imageUrl: "/images/products/chanderi-dress-material-green.jpg",
    },
  ];

  // Clean existing product records for clean fresh seed
  await prisma.productImage.deleteMany();
  await prisma.orderItem.deleteMany();

  await prisma.cartItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();

  for (const product of products) {
    const { imageUrl, ...productData } = product;

    const created = await prisma.product.create({
      data: {
        ...productData,
        unitType: productData.unitType as never,
        images: {
          create: [
            {
              url: imageUrl,
              alt: productData.name,
              isPrimary: true,
              sortOrder: 0,
            },
          ],
        },
      },
    });

    console.log(`  ✓ Product created: ${created.name}`);
  }
  console.log(`✓ All ${products.length} catalog products configured with unique photography`);

  // ─── Store Settings ───
  const settings = [
    { key: "store_name", value: "NOBLE TEXTILE" },
    { key: "store_phone", value: "+917821059350" },
    { key: "store_email", value: "contact@nobletextile.com" },
    { key: "store_address", value: "Hatte Nagar, Latur, Maharashtra 413512, India" },
    { key: "free_shipping_threshold", value: "999" },
    { key: "shipping_charge_standard", value: "79" },
    { key: "cod_charge", value: "50" },
    { key: "announcement_text", value: "Free shipping on orders above ₹999 | Call +91 78210 59350" },
  ];

  for (const setting of settings) {
    await prisma.storeSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log(`✓ ${settings.length} store settings saved`);



  console.log("✨ Seed completed successfully with diverse products and category visuals!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
