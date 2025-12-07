
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
  console.log("Seeding Agricultural Engineering data...");

  // 1. Create or Update Department
  const deptData = {
    name: "Agriculture Engineering",
    location: "Multan, Pakistan",
    description: "Agricultural Engineering Department responsible for land development, water conservation, and farm mechanization.",
    focalPerson: "Mr. Muhammad Abdul Haye Faisal",
    designation: "Director Agricultural (Technical) Multan",
    phone: "0334-7456723",
    email: "daemultan@yahoo.com",
    logo: "/images/agri.jpg.png", // Assuming this exists or using the one from the component
  };

  const department = await prisma.department.upsert({
    where: { name: deptData.name },
    update: deptData,
    create: deptData,
  });

  console.log(`Department '${department.name}' ready.`);

  // 2. Clear existing data
  await prisma.agriEngineeringMultanRegionData.deleteMany({
    where: { departmentId: department.id },
  });
  console.log("Cleared existing Agri Engineering data.");

  // 3. Seed Building Details
  const buildings = [
    { division: "Multan", name: "Director Agricultural engineering Multan", area: "8 acres 1 kanal" },
    { division: "Multan", name: "Assistant Director Agriculturla Engineer Khanewal", area: "2 acres 3 kanals" },
    { division: "Multan", name: "Assistant Director Agriculturla Engineering Vehari", area: "3 acres" },
    { division: "Bahawalpur", name: "Director Agricultural Engineering Bahawalpur", area: "24 acres" },
    { division: "Bahawalpur", name: "Director Agricultural Engineering (Training Bahawalpur)", area: "5 acres" },
    { division: "Bahawalpur", name: "Assistant Director Agricultural Engineering R.Y Khan", area: "9.375 acre" },
    { division: "Bahawalpur", name: "Assistant Director Agricultural Engineering Bahawalnagar", area: "4 acres 06 kanal 2 marla" },
    { division: "D.G Khan", name: "Director Agricultural Engineering, D.G Khan", area: "5 acres 7 kanal 4 marla" },
    { division: "D.G Khan", name: "Unit Supervisor Taunsa Sharif", area: "5 kanal" },
    { division: "D.G Khan", name: "Assistant Director Agricultural Engineering Muzaffargarh", area: "2 acre" },
    { division: "D.G Khan", name: "Assistant Director Agricultural Engineering Rajanpur", area: "Rented" },
    { division: "Layyah", name: "Director Agricultural Engineering Layyah", area: "41 Kanal 10 marla" },
    { division: "Layyah", name: "Unit Supervisor Layyah", area: "2 kanal" },
    { division: "Layyah", name: "Assistant Director Agricultural Engineering Bhakkar", area: "5 kanal" },
    { division: "Sahiwal", name: "Agricultural Engineering Workshop Sahiwal", area: "2 acre, 6 kanal" },
    { division: "Sahiwal", name: "Agricultural Engineering Workshop Okara", area: "Rented" },
  ];

  for (const b of buildings) {
    await prisma.agriEngineeringMultanRegionData.create({
      data: {
        departmentId: department.id,
        type: "Building Details",
        name: b.name,
        divisionOrCity: b.division,
        quantityOrArea: b.area,
      },
    });
  }

  // 4. Seed Farm Machinery
  const machinery = [
    // Bulldozers
    { category: "Bulldozers", name: "Director Agricultural Engineering Multan", count: "24" },
    { category: "Bulldozers", name: "Director Agricultural Engineering Sahiwal", count: "7" },
    { category: "Bulldozers", name: "Director Agricultural Engineering D.G Khan", count: "35" },
    { category: "Bulldozers", name: "Director Agricultural Engineering Layyah", count: "23" },
    { category: "Bulldozers", name: "Director Agricultural Engineering Bahawalpur", count: "42" },
    // Hand Boring Plants
    { category: "Hand Boring Plants", name: "Director Agricultural Engineering Multan", count: "6" },
    { category: "Hand Boring Plants", name: "Director Agricultural Engineering Sahiwal", count: "4" },
    { category: "Hand Boring Plants", name: "Director Agricultural Engineering D.G Khan", count: "2" },
    { category: "Hand Boring Plants", name: "Director Agricultural Engineering Layyah", count: "4" },
    { category: "Hand Boring Plants", name: "Director Agricultural Engineering Bahawalpur", count: "6" },
    // Power Drilling Rigs
    { category: "Power Drilling Rigs", name: "Director Agricultural Engineering D.G Khan", count: "3" },
    // Electric Resistivity Meters
    { category: "Electric Resistivity Meters", name: "Director Agricultural Engineering Multan", count: "3" },
    { category: "Electric Resistivity Meters", name: "Director Agricultural Engineering Sahiwal", count: "2" },
    { category: "Electric Resistivity Meters", name: "Director Agricultural Engineering D.G Khan", count: "3" },
    { category: "Electric Resistivity Meters", name: "Director Agricultural Engineering Layyah", count: "1" },
    { category: "Electric Resistivity Meters", name: "Director Agricultural Engineering Bahawalpur", count: "3" },
  ];

  for (const m of machinery) {
    await prisma.agriEngineeringMultanRegionData.create({
      data: {
        departmentId: department.id,
        type: "Farm Machinery",
        category: m.category,
        name: m.name,
        quantityOrArea: m.count,
      },
    });
  }

  // 5. Seed Human Resources
  const hr = [
    { name: "Additional Director General (Agricultural Engineering), Multan", count: "30" },
    { name: "Director Agricultural Engineering (M&E), Multan", count: "6" },
    { name: "Director Agricultural Engineering Multan", count: "136" },
    { name: "Director Agricultural Engineering Bahawalpur", count: "209" },
    { name: "Director Agricultural Engineering D.G Khan", count: "136" },
    { name: "Director Agricultural Engineering Layyah", count: "115" },
    { name: "Director Agricultural Engineering Sahiwal", count: "36" },
    { name: "Director Agricultural Engineering (Training), Bahawalpur", count: "24" },
  ];

  for (const h of hr) {
    await prisma.agriEngineeringMultanRegionData.create({
      data: {
        departmentId: department.id,
        type: "Human Resources",
        name: h.name,
        quantityOrArea: h.count,
      },
    });
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
