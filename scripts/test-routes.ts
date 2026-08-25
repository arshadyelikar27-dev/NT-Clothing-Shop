import { prisma } from "../src/lib/db";

async function testAllCatalogRoutes() {
  const categories = await prisma.category.findMany({ where: { isActive: true } });
  const products = await prisma.product.findMany({ where: { isPublished: true, isArchived: false } });

  const routes = [
    '/',
    '/shop',
    '/shop?sort=newest',
    '/shop?sort=best-selling',
    '/shop?sort=price-low',
    '/shop?sort=price-high',
    '/about',
    '/contact',
    '/shipping',
    '/returns',
    '/privacy',
    '/terms',
    '/cart',
    '/checkout',
    '/login',
    '/register',
    '/account',
    '/account/wishlist',
    '/account/orders',
    ...categories.map(c => `/category/${c.slug}`),
    ...products.map(p => `/product/${p.slug}`)
  ];

  console.log(`Starting test for ${routes.length} total store routes (${categories.length} categories, ${products.length} products)...`);
  let passed = 0;
  let failed = 0;
  const failedRoutes: string[] = [];

  for (const route of routes) {
    try {
      const res = await fetch(`http://localhost:3000${route}`);
      if (res.status === 200) {
        console.log(`✓ [200 OK] ${route}`);
        passed++;
      } else {
        console.error(`✗ [${res.status} FAILED] ${route}`);
        failed++;
        failedRoutes.push(`${route} (${res.status})`);
      }
    } catch (e: any) {
      console.error(`✗ [ERROR] ${route} -> ${e.message}`);
      failed++;
      failedRoutes.push(`${route} (Error: ${e.message})`);
    }
  }

  console.log(`\n==========================================`);
  console.log(`Result: ${passed}/${routes.length} passed (${failed} failed)`);
  if (failedRoutes.length > 0) {
    console.log(`Failed routes:`, failedRoutes);
  }
  console.log(`==========================================`);
}

testAllCatalogRoutes();
