import "dotenv/config";
import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcrypt";

async function seedExtLogin() {
  const password = await bcrypt.hash("ChangeMe123!", 10);
//   const department = await prisma.department.findFirst({
//     where: {
//       email: "ext@agripunjab.gov.pk",
//     },
//   });
//   if (!department) {
//     throw new Error("Department Not found");
//   }
  await prisma.user.upsert({
    where: {
      email: "ext@agripunjab.gov.pk",
    },
    update: {
      name: "Agri Extension Wing Focal Person",
      email: "ext@agripunjab.gov.pk",
      password,
      role: "DEPT_HEAD",
      departmentId: "agri-ext",
    },
    create: {
      name: "Agri Extension Wing Focal Person",
      email: "ext@agripunjab.gov.pk",
      password,
      role: "DEPT_HEAD",
      departmentId: "agri-ext",
    },
  });
  console.log("Seeded Successful");
}

seedExtLogin()
  .catch((err) => {
    console.error("Seeding failed", err);
    process.exit(1);
  })
  .finally(async () => {
    prisma.$disconnect();
  });
