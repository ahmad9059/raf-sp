import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";

async function seedAgriLogin() {
  const password = await bcrypt.hash("ChangeMe123!", 10);

  await prisma.user.upsert({
    where: {
      email: "daemultan@yahoo.com",
    },
    update: {
      name: "Agriculture Engineering Field Wing Focal Person",
      password,
      role: "DEPT_HEAD",
      departmentId: "agri-eng",
    },
    create: {
      name: "Agriculture Engineering Field Wing Focal Person",
      email: "daemultan@yahoo.com",
      password,
      role: "DEPT_HEAD",
      departmentId: "agri-eng",
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
