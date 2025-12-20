import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";

async function seedFloricultureLogin() {
  const password = await bcrypt.hash("ChangeMe123!", 10);

  await prisma.user.upsert({
    where: {
      email: "muzamil.ijaz243@gmail.com",
    },
    update: {
      name: "Floriculture Focal Person",
      password,
      role: "DEPT_HEAD",
      departmentId: "flori",
    },
    create: {
      name: "Floriculture Focal Person",
      email: "muzamil.ijaz243@gmail.com",
      password,
      role: "DEPT_HEAD",
      departmentId: "flori",
    },
  });
  console.log("✅ Floriculture login seeded");
}

seedFloricultureLogin()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
