const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@nobletextile.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  // Check if admin exists by email
  const existingAdmin = await prisma.user.findFirst({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const admin = await prisma.user.create({
      data: {
        name: "Admin User",
        email: adminEmail,
        phone: "0000000000",
        password: hashedPassword,
        role: "SUPER_ADMIN",
      },
    });
    console.log("✅ Admin user created:", admin.email);
  } else {
    console.log("✅ Admin user already exists:", existingAdmin.email);
  }
}

main()
  .catch((e) => {
    console.error("❌ Error seeding admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
