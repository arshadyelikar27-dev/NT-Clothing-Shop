import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface SubcategoryData {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
}

interface CategoryData {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  subcategories: SubcategoryData[];
}

const CATEGORY_TREE: CategoryData[] = [
  {
    name: "Sarees",
    slug: "sarees",
    description: "Handcrafted Banarasi, Paithani, Chanderi, Kanjivaram, and pure handloom sarees for weddings, festive occasions, and daily elegance.",
    sortOrder: 1,
    subcategories: [
      { name: "Banarasi Silk Sarees", slug: "banarasi-silk", description: "Authentic Katan & Georgette Banarasi handwoven gold zari sarees", sortOrder: 1 },
      { name: "Paithani Sarees", slug: "paithani-sarees", description: "Traditional Maharashtra Paithani weaves with peacock motifs and rich pallus", sortOrder: 2 },
      { name: "Chanderi Sarees", slug: "chanderi-sarees", description: "Lightweight sheer Chanderi silk and cotton sarees with fine zari borders", sortOrder: 3 },
      { name: "Kanjivaram Sarees", slug: "kanjivaram-sarees", description: "Pure mulberry silk South Indian temple border bridal sarees", sortOrder: 4 },
      { name: "Handloom Cotton Sarees", slug: "cotton-sarees", description: "Breathable daily wear Bengal, Mulmul, and Chettinad cotton sarees", sortOrder: 5 },
      { name: "Organza & Georgette", slug: "organza-georgette", description: "Modern floral and scalloped embroidered lightweight sarees", sortOrder: 6 },
    ],
  },
  {
    name: "Fabrics & Running Material",
    slug: "fabrics",
    description: "Premium pure cotton, linen, silk, and brocade running yardage cut to custom meterage for bespoke tailoring.",
    sortOrder: 2,
    subcategories: [
      { name: "Pure Cotton Fabric", slug: "pure-cotton", description: "Breathable 60s count organic cotton yardage for shirts, kurtas, and dresses", sortOrder: 1 },
      { name: "Pure Linen Fabric", slug: "pure-linen", description: "100% European certified flax linen for premium shirts and trousers", sortOrder: 2 },
      { name: "Silk Brocade & Jacquard", slug: "silk-brocade", description: "Heavy metallic gold and silver brocade weaves for blouses and jackets", sortOrder: 3 },
      { name: "Rayon & Modal Crepe", slug: "rayon-crepe", description: "Soft draping flowy fabrics for western and ethnic apparel", sortOrder: 4 },
      { name: "Organza & Tissue", slug: "organza-tissue", description: "Shimmering translucent organza and metallic tissue textiles", sortOrder: 5 },
    ],
  },
  {
    name: "Kurtis & Kurtas",
    slug: "kurtis",
    description: "Artisanal handblock printed, Chikankari embroidered, and contemporary daily ethnic kurtis.",
    sortOrder: 3,
    subcategories: [
      { name: "A-Line Kurtis", slug: "a-line-kurtis", description: "Flattering flared A-line silhouettes in cotton, linen, and silk", sortOrder: 1 },
      { name: "Straight Cut Kurtis", slug: "straight-kurtis", description: "Classic straight-cut office and daily comfort kurtas", sortOrder: 2 },
      { name: "Anarkali Kurtis", slug: "anarkali-kurtis", description: "Graceful pleated and tiered flared ethnic kurtas", sortOrder: 3 },
      { name: "Short Kurtis & Tops", slug: "short-kurtis", description: "Trendy hip-length ethnic tops for pairing with jeans or pants", sortOrder: 4 },
      { name: "Chikankari Kurtis", slug: "chikankari-kurtis", description: "Handcrafted Lucknowi Chikankari needlework kurtas on modal and georgette", sortOrder: 5 },
    ],
  },
  {
    name: "Dress Materials",
    slug: "dress-materials",
    description: "Unstitched 3-piece suit materials in pure Chanderi silk, cotton, and organza with dupattas.",
    sortOrder: 4,
    subcategories: [
      { name: "Chanderi Suit Sets", slug: "chanderi-suits", description: "Glimmering Chanderi zari unstitched suit sets with dupatta", sortOrder: 1 },
      { name: "Cotton Suit Sets", slug: "cotton-suit-sets", description: "Daily comfort pure cotton unstitched kurta-bottom-dupatta sets", sortOrder: 2 },
      { name: "Silk Suit Materials", slug: "silk-suit-materials", description: "Lustrous Tussar and raw silk unstitched ensembles for occasions", sortOrder: 3 },
      { name: "Party Wear Suits", slug: "party-wear-suits", description: "Sequins, gota patti, and zari work unstitched party suit materials", sortOrder: 4 },
    ],
  },
  {
    name: "Men's Wear",
    slug: "mens-wear",
    description: "Tailored pure linen shirts, classic kurtas, Nehru jackets, and luxury suiting fabrics for the modern gentleman.",
    sortOrder: 5,
    subcategories: [
      { name: "Linen Shirts", slug: "linen-shirts", description: "100% European linen casual, resort, and formal shirts", sortOrder: 1 },
      { name: "Ethnic Kurta Sets", slug: "mens-ethnic-kurtas", description: "Festive and wedding kurta-pajama and dhoti sets", sortOrder: 2 },
      { name: "Nehru & Modi Jackets", slug: "nehru-jackets", description: "Sleeveless structured ethnic waistcoats in silk and linen", sortOrder: 3 },
      { name: "Sherwanis & Indo-Western", slug: "sherwanis-indo-western", description: "Regal wedding sherwanis and asymmetrical Indo-Western jackets", sortOrder: 4 },
      { name: "Suiting & Shirting Fabric", slug: "suiting-fabrics", description: "Premium wool-blend and Italian suiting yardage", sortOrder: 5 },
    ],
  },
  {
    name: "Suits & Blazers",
    slug: "suits",
    description: "Royal Jodhpuri Bandhgalas, tuxedo jackets, and bespoke tailored occasion suit sets.",
    sortOrder: 6,
    subcategories: [
      { name: "Bandhgala Jodhpuri Suits", slug: "bandhgala-suits", description: "Traditional Jodhpuri structured bandhgalas with handcrafted buttons", sortOrder: 1 },
      { name: "Tuxedos & Evening Blazers", slug: "tuxedos-blazers", description: "Satin lapel tuxedos and sharp occasion blazers", sortOrder: 2 },
      { name: "Bespoke Formal Suits", slug: "bespoke-suits", description: "Classic 2-piece and 3-piece boardroom and wedding suits", sortOrder: 3 },
    ],
  },
  {
    name: "Women's Festive Wear",
    slug: "womens-wear",
    description: "Flared designer Anarkalis, celebratory ethnic ensembles, and bespoke bridal lehengas.",
    sortOrder: 7,
    subcategories: [
      { name: "Anarkali Gowns & Sets", slug: "anarkali-sets", description: "Embroidered flared festive Anarkali floor-length gowns and suits", sortOrder: 1 },
      { name: "Designer Lehengas", slug: "designer-lehengas", description: "Handcrafted bridal, sangeet, and reception lehenga choli sets", sortOrder: 2 },
      { name: "Ethnic Co-ord Sets", slug: "co-ord-sets", description: "Chic printed crop tops, trousers, and cape co-ord sets", sortOrder: 3 },
      { name: "Festive Gowns", slug: "festive-gowns", description: "Contemporary Indo-Western draped and structured gowns", sortOrder: 4 },
    ],
  },
  {
    name: "Kids Wear",
    slug: "kids-wear",
    description: "Comfort-lined ethnic kurta-dhoti sets and festive brocade ensembles for boys and girls.",
    sortOrder: 8,
    subcategories: [
      { name: "Boys Ethnic Sets", slug: "boys-ethnic-sets", description: "Festive jacquard kurtas, jackets, and dhoti sets for boys", sortOrder: 1 },
      { name: "Girls Lehengas & Frocks", slug: "girls-lehenga-choli", description: "Comfort-lined soft lehenga cholis and ethnic frocks for girls", sortOrder: 2 },
    ],
  },
  {
    name: "Dupattas & Stoles",
    slug: "dupattas",
    description: "Opulent Banarasi zari dupattas, Phulkari, and handloom silk stoles to elevate any ethnic outfit.",
    sortOrder: 9,
    subcategories: [
      { name: "Banarasi Zari Dupattas", slug: "banarasi-dupattas", description: "Rich Kadwa zari woven Banarasi silk dupattas", sortOrder: 1 },
      { name: "Phulkari & Embroidered", slug: "phulkari-embroidered", description: "Vibrant Punjabi Phulkari and thread-work dupattas", sortOrder: 2 },
      { name: "Handloom Silk Stoles", slug: "silk-stoles-shawls", description: "Pure Tussar, Pashmina, and Matka silk stoles and shawls", sortOrder: 3 },
    ],
  },
];

