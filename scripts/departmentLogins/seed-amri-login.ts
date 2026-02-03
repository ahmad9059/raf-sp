import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";

async function seedAmriLogin() {
  const password = await bcrypt.hash("ChangeMe123!", 10);

  await prisma.user.upsert({
    where: {
      email: "focalperson@amri.gov.pk",
    },
    update: {
      name: "AMRI Focal Person",
      password,
      role: "DEPT_HEAD",
      departmentId: "amri",
    },
    create: {
      name: "AMRI Focal Person",
      email: "focalperson@amri.gov.pk",
      password,
      role: "DEPT_HEAD",
      departmentId: "amri",
    },
  });

  console.log("✅ AMRI login seeded");
}

seedAmriLogin()
  .catch((err) => {
    console.error("Seeding AMRI login failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });