import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";

async function seedCRILogin() {
  const password = await bcrypt.hash("ChangeMe123!", 10);

  await prisma.user.upsert({
    where: { email: "dircrimm@gmail.com" },
    update: {
      name: "Cotton Research Institute Focal Person",
      password,
      role: "DEPT_HEAD",
      departmentId: "cri",
    },
    create: {
      name: "Cotton Research Institute Focal Person",
      email: "dircrimm@gmail.com",
      password,
      role: "DEPT_HEAD",
      departmentId: "cri",
    },
  });

  console.log("✅ CRI login seeded");
}

seedCRILogin()
  .catch((err) => {
    console.error("Seeding CRI login failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
