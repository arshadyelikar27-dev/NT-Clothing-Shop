import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

const brainDir = "C:\\Users\\arsha\\.gemini\\antigravity-ide\\brain\\a5d4d42e-6e08-4f81-8399-0570a0a60378";
const publicImagesDir = path.join(process.cwd(), "public", "images", "products");

if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

// Map generated image artifacts to target product image files in public/images/products/
const imageMapping: Record<string, string> = {
  "banarasi_silk_saree_maroon": "banarasi-silk-saree-maroon.jpg",
  "premium_cotton_fabric": "premium-cotton-fabric.jpg",
  "womens_kurti_olive": "womens-kurti-olive.jpg",
  "linen_blend_fabric": "linen-blend-fabric.jpg",
  "chanderi_suit_material": "chanderi-unstitched-suit-material.jpg",
  "bandhgala_jodhpuri_suit": "heritage-bandhgala-jodhpuri-suit.jpg",
  "pastel_rose_anarkali": "pastel-rose-anarkali-gown.jpg",
  "kids_festive_kurta_set": "kids-gold-jacquard-kurta-set.jpg",
};

// Copy images
const brainFiles = fs.readdirSync(brainDir);
for (const [prefix, targetName] of Object.entries(imageMapping)) {
  const match = brainFiles.find((f) => f.startsWith(prefix) && f.endsWith(".jpg"));
  if (match) {
    const srcPath = path.join(brainDir, match);
    const destPath = path.join(publicImagesDir, targetName);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${match} -> public/images/products/${targetName}`);
  } else {
    console.warn(`No match found for prefix: ${prefix}`);
  }
}

interface CategorySeed {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  subcategories?: { name: string; slug: string; description: string; sortOrder: number }[];
}

const CATEGORIES: CategorySeed[] = [
  {
    name: "Sarees",
    slug: "sarees",
    description: "Handcrafted Banarasi, Paithani, Chanderi, and pure silk sarees for festive and bridal celebrations.",
    sortOrder: 1,
    subcategories: [
      { name: "Banarasi Silk", slug: "banarasi-silk", description: "Authentic Banarasi zari weaves", sortOrder: 1 },
      { name: "Paithani Sarees", slug: "paithani-sarees", description: "Traditional Maharashtra Paithani borders", sortOrder: 2 },
    ]
  },
  {
    name: "Fabrics",
    slug: "fabrics",
    description: "Premium pure cotton, linen, silk, and brocade running yardage cut to custom meterage.",
    sortOrder: 2,
    subcategories: [
      { name: "Pure Cotton", slug: "pure-cotton", description: "Breathable 60s count organic cotton yardage", sortOrder: 1 },
      { name: "Pure Linen", slug: "pure-linen", description: "European flax linen weaves", sortOrder: 2 },
    ]
  },
  {
    name: "Kurtis",
    slug: "kurtis",
    description: "Artisanal handblock printed, Chikankari embroidered, and contemporary daily ethnic kurtis.",
    sortOrder: 3,
    subcategories: [
      { name: "A-Line Kurtis", slug: "a-line-kurtis", description: "Flattering flared A-line silhouettes", sortOrder: 1 },
      { name: "Straight Kurtis", slug: "straight-kurtis", description: "Classic straight-cut office & daily wear", sortOrder: 2 },
    ]
  },
  {
    name: "Men's Wear",
    slug: "mens-wear",
    description: "Tailored pure linen shirts, classic kurtas, and luxury suiting fabrics for the modern gentleman.",
    sortOrder: 4,
    subcategories: [
      { name: "Linen Shirts", slug: "linen-shirts", description: "100% European linen casual and formal shirts", sortOrder: 1 },
      { name: "Ethnic Kurta Sets", slug: "mens-ethnic-kurtas", description: "Occasion kurtas and churidar sets", sortOrder: 2 },
    ]
  },
  {
    name: "Dress Materials",
    slug: "dress-materials",
    description: "Unstitched 3-piece suit materials in pure Chanderi silk, cotton, and organza with dupattas.",
    sortOrder: 5,
    subcategories: [
      { name: "Chanderi Suits", slug: "chanderi-suits", description: "Glimmering Chanderi zari unstitched sets", sortOrder: 1 },
      { name: "Cotton Suit Sets", slug: "cotton-suit-sets", description: "Daily comfort pure cotton unstitched sets", sortOrder: 2 },
    ]
  },
  {
    name: "Suits",
    slug: "suits",
    description: "Royal Jodhpuri Bandhgalas, tuxedo jackets, and bespoke tailored occasion suit sets.",
    sortOrder: 6,
    subcategories: [
      { name: "Bandhgala Suits", slug: "bandhgala-suits", description: "Traditional Jodhpuri structured bandhgalas", sortOrder: 1 },
    ]
  },
  {
    name: "Women's Wear",
    slug: "womens-wear",
    description: "Flared designer Anarkalis, festive gowns, and celebratory ethnic ensembles.",
    sortOrder: 7,
    subcategories: [
      { name: "Anarkali Sets", slug: "anarkali-sets", description: "Embroidered flared festive Anarkali gowns", sortOrder: 1 },
    ]
  },
  {
    name: "Kids Wear",
    slug: "kids-wear",
    description: "Comfort-lined ethnic kurta-dhoti sets and festive brocade ensembles for boys and girls.",
    sortOrder: 8,
    subcategories: [
      { name: "Boys Ethnic Sets", slug: "boys-ethnic-sets", description: "Festive jacquard kurtas and jackets", sortOrder: 1 },
    ]
  }
];

interface ProductSeed {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku: string;
  price: number;
  compareAtPrice: number;
  categorySlug: string;
  fabric: string;
  weave: string;
  gsm: string;
  widthInches: string;
  careInstructions: string;
  unitType: string;
  minQuantity: number;
  maxQuantity: number;
  quantityStep: number;
  stock: number;
  isFeatured: boolean;
  image: string;
  variants: { name: string; type: string; value: string; price: number; stock: number; sku: string }[];
  wholesaleTiers: { minQty: number; maxQty?: number; price: number; label: string }[];
}

const PRODUCTS: ProductSeed[] = [
  {
    name: "Royal Crimson Banarasi Zari Silk Saree",
    slug: "banarasi-silk-saree-maroon",
    description: "Opulent handwoven Banarasi pure Katan silk saree adorned with intricate floral jaal Kadwa gold zari work across the body and a grand regal pallu. Woven by master weavers, this saree offers an incomparable royal drape for weddings, festivals, and heirloom wardrobes. Comes with an unstitched blouse piece in matching pure silk.",
    shortDescription: "Pure Katan Banarasi Silk Saree with heavy golden zari kadwa border and rich pallu.",
    sku: "NT-SAR-001",
    price: 4850,
    compareAtPrice: 6500,
    categorySlug: "sarees",
    fabric: "100% Pure Banarasi Katan Silk",
    weave: "Kadwa Handloom Brocade",
    gsm: "180 GSM",
    widthInches: "46 inches (6.3m length with blouse)",
    careInstructions: "Dry clean only. Store wrapped in pure cotton or muslin fabric.",
    unitType: "PER_PIECE",
    minQuantity: 1,
    maxQuantity: 10,
    quantityStep: 1,
    stock: 25,
    isFeatured: true,
    image: "/images/products/banarasi-silk-saree-maroon.jpg",
    variants: [
      { name: "Crimson Maroon / Standard Free Size", type: "Color", value: "Crimson Maroon", price: 4850, stock: 25, sku: "NT-SAR-001-MRN" },
    ],
    wholesaleTiers: [
      { minQty: 3, maxQty: 5, price: 4200, label: "Wholesale Tier 1 (3-5 pcs)" },
      { minQty: 6, maxQty: 12, price: 3850, label: "Wholesale Tier 2 (6-12 pcs)" },
      { minQty: 13, price: 3500, label: "Bulk Partner Tier (13+ pcs)" },
    ]
  },
  {
    name: "Organic 60s Count Pure Cotton Fabric",
    slug: "premium-cotton-fabric",
    description: "Superfine 60s combed pure cotton running fabric with a silky soft hand-feel, supreme breathability, and natural drape. Ideal for bespoke kurtas, casual shirts, summer dresses, craft sewing, and comfortable daily ethnic wear. Cut continuously to your exact required meterage from 0.5 meters onwards.",
    shortDescription: "Superfine 60s count organic combed cotton running yardage by meter.",
    sku: "NT-FAB-001",
    price: 220,
    compareAtPrice: 280,
    categorySlug: "fabrics",
    fabric: "100% Organic Combed Cotton",
    weave: "Plain Cambric Weave",
    gsm: "110 GSM",
    widthInches: "44 inches",
    careInstructions: "Machine wash cold on gentle cycle. Warm iron while slightly damp.",
    unitType: "PER_METER",
    minQuantity: 0.5,
    maxQuantity: 50,
    quantityStep: 0.5,
    stock: 450,
    isFeatured: true,
    image: "/images/products/premium-cotton-fabric.jpg",
    variants: [
      { name: "Natural Beige / Meter", type: "Color", value: "Natural Beige", price: 220, stock: 250, sku: "NT-FAB-001-BGE" },
      { name: "Indigo Blue / Meter", type: "Color", value: "Indigo Blue", price: 220, stock: 200, sku: "NT-FAB-001-IND" },
    ],
    wholesaleTiers: [
      { minQty: 20, maxQty: 50, price: 185, label: "Roll Tier 1 (20-50m)" },
      { minQty: 51, maxQty: 100, price: 165, label: "Thaan Wholesale (51-100m)" },
      { minQty: 101, price: 145, label: "Bale Wholesale (101m+)" },
    ]
  },
  {
    name: "Olive Green Handblock Printed A-Line Kurti",
    slug: "womens-kurti-olive",
    description: "Artisanal hand-block printed cotton A-line kurti featuring delicate traditional buta motifs, elegant round boat neck with wooden button placket, three-quarter sleeves with printed borders, and functional side slit. Tailored from soft breathable cotton for all-day comfort.",
    shortDescription: "Hand-block printed pure cotton A-line kurti with wooden button detail.",
    sku: "NT-KUR-001",
    price: 899,
    compareAtPrice: 1299,
    categorySlug: "kurtis",
    fabric: "100% Pure Cambric Cotton",
    weave: "Fine Handblock Printed Weave",
    gsm: "125 GSM",
    widthInches: "Length: 46 inches",
    careInstructions: "Hand wash separately in cold water using mild detergent. Dry in shade.",
    unitType: "PER_PIECE",
    minQuantity: 1,
    maxQuantity: 20,
    quantityStep: 1,
    stock: 45,
    isFeatured: true,
    image: "/images/products/womens-kurti-olive.jpg",
    variants: [
      { name: "Size S (36)", type: "Size", value: "S", price: 899, stock: 10, sku: "NT-KUR-001-S" },
      { name: "Size M (38)", type: "Size", value: "M", price: 899, stock: 15, sku: "NT-KUR-001-M" },
      { name: "Size L (40)", type: "Size", value: "L", price: 899, stock: 12, sku: "NT-KUR-001-L" },
      { name: "Size XL (42)", type: "Size", value: "XL", price: 899, stock: 8, sku: "NT-KUR-001-XL" },
    ],
    wholesaleTiers: [
      { minQty: 5, maxQty: 10, price: 720, label: "Boutique Pack (5-10 pcs)" },
      { minQty: 11, price: 620, label: "Bulk Retail Pack (11+ pcs)" },
    ]
  },
  {
    name: "Belgian Pure Linen Tailored Casual Shirt",
    slug: "linen-blend-fabric",
    description: "Exquisite tailored men's casual shirt woven from 100% pure European flax linen in a timeless natural oatmeal hue. Features a semi-spread collar, genuine mother-of-pearl buttons, curved hemline, and pre-washed softness that gets better with every wash. Designed for effortless luxury and breathable comfort.",
    shortDescription: "100% European pure linen men's shirt with mother-of-pearl buttons.",
    sku: "NT-MEN-001",
    price: 1650,
    compareAtPrice: 2200,
    categorySlug: "mens-wear",
    fabric: "100% Pure European Flax Linen",
    weave: "Textured Linen Weave",
    gsm: "160 GSM",
    widthInches: "Regular Tailored Fit",
    careInstructions: "Machine wash cold. Line dry in shade. Warm steam iron for best drape.",
    unitType: "PER_PIECE",
    minQuantity: 1,
    maxQuantity: 15,
    quantityStep: 1,
    stock: 35,
    isFeatured: true,
    image: "/images/products/linen-blend-fabric.jpg",
    variants: [
      { name: "Size 38 (M)", type: "Size", value: "38 (M)", price: 1650, stock: 10, sku: "NT-MEN-001-38" },
      { name: "Size 40 (L)", type: "Size", value: "40 (L)", price: 1650, stock: 15, sku: "NT-MEN-001-40" },
      { name: "Size 42 (XL)", type: "Size", value: "42 (XL)", price: 1650, stock: 10, sku: "NT-MEN-001-42" },
    ],
    wholesaleTiers: [
      { minQty: 5, maxQty: 10, price: 1350, label: "Wholesale (5-10 pcs)" },
      { minQty: 11, price: 1190, label: "Bulk Wholesale (11+ pcs)" },
    ]
  },
  {
    name: "Chanderi Zari Unstitched Suit Material Set",
    slug: "chanderi-unstitched-suit-material",
    description: "Glamorous 3-piece unstitched Chanderi silk suit material set in deep peacock teal. Includes a 2.5m Chanderi silk top with intricate gold zari threadwork neckline and border, a 2.5m pure cotton santoon bottom fabric, and a 2.3m sheer digital-printed organza dupatta with golden tassels. Customise to your desired stitching style.",
    shortDescription: "3-piece unstitched Chanderi silk suit set with pure organza dupatta.",
    sku: "NT-DRS-001",
    price: 2199,
    compareAtPrice: 2899,
    categorySlug: "dress-materials",
    fabric: "Chanderi Silk, Santoon & Organza",
    weave: "Zari Thread Embroidered",
    gsm: "140 GSM",
    widthInches: "Top: 2.5m, Bottom: 2.5m, Dupatta: 2.3m",
    careInstructions: "Dry clean recommended for initial washes to preserve zari sheen.",
    unitType: "PER_PIECE",
    minQuantity: 1,
    maxQuantity: 20,
    quantityStep: 1,
    stock: 30,
    isFeatured: true,
    image: "/images/products/chanderi-unstitched-suit-material.jpg",
    variants: [
      { name: "Peacock Teal / Unstitched 3-Piece Set", type: "Style", value: "Unstitched Set", price: 2199, stock: 30, sku: "NT-DRS-001-SET" },
    ],
    wholesaleTiers: [
      { minQty: 4, maxQty: 8, price: 1799, label: "Wholesale Pack (4-8 sets)" },
      { minQty: 9, price: 1550, label: "Distributor Pack (9+ sets)" },
    ]
  },
  {
    name: "Heritage Bandhgala Jodhpuri Suit Set",
    slug: "heritage-bandhgala-jodhpuri-suit",
    description: "Regal royal navy blue Indian Jodhpuri Bandhgala suit set for men. Master-tailored from structured tropical wool blend with authentic handcrafted antique brass crest buttons, neat piped mandarin collar, welt chest pocket, and satin inner lining. Accompanied by matching flat-front formal trousers.",
    shortDescription: "Royal navy blue Bandhgala Jodhpuri suit with antique brass crest buttons.",
    sku: "NT-SUI-001",
    price: 5990,
    compareAtPrice: 7990,
    categorySlug: "suits",
    fabric: "Premium Tropical Wool Blend with Satin Lining",
    weave: "Structured Twill Weave",
    gsm: "260 GSM",
    widthInches: "Tailored Royal Fit",
    careInstructions: "Dry clean only. Press with cool iron over pressing cloth.",
    unitType: "PER_PIECE",
    minQuantity: 1,
    maxQuantity: 5,
    quantityStep: 1,
    stock: 18,
    isFeatured: true,
    image: "/images/products/heritage-bandhgala-jodhpuri-suit.jpg",
    variants: [
      { name: "Size 38 (Medium)", type: "Size", value: "38 (Medium)", price: 5990, stock: 6, sku: "NT-SUI-001-38" },
      { name: "Size 40 (Large)", type: "Size", value: "40 (Large)", price: 5990, stock: 7, sku: "NT-SUI-001-40" },
      { name: "Size 42 (X-Large)", type: "Size", value: "42 (X-Large)", price: 5990, stock: 5, sku: "NT-SUI-001-42" },
    ],
    wholesaleTiers: [
      { minQty: 3, maxQty: 6, price: 4990, label: "Occasion Wholesale (3-6 suits)" },
      { minQty: 7, price: 4450, label: "Retailer Wholesale (7+ suits)" },
    ]
  },
  {
    name: "Pastel Rose Embroidered Anarkali Gown Set",
    slug: "pastel-rose-anarkali-gown",
    description: "Breathtaking floor-length flared Anarkali gown in dusty rose pink. Heavily embellished with intricate tone-on-tone thread embroidery, fine sequin highlights, full sleeves, and flared kalis. Complete with matching scalloped sheer net dupatta with border embellishments and santoon inner lining.",
    shortDescription: "Dusty rose floor-length embroidered Georgette Anarkali gown with net dupatta.",
    sku: "NT-WMN-001",
    price: 3499,
    compareAtPrice: 4999,
    categorySlug: "womens-wear",
    fabric: "Pure Faux Georgette & Net with Santoon Lining",
    weave: "Embroidered Flare Weave",
    gsm: "160 GSM",
    widthInches: "Floor Length Flared Gown",
    careInstructions: "Dry clean only. Store in garment bag.",
    unitType: "PER_PIECE",
    minQuantity: 1,
    maxQuantity: 10,
    quantityStep: 1,
    stock: 22,
    isFeatured: true,
    image: "/images/products/pastel-rose-anarkali-gown.jpg",
    variants: [
      { name: "Size M (38)", type: "Size", value: "M", price: 3499, stock: 8, sku: "NT-WMN-001-M" },
      { name: "Size L (40)", type: "Size", value: "L", price: 3499, stock: 9, sku: "NT-WMN-001-L" },
      { name: "Size XL (42)", type: "Size", value: "XL", price: 3499, stock: 5, sku: "NT-WMN-001-XL" },
    ],
    wholesaleTiers: [
      { minQty: 3, maxQty: 6, price: 2890, label: "Boutique Pack (3-6 pcs)" },
      { minQty: 7, price: 2550, label: "Wholesale Partner (7+ pcs)" },
    ]
  },
  {
    name: "Festive Gold Jacquard Silk Kurta Set for Kids",
    slug: "kids-gold-jacquard-kurta-set",
    description: "Vibrant and rich mustard-gold jacquard silk ethnic kurta and dhoti-pant set for boys with matching brocade Nehru jacket overlay. Lined with ultra-soft 100% breathable pure cotton to ensure supreme comfort for young children during weddings, festivals, and ceremonies.",
    shortDescription: "Boys golden jacquard silk kurta and jacket set with cotton lining.",
    sku: "NT-KID-001",
    price: 1299,
    compareAtPrice: 1799,
    categorySlug: "kids-wear",
    fabric: "Jacquard Silk Blend with 100% Cotton Lining",
    weave: "Brocade Jacquard Weave",
    gsm: "150 GSM",
    widthInches: "Kids Regular Fit",
    careInstructions: "Dry clean or gentle cold hand wash. Cool iron.",
    unitType: "PER_PIECE",
    minQuantity: 1,
    maxQuantity: 20,
    quantityStep: 1,
    stock: 40,
    isFeatured: true,
    image: "/images/products/kids-gold-jacquard-kurta-set.jpg",
    variants: [
      { name: "Age 3-4 Years", type: "Age/Size", value: "3-4Y", price: 1299, stock: 10, sku: "NT-KID-001-3Y" },
      { name: "Age 5-6 Years", type: "Age/Size", value: "5-6Y", price: 1299, stock: 15, sku: "NT-KID-001-5Y" },
      { name: "Age 7-8 Years", type: "Age/Size", value: "7-8Y", price: 1299, stock: 15, sku: "NT-KID-001-7Y" },
    ],
    wholesaleTiers: [
      { minQty: 6, maxQty: 12, price: 990, label: "Kids Boutique Pack (6-12 pcs)" },
      { minQty: 13, price: 850, label: "Kids Wholesale (13+ pcs)" },
    ]
  }
];

async function seed() {
  console.log("Seeding categories...");

  for (const cat of CATEGORIES) {
    const parent = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
    });

    console.log(`✓ Category: ${parent.name} (${parent.slug})`);

    if (cat.subcategories) {
      for (const sub of cat.subcategories) {
        await prisma.category.upsert({
          where: { slug: sub.slug },
          update: {
            name: sub.name,
            description: sub.description,
            sortOrder: sub.sortOrder,
            parentId: parent.id,
            isActive: true,
          },
          create: {
            name: sub.name,
            slug: sub.slug,
            description: sub.description,
            sortOrder: sub.sortOrder,
            parentId: parent.id,
            isActive: true,
          },
        });
        console.log(`  └─ Subcategory: ${sub.name} (${sub.slug})`);
      }
    }
  }

  console.log("\nSeeding products...");

  for (const prod of PRODUCTS) {
    const category = await prisma.category.findUnique({
      where: { slug: prod.categorySlug },
    });

    if (!category) {
      console.error(`Category not found for slug: ${prod.categorySlug}`);
      continue;
    }

    const product = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        name: prod.name,
        description: prod.description,
        shortDescription: prod.shortDescription,
        sku: prod.sku,
        price: prod.price,
        compareAtPrice: prod.compareAtPrice,
        categoryId: category.id,
        fabric: prod.fabric,
        weave: prod.weave,
        gsm: prod.gsm,
        widthInches: prod.widthInches,
        careInstructions: prod.careInstructions,
        unitType: prod.unitType,
        minQuantity: prod.minQuantity,
        maxQuantity: prod.maxQuantity,
        quantityStep: prod.quantityStep,
        stock: prod.stock,
        isPublished: true,
        isArchived: false,
        isFeatured: prod.isFeatured,
      },
      create: {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        shortDescription: prod.shortDescription,
        sku: prod.sku,
        price: prod.price,
        compareAtPrice: prod.compareAtPrice,
        categoryId: category.id,
        fabric: prod.fabric,
        weave: prod.weave,
        gsm: prod.gsm,
        widthInches: prod.widthInches,
        careInstructions: prod.careInstructions,
        unitType: prod.unitType,
        minQuantity: prod.minQuantity,
        maxQuantity: prod.maxQuantity,
        quantityStep: prod.quantityStep,
        stock: prod.stock,
        isPublished: true,
        isArchived: false,
        isFeatured: prod.isFeatured,
      },
    });

    // Delete existing images for clean state
    await prisma.productImage.deleteMany({
      where: { productId: product.id },
    });

    // Create primary image
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: prod.image,
        alt: prod.name,
        sortOrder: 0,
        isPrimary: true,
      },
    });

    // Upsert variants
    await prisma.productVariant.deleteMany({
      where: { productId: product.id },
    });

    for (const v of prod.variants) {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          name: v.name,
          type: v.type,
          value: v.value,
          price: v.price,
          stock: v.stock,
          sku: v.sku,
          isActive: true,
        },
      });
    }

    // Upsert wholesale price tiers
    await prisma.wholesalePriceTier.deleteMany({
      where: { productId: product.id },
    });

    for (const tier of prod.wholesaleTiers) {
      await prisma.wholesalePriceTier.create({
        data: {
          productId: product.id,
          minQty: tier.minQty,
          maxQty: tier.maxQty || null,
          price: tier.price,
          label: tier.label,
        },
      });
    }

    console.log(`✓ Product: ${product.name} (SKU: ${product.sku}) in ${category.name}`);
  }

  // Ensure default StoreSettings are present
  const defaultSettings: Record<string, string> = {
    store_name: "NOBLE TEXTILE",
    store_phone: "+91 78210 59350",
    store_email: "contact@nobletextile.com",
    store_address: "Hatte Nagar, Latur, Maharashtra 413512, India",
    shipping_base_charge: "79",
    shipping_express_surcharge: "70",
    shipping_cod_charge: "50",
    shipping_free_threshold: "999",
    cod_enabled: "true",
    cod_max_amount: "10000",
    cod_serviceable_pincodes: "",
  };

  for (const [key, value] of Object.entries(defaultSettings)) {
    await prisma.storeSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  console.log("\n✓ All categories, subcategories, products, and store settings seeded successfully!");
}

seed()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
