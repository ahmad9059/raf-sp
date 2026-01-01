import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";

async function seedSoilLogin() {
  const password = await bcrypt.hash("ChangeMe123!", 10);

  await prisma.user.upsert({
    where: { email: "swt_mltn@yahoo.com" },
    update: {
      name: "Soil & Water Testing Lab Focal Person",
      password,
      role: "DEPT_HEAD",
      departmentId: "soil-water",
    },
    create: {
      name: "Soil & Water Testing Lab Focal Person",
      email: "swt_mltn@yahoo.com",
      password,
      role: "DEPT_HEAD",
      departmentId: "soil-water",
    },
  });

  console.log("✅ Soil & Water Testing Lab login seeded");
}

seedSoilLogin()
  .catch((err) => {
    console.error("Seeding Soil & Water Testing Lab login failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
