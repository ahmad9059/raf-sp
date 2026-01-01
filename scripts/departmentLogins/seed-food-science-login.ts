import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";

async function seedFoodScienceLogin() {
  const password = await bcrypt.hash("ChangeMe123!", 10);

  await prisma.user.upsert({
    where: { email: "shabbir.ahmad@mnsuam.edu.pk" },
    update: {
      name: "Food Science and Technology Focal Person",
      password,
      role: "DEPT_HEAD",
      departmentId: "food-science",
    },
    create: {
      name: "Food Science and Technology Focal Person",
      email: "shabbir.ahmad@mnsuam.edu.pk",
      password,
      role: "DEPT_HEAD",
      departmentId: "food-science",
    },
  });

  console.log("✅ Food Science login seeded");
}

seedFoodScienceLogin()
  .catch((err) => {
    console.error("Seeding Food Science login failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
