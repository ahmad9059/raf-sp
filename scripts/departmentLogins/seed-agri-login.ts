import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";

async function seedAgriLogin() {
  const password = await bcrypt.hash("ChangeMe123!", 10);

  // First, find the department by name to get the correct ID
  const department = await prisma.department.findFirst({
    where: {
      name: "Agriculture Engineering Field Wing",
    },
  });

  if (!department) {
    console.error("❌ Agriculture Engineering department not found. Please run seed-agri-eng.ts first.");
    process.exit(1);
  }

  console.log(`Found department: ${department.name} (ID: ${department.id})`);

  await prisma.user.upsert({
    where: {
      email: "daemultan@yahoo.com",
    },
    update: {
      name: "Agriculture Engineering Field Wing Focal Person",
      password,
      role: "DEPT_HEAD",
      departmentId: department.id,
    },
    create: {
      name: "Agriculture Engineering Field Wing Focal Person",
      email: "daemultan@yahoo.com",
      password,
      role: "DEPT_HEAD",
      departmentId: department.id,
    },
  });
  console.log("✅ Agri Engineering login seeded");
}

seedAgriLogin()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
