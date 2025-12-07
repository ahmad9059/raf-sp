import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const departmentId = "flori";
  const departmentName = "Floriculture Research Institute"; // Or "Horticultural Research Sub-Station, for Floriculture and Landscaping"

  console.log(`Seeding ${departmentName}...`);

  // 1. Create or Update Department
  const department = await prisma.department.upsert({
    where: { id: departmentId },
    update: {
      name: departmentName,
      location: "Multan, Punjab",
      description: "Specialized research in ornamental plants, landscaping, floriculture production techniques, and horticultural development.",
      focalPerson: "Dr. Muhammad Muzamil Ijaz",
      designation: "Assistant Research Officer",
      phone: "03016984364",
      email: "muzamil.ijaz243@gmail.com",
    },
    create: {
      id: departmentId,
      name: departmentName,
      location: "Multan, Punjab",
      description: "Specialized research in ornamental plants, landscaping, floriculture production techniques, and horticultural development.",
      focalPerson: "Dr. Muhammad Muzamil Ijaz",
      designation: "Assistant Research Officer",
      phone: "03016984364",
      email: "muzamil.ijaz243@gmail.com",
    },
  });

  console.log("Department upserted:", department.name);

  // 2. Clear existing data for this department
  await prisma.floricultureStationAssets.deleteMany({
    where: { departmentId: department.id },
  });
  console.log("Cleared existing FloricultureStationAssets data.");

  // 3. Prepare Data
  const assets = [
    // Land Resource
    {
      category: "Land",
      name: "Total Area",
      detailsOrArea: "7.50", // Storing as number-like string for parsing if needed, or just display
      type: "Resource",
    },
    {
      category: "Land",
      name: "Cultivated Area",
      detailsOrArea: "6.5",
      type: "Resource",
    },
    {
      category: "Land",
      name: "Non-Cultivated Area",
      detailsOrArea: "1.0",
      type: "Resource",
    },

    // Building Details
    {
      category: "Building",
      name: "Administrative Office",
      detailsOrArea: "3.5 marlah",
      type: "Resource",
    },

    // Farm Machinery
    {
      category: "Farm Machinery",
      name: "Power Sprayer",
      sanctionedQty: 1,
      type: "Equipment",
    },
    {
      category: "Farm Machinery",
      name: "Brush Cutter",
      sanctionedQty: 1,
      type: "Equipment",
    },
    {
      category: "Farm Machinery",
      name: "Mini Rotavator",
      sanctionedQty: 1,
      type: "Equipment",
    },

    // Lab Machinery
    {
      category: "Lab Equipment",
      name: "Digital Balance",
      sanctionedQty: 1,
      type: "Equipment",
    },
    {
      category: "Lab Equipment",
      name: "Hydro Distillation Unit",
      sanctionedQty: 1,
      type: "Equipment",
    },

    // Human Resources
    {
      category: "Human Resources",
      itemNameOrPost: "Assistant Horticulturist",
      bpsScale: "18",
      sanctionedQty: 1,
      inPositionQty: 1,
      type: "Staff",
    },
    {
      category: "Human Resources",
      itemNameOrPost: "Assistant Research Officer",
      bpsScale: "17",
      sanctionedQty: 1,
      inPositionQty: 1,
      type: "Staff",
    },
    {
      category: "Human Resources",
      itemNameOrPost: "Senior Clerk",
      bpsScale: "14",
      sanctionedQty: 1,
      inPositionQty: 1,
      type: "Staff",
    },
    {
      category: "Human Resources",
      itemNameOrPost: "Budder",
      bpsScale: "8",
      sanctionedQty: 2,
      inPositionQty: 2,
      type: "Staff",
    },
    {
      category: "Human Resources",
      itemNameOrPost: "Jeep Driver",
      bpsScale: "6",
      sanctionedQty: 1,
      inPositionQty: 1,
      type: "Staff",
    },
    {
      category: "Human Resources",
      itemNameOrPost: "Tractor Driver",
      bpsScale: "8",
      sanctionedQty: 1,
      inPositionQty: 1,
      type: "Staff",
    },
    {
      category: "Human Resources",
      itemNameOrPost: "Mali",
      bpsScale: "5",
      sanctionedQty: 2,
      inPositionQty: 2,
      type: "Staff",
    },
    {
      category: "Human Resources",
      itemNameOrPost: "Beldars",
      bpsScale: "1,4,5",
      sanctionedQty: 7,
      inPositionQty: 7,
      type: "Staff",
    },
    {
      category: "Human Resources",
      itemNameOrPost: "Chowkidar",
      bpsScale: "2,1",
      sanctionedQty: 2,
      inPositionQty: 2,
      type: "Staff",
    },
    {
      category: "Human Resources",
      itemNameOrPost: "Naib Qasid",
      bpsScale: "5",
      sanctionedQty: 1,
      inPositionQty: 1,
      type: "Staff",
    },
    {
      category: "Human Resources",
      itemNameOrPost: "Sweeper",
      bpsScale: "2",
      sanctionedQty: 1,
      inPositionQty: 1,
      type: "Staff",
    },
  ];

  // 4. Insert Data
  console.log(`Inserting ${assets.length} items...`);
  
  await prisma.floricultureStationAssets.createMany({
    data: assets.map((item) => ({
      departmentId: department.id,
      name: item.name || item.itemNameOrPost || "Unknown",
      type: item.type,
      category: item.category,
      itemNameOrPost: item.itemNameOrPost,
      bpsScale: item.bpsScale,
      sanctionedQty: item.sanctionedQty,
      inPositionQty: item.inPositionQty,
      detailsOrArea: item.detailsOrArea,
    })),
  });

  console.log(`Seeded ${assets.length} items for ${departmentName}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
