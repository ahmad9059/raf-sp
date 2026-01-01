import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const departmentId = "agronomy";
const departmentName = "Agronomy Department";

const agronomyEquipment = [
  { name: "Analytical Balance", quantity: 1, type: "Balances & Scales", displayOrder: 1 },
  { name: "Digital Balance", quantity: 3, type: "Balances & Scales", displayOrder: 2 },
  { name: "Top Loading Balance", quantity: 2, type: "Balances & Scales", displayOrder: 3 },
  { name: "Leaf Area Meter", quantity: 1, type: "Meters & Sensors", displayOrder: 4 },
  { name: "Flame Photometer", quantity: 1, type: "Analytical Instruments", displayOrder: 5 },
  { name: "SPAD", quantity: 1, type: "Meters & Sensors", displayOrder: 6 },
  { name: "pH Meter", quantity: 1, type: "Meters & Sensors", displayOrder: 7 },
  { name: "EC Meter", quantity: 1, type: "Meters & Sensors", displayOrder: 8 },
  { name: "Autoclave", quantity: 1, type: "Sterilization", displayOrder: 9 },
  { name: "Cooling Incubator", quantity: 1, type: "Incubation", displayOrder: 10 },
  { name: "Oven", quantity: 2, type: "Processing Equipment", displayOrder: 11 },
  { name: "Trinocular Microscope", quantity: 1, type: "Microscopy", displayOrder: 12 },
  { name: "Hot Plate & Magnetic Stirrer", quantity: 2, type: "Processing Equipment", displayOrder: 13 },
  { name: "Moisture Meter", quantity: 1, type: "Meters & Sensors", displayOrder: 14 },
  { name: "Water Distillation Unit", quantity: 1, type: "Water Systems", displayOrder: 15 },
  { name: "Water Bath", quantity: 1, type: "Processing Equipment", displayOrder: 16 },
  { name: "Mini Centrifuge Machine", quantity: 1, type: "Separation", displayOrder: 17 },
  { name: "Spectrophotometer", quantity: 1, type: "Analytical Instruments", displayOrder: 18 },
  { name: "Seed Grinder", quantity: 1, type: "Processing Equipment", displayOrder: 19 },
  { name: "Kjeldahl Apparatus", quantity: 1, type: "Analytical Instruments", displayOrder: 20 },
  { name: "Digital Vernier Caliper", quantity: 1, type: "Measurement Tools", displayOrder: 21 },
  { name: "Aquarium Pump", quantity: 2, type: "Support Equipment", displayOrder: 22 },
];

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
      description: "Specializes in crop production, soil management, and sustainable farming practices for improved agricultural productivity.",
      focalPerson: "Dr. Nabeel Ahmad Ikram",
      designation: "Assistant Professor",
      phone: "+92-61-9210072",
      email: "nabeel.ahmad@mnsuam.edu.pk",
    },
    create: {
      id: departmentId,
      name: departmentName,
      location: "MNS University of Agriculture, Multan",
      description: "Specializes in crop production, soil management, and sustainable farming practices for improved agricultural productivity.",
      focalPerson: "Dr. Nabeel Ahmad Ikram",
      designation: "Assistant Professor",
      phone: "+92-61-9210072",
      email: "nabeel.ahmad@mnsuam.edu.pk",
    },
  });

  console.log(`✅ ${departmentName} department ready (ID: ${department.id})`);

  // Clear existing equipment for this department
  await prisma.agronomyLabEquipment.deleteMany({
    where: { departmentId: department.id },
  });
  console.log("Cleared existing Agronomy equipment data");

  // Insert new equipment data
  await prisma.agronomyLabEquipment.createMany({
    data: agronomyEquipment.map((item) => ({
      departmentId: department.id,
      name: item.name,
      type: item.type,
      quantity: item.quantity,
      displayOrder: item.displayOrder,
      focalPerson1: "Dr. Nabeel Ahmad Ikram",
    })),
  });

  console.log(`✅ Successfully added ${agronomyEquipment.length} equipment items to ${departmentName}`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
