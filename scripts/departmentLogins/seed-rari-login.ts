import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";

async function seedRariLogin() {
  const password = await bcrypt.hash("ChangeMe123!", 10);

  await prisma.user.upsert({
    where: {
      email: "rari@agripunjab.gov.pk",
    },
    update: {
      name: "RARI Focal Person",
      password,
      role: "DEPT_HEAD",
      departmentId: "rari",
    },
    create: {
      name: "RARI Focal Person",
      email: "rari@agripunjab.gov.pk",
      password,
      role: "DEPT_HEAD",
      departmentId: "rari",
    },
  });

  console.log("✅ RARI login seeded");
}

seedRariLogin()
  .catch((err) => {
    console.error("Seeding RARI login failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });