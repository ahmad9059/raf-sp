import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";

async function seedPesticideLogin() {
  const password = await bcrypt.hash("ChangeMe123!", 10);

  await prisma.user.upsert({
    where: { email: "sd96850@gmail.com" },
    update: {
      name: "Pesticide QC Lab Focal Person",
      password,
      role: "DEPT_HEAD",
      departmentId: "pest",
    },
    create: {
      name: "Pesticide QC Lab Focal Person",
      email: "sd96850@gmail.com",
      password,
      role: "DEPT_HEAD",
      departmentId: "pest",
    },
  });

  console.log("✅ Pesticide QC Lab login seeded");
}

seedPesticideLogin()
  .catch((err) => {
    console.error("Seeding Pesticide login failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
