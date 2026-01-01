import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const departmentId = "food-science";
const departmentName = "Food Science and Technology";

async function main() {
  console.log(`Seeding ${departmentName}...`);

  // Check for existing department with same name but different ID
  const existingDept = await prisma.department.findUnique({
    where: { name: departmentName },
  });

  if (existingDept && existingDept.id !== departmentId) {
    console.log(`Found existing department with different ID: ${existingDept.id}. Deleting it...`);
    await prisma.department.delete({
      where: { id: existingDept.id },
    });
    console.log("Deleted existing department.");
  }

  // Create or Update Department
  const department = await prisma.department.upsert({
    where: { id: departmentId },
    update: {
      name: departmentName,
      location: "MNS University of Agriculture, Multan",
      description: "Focuses on the science of food, from production to consumption, including food safety, nutrition, and processing technologies.",
      focalPerson: "Dr. Shabbir Ahmad",
      designation: "Professor & Head",
      phone: "+92-61-9210071",
      email: "shabbir.ahmad@mnsuam.edu.pk",
    },
    create: {
      id: departmentId,
      name: departmentName,
      location: "MNS University of Agriculture, Multan",
      description: "Focuses on the science of food, from production to consumption, including food safety, nutrition, and processing technologies.",
      focalPerson: "Dr. Shabbir Ahmad",
      designation: "Professor & Head",
      phone: "+92-61-9210071",
      email: "shabbir.ahmad@mnsuam.edu.pk",
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
