import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";

async function seedARCLogin() {
  const password = await bcrypt.hash("ChangeMe123!", 10);

  await prisma.user.upsert({
    where: { email: "arc@agripunjab.gov.pk" },
    update: {
      name: "Adaptive Research Center Focal Person",
      password,
      role: "DEPT_HEAD",
      departmentId: "arc",
    },
    create: {
      name: "Adaptive Research Center Focal Person",
      email: "arc@agripunjab.gov.pk",
      password,
      role: "DEPT_HEAD",
      departmentId: "arc",
    },
  });

  console.log("✅ Adaptive Research Center login seeded");
}

seedARCLogin()
  .catch((err) => {
    console.error("❌ Seeding ARC login failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
