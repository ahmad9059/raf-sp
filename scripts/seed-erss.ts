import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const departmentId = "erss";
const departmentName = "Entomological Research Sub Station Multan";

async function main() {
  console.log(`Seeding ${departmentName}...`);

  // Check for existing department with same name but different ID
  const existingDeptByName = await prisma.department.findUnique({
    where: { name: departmentName },
  });

  if (existingDeptByName && existingDeptByName.id !== departmentId) {
    console.log(`Found existing department with different ID: ${existingDeptByName.id}. Deleting it...`);
    await prisma.department.delete({
      where: { id: existingDeptByName.id },
    });
    console.log("Deleted existing department.");
  }

  // Also check for "Entomology Research Sub-Station" (alternative name from seed-departments.ts)
  const existingDeptAlt = await prisma.department.findUnique({
    where: { name: "Entomology Research Sub-Station" },
  });

  if (existingDeptAlt && existingDeptAlt.id !== departmentId) {
    console.log(`Found existing department with alternative name. Deleting it...`);
    await prisma.department.delete({
      where: { id: existingDeptAlt.id },
    });
    console.log("Deleted existing department with alternative name.");
  }

  // Create or Update Department
  const department = await prisma.department.upsert({
    where: { id: departmentId },
    update: {
      name: departmentName,
      location: "Multan, Punjab",
      description: "Research on insect pests, beneficial insects, and integrated pest management strategies.",
      focalPerson: "Dr. Asifa Hameed",
      designation: "Principal Scientist",
      phone: "+92-61-9210075",
      email: "asifa_hameed_sheikh@yahoo.com",
    },
    create: {
      id: departmentId,
      name: departmentName,
      location: "Multan, Punjab",
      description: "Research on insect pests, beneficial insects, and integrated pest management strategies.",
      focalPerson: "Dr. Asifa Hameed",
      designation: "Principal Scientist",
      phone: "+92-61-9210075",
      email: "asifa_hameed_sheikh@yahoo.com",
    },
  });

  console.log(`✅ ${departmentName} department ready (ID: ${department.id})`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