async function seedCategories() {
  console.log("🌱 Starting Category Seeding...");

  let parentCount = 0;
  let subCount = 0;

  for (const catData of CATEGORY_TREE) {
    // Upsert parent category
    const parentCategory = await prisma.category.upsert({
      where: { slug: catData.slug },
      update: {
        name: catData.name,
        description: catData.description,
        sortOrder: catData.sortOrder,
        isActive: true,
      },
      create: {
        name: catData.name,
        slug: catData.slug,
        description: catData.description,
        sortOrder: catData.sortOrder,
        isActive: true,
      },
    });

    parentCount++;
    console.log(`📁 Main Category: [${parentCategory.name}] (${parentCategory.slug})`);

    // Upsert subcategories
    for (const sub of catData.subcategories) {
      await prisma.category.upsert({
        where: { slug: sub.slug },
        update: {
          name: sub.name,
          description: sub.description,
          sortOrder: sub.sortOrder,
          parentId: parentCategory.id,
          isActive: true,
        },
        create: {
          name: sub.name,
          slug: sub.slug,
          description: sub.description,
          sortOrder: sub.sortOrder,
          parentId: parentCategory.id,
          isActive: true,
        },
      });
      subCount++;
      console.log(`   └── 🏷️ Subcategory: ${sub.name} (${sub.slug})`);
    }
  }

  console.log(`\n✅ Seeding Complete!`);
  console.log(`📊 Summary: ${parentCount} Main Categories & ${subCount} Subcategories seeded successfully.`);
}

seedCategories()
  .catch((e) => {
    console.error("❌ Seeding Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
