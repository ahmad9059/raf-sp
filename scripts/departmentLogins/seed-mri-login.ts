import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";

async function seedMRILogin() {
  const password = await bcrypt.hash("ChangeMe123!", 10);
  
  await prisma.user.upsert({
    where: {
      email: "abidhameedkhan@yahoo.com",
    },
    update: {
      name: "MRI Department Focal Person",
      password,
      role: "DEPT_HEAD",
      departmentId: "mri",
    },
    create: {
      name: "MRI Department Focal Person",
      email: "abidhameedkhan@yahoo.com",
      password,
      role: "DEPT_HEAD",
      departmentId: "mri",
    },
  });

  console.log("✅ MRI login seeded");
}

seedMRILogin()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
