import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";

async function seedAgronomyLogin() {
  const password = await bcrypt.hash("ChangeMe123!", 10);

  await prisma.user.upsert({
    where: { email: "nabeel.ahmad@mnsuam.edu.pk" },
    update: {
      name: "Dr. Nabeel Ahmad Ikram",
      password,
      role: "DEPT_HEAD",
      departmentId: "agronomy",
    },
    create: {
      name: "Dr. Nabeel Ahmad Ikram",
      email: "nabeel.ahmad@mnsuam.edu.pk",
      password,
      role: "DEPT_HEAD",
      departmentId: "agronomy",
    },
  });

  console.log("✅ Agronomy Department login seeded");
  console.log("\n📋 Login Credentials:");
  console.log("   Email: nabeel.ahmad@mnsuam.edu.pk");
  console.log("   Password: ChangeMe123!");
  console.log("   Role: DEPT_HEAD");
  console.log("   Department: Agronomy Department");
}

seedAgronomyLogin()
  .catch((err) => {
    console.error("Seeding Agronomy login failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
