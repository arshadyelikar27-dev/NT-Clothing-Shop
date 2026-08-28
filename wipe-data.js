const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log("Wiping dummy data...");
  try {
    // Delete all orders and related records
    await prisma.orderTimeline.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();

    // Delete all cart items and carts
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();

    // Delete products and variants
    await prisma.review.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();

    // Delete categories
    await prisma.category.deleteMany();

    // Delete all addresses
    await prisma.address.deleteMany();

    // Delete users except admin
    await prisma.user.deleteMany({
      where: {
        email: {
          not: 'admin@nobletextile.com'
        }
      }
    });

    console.log("Data wiped successfully.");
  } catch (error) {
    console.error("Error wiping data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
