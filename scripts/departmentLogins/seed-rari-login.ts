import "dotenv/config";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";

async function seedAmriLogin() {
  const password = await bcrypt.hash("ChangeMe123!", 10);

  await prisma.user.upsert({
    where: {
      email: "rari@example.com",
    },
    update: {},
    create: {
      name: "RARI Focal Person",
      email: "rari@example.com",
      password,
      role: "DEPT_HEAD",
      departmentId: "rari",
    },
  });
  console.log("Seeding Successful");
}
seedAmriLogin()
.catch(err=>{
    console.error("Seeding Failed",err);
    process.exit(1)
})
.finally(async()=>{
    prisma.$disconnect();
})