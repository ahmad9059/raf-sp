import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";

async function seedEntomologyLogin() {
  const password = await bcrypt.hash("ChangeMe123!", 10);

  await prisma.user.upsert({
    where: { email: "asifa_hameed_sheikh@yahoo.com" },
    update: {
      name: "Entomology Research Sub-Station Focal Person",
      password,
      role: "DEPT_HEAD",
      departmentId: "erss",
    },
    create: {
      name: "Entomology Research Sub-Station Focal Person",
      email: "asifa_hameed_sheikh@yahoo.com",
      password,
      role: "DEPT_HEAD",
      departmentId: "erss",
    },
  });

  console.log("✅ Entomology login seeded");
}

seedEntomologyLogin()
  .catch((err) => {
    console.error("❌ Seeding entomology login failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
