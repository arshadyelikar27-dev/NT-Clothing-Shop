const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearCustomers() {
  console.log('Starting customer data cleanup...');
  
  // 1. Get all customer users
  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    select: { id: true }
  });
  
  const customerIds = customers.map(c => c.id);
  console.log(`Found ${customerIds.length} customers to delete.`);
  
  if (customerIds.length === 0) {
    console.log('No customers found.');
    return;
  }

  // 2. Get all orders for these customers
  const orders = await prisma.order.findMany({
    where: { userId: { in: customerIds } },
    select: { id: true }
  });
  const orderIds = orders.map(o => o.id);
  console.log(`Found ${orderIds.length} orders to delete.`);
  
  if (orderIds.length > 0) {
    // 3. Delete payments for these orders
    const payments = await prisma.payment.deleteMany({
      where: { orderId: { in: orderIds } }
    });
    console.log(`Deleted ${payments.count} payments.`);
    
    // 4. Delete the orders
    const deletedOrders = await prisma.order.deleteMany({
      where: { id: { in: orderIds } }
    });
    console.log(`Deleted ${deletedOrders.count} orders.`);
  }
  
  // 5. Delete all reviews by these customers (just in case they aren't cascaded properly)
  const reviews = await prisma.review.deleteMany({
    where: { userId: { in: customerIds } }
  });
  console.log(`Deleted ${reviews.count} reviews.`);
  
  // 6. Finally, delete the users. This will cascade and delete their Addresses, Carts, etc.
  const deletedUsers = await prisma.user.deleteMany({
    where: { id: { in: customerIds } }
  });
  
  console.log(`Deleted ${deletedUsers.count} customers successfully.`);
}

clearCustomers().catch(console.error).finally(() => prisma.$disconnect());
