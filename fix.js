const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixDuplicates() {
  console.log('Starting deduplication...');
  const users = await prisma.user.findMany({ include: { addresses: true } });
  let deletedCount = 0;
  let updatedOrders = 0;
  
  for (const user of users) {
    const seen = new Map();
    
    for (const address of user.addresses) {
      const key = `${address.house}|${address.street}|${address.city}|${address.pinCode}`;
      if (seen.has(key)) {
        const keepId = seen.get(key);
        // Update all orders referencing this duplicate address
        const res = await prisma.order.updateMany({
          where: { addressId: address.id },
          data: { addressId: keepId }
        });
        updatedOrders += res.count;
        
        // Delete the duplicate address
        await prisma.address.delete({
          where: { id: address.id }
        });
        deletedCount++;
        console.log(`Deleted duplicate address ${address.id} for user ${user.name}`);
      } else {
        seen.set(key, address.id);
      }
    }
  }
  console.log(`Done! Deleted ${deletedCount} duplicate addresses, updated ${updatedOrders} orders.`);
}

fixDuplicates().catch(console.error).finally(() => prisma.$disconnect());
