import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@nobletextile.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";
  const hashedPassword = await hashPassword(adminPassword);

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
