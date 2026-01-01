import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";

async function seedMNSUAMLogin() {
  const password = await bcrypt.hash("ChangeMe123!", 10);

  await prisma.user.upsert({
    where: { email: "mahmood.alam@mnsuam.edu.pk" },
    update: {
      name: "MNSUAM Focal Person",
      password,
      role: "DEPT_HEAD",
      departmentId: "mnsuam",
    },
    create: {
      name: "MNSUAM Focal Person",
      email: "mahmood.alam@mnsuam.edu.pk",
      password,
      role: "DEPT_HEAD",
      departmentId: "mnsuam",
    },
  });

  console.log("✅ MNSUAM login seeded");
}

seedMNSUAMLogin()
  .catch((err) => {
    console.error("Seeding MNSUAM login failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
