import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";

async function seedRAEDCLogin() {
  const password = await bcrypt.hash("ChangeMe123!", 10);

  await prisma.user.upsert({
    where: { email: "raedc@agripunjab.gov.pk" },
    update: {
      name: "RAEDC Focal Person",
      password,
      role: "DEPT_HEAD",
      departmentId: "raedc",
    },
    create: {
      name: "RAEDC Focal Person",
      email: "raedc@agripunjab.gov.pk",
      password,
      role: "DEPT_HEAD",
      departmentId: "raedc",
    },
  });

  console.log("✅ RAEDC login seeded");
}

seedRAEDCLogin()
  .catch((err) => {
    console.error("Seeding RAEDC login failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
