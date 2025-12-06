import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const labEquipment = [
  { name: "Electrical Penetration Graph", model: "GIGA-8d DC amplifier", department: "Integrated Pest Management Laboratory", status: "Functional" },
  { name: "Electrical Germinator", model: "Theijang Top Cloud Agri Tech. Co. Ltd", department: "Integrated Pest Management Laboratory", status: "Functional" },
  { name: "Spectrophotometer", model: "K5600S-KAIRO", department: "Laboratory of Molecular Biology", status: "Non-Functional" },
  { name: "HPLC", model: "GB/T26792-2019", department: "Analytical Laboratory", status: "Non-Functional" },
  { name: "Atomic Absorption Spectroscopy", model: "AA6100+", department: "Analytical Laboratory", status: "Non-Functional" },
  { name: "Digital Droplet PCR", model: "D3200PRO", department: "Laboratory of Molecular Biology", status: "Non-Functional" },
  { name: "Automatic DNA Extraction Unit", model: "BFEX-96E", department: "Laboratory of Molecular Biology", status: "Non-Functional" },
  { name: "Tissue Grinder", model: "NO3D13", department: "Laboratory of Molecular Biology", status: "Non-Functional" },
  { name: "Fluorescence Microscope", model: "MF-43M", department: "Analytical Laboratory", status: "Non-Functional" },
  { name: "Incubator", model: "MDS-200", department: "Laboratory of Molecular Biology", status: "Non-Functional" },
  { name: "Freezer -20°C", model: "MDF-40H485", department: "Laboratory of Molecular Biology", status: "Non-Functional" },
  { name: "Refrigerated Centrifuge", model: "Velocity30R", department: "Laboratory of Molecular Biology", status: "Non-Functional" },
  { name: "Stereoscope", model: "Euromex Microscopes Holland", department: "Integrated Pest Management Laboratory", status: "Functional" },
  { name: "Light Microscope", model: "Euromex Microscopes Holland", department: "Integrated Pest Management Laboratory", status: "Functional" },
  { name: "IRGA", model: "CID BIOSCIENCE CI-340", department: "Laboratory of Physiology", status: "Non-Functional" },
  { name: "Drying Oven", model: "RΔYPΔ", department: "Integrated Pest Management Laboratory", status: "Functional" },
  { name: "Gradient PCR", model: "FC-96B", department: "Laboratory of Molecular Biology", status: "Non-Functional" },
  { name: "HVI", model: "Uster HVI-1000", department: "Fiber Testing Laboratory", status: "Functional" },
];

const farmMachinery = [
  { name: "Massey Ferguson-375", year: "1999", location: "CRI, Farm Shed" },
  { name: "Massey Ferguson-240", year: "1991", location: "CRI, Farm Shed" },
  { name: "Cultivator (13-tines)", year: "2012", location: "CRI, Farm Shed" },
  { name: "Chisel Plough", year: "1998", location: "CRI, Farm Shed" },
  { name: "Trolley for Tractor (12X7ft)", year: "-", location: "CRI, Farm Shed" },
  { name: "Disc Plough", year: "2017", location: "CRI, Farm Shed" },
  { name: "Fertilizer Spreader", year: "2000", location: "CRI, Farm Shed" },
  { name: "Land Leveler", year: "2014", location: "CRI, Farm Shed" },
  { name: "Boom Sprayer", year: "2008", location: "CRI, Farm Shed" },
  { name: "Laser Land Leveler", year: "2016", location: "CRI, Farm Shed" },
  { name: "Ridger for Bed & Furrow", year: "1998", location: "CRI, Farm Shed" },
  { name: "Automatic Kharif Drill", year: "2018", location: "CRI, Farm Shed" },
  { name: "Rotavator (42 blades)", year: "2012", location: "CRI, Farm Shed" },
  { name: "Water Tank", year: "2017", location: "CRI, Farm Shed" },
  { name: "Timmy Rotary Weeder", year: "1999", location: "CRI, Farm Shed" },
  { name: "Cotton Ridger with Fertilizer", year: "1998", location: "CRI, Farm Shed" },
  { name: "Cotton Hand Drill", year: "2005", location: "CRI, Farm Shed" },
  { name: "Tractor Driven Tarphali", year: "2008", location: "CRI, Farm Shed" },
  { name: "Disc Harrow", year: "2016", location: "CRI, Farm Shed" },
  { name: "Ditcher", year: "2017", location: "CRI, Farm Shed" },
  { name: "Wheat Straw Slasher", year: "2017", location: "CRI, Farm Shed" },
  { name: "Thresher with Elevator", year: "2018", location: "CRI, Farm Shed" },
];

async function main() {
  console.log("Seeding Cotton Research Institute data...");

  // Create or update department
  const department = await prisma.department.upsert({
    where: { name: "Cotton Research Institute" },
    update: {
      location: "Old Shujabad Road Multan",
      description: "Leading research in cotton cultivation, variety development, pest management, and fiber quality improvement for Pakistan's cotton industry.",
      focalPerson: "Dr. Muhammad Tauseef",
      designation: "Senior Scientist (Agronomy)",
      phone: "+923340072357",
      email: "dircrimm@gmail.com",
    },
    create: {
      name: "Cotton Research Institute",
      location: "Old Shujabad Road Multan",
      description: "Leading research in cotton cultivation, variety development, pest management, and fiber quality improvement for Pakistan's cotton industry.",
      focalPerson: "Dr. Muhammad Tauseef",
      designation: "Senior Scientist (Agronomy)",
      phone: "+923340072357",
      email: "dircrimm@gmail.com",
    },
  });

  console.log(`Department created/updated: ${department.name}`);

  // Delete existing CRI assets
  await prisma.cRIMultanAssets.deleteMany({
    where: { departmentId: department.id },
  });

  console.log("Deleted existing CRI assets");

  // Seed lab equipment
  for (const equipment of labEquipment) {
    await prisma.cRIMultanAssets.create({
      data: {
        name: equipment.name,
        type: "Laboratory Equipment",
        makeModel: equipment.model,
        labDepartment: equipment.department,
        quantity: 1,
        operationalStatus: equipment.status,
        departmentId: department.id,
      },
    });
  }

  console.log(`Seeded ${labEquipment.length} lab equipment items`);

  // Seed farm machinery
  for (const machinery of farmMachinery) {
    await prisma.cRIMultanAssets.create({
      data: {
        name: machinery.name,
        type: "Farm Machinery",
        year: machinery.year,
        location: machinery.location,
        quantity: 1,
        operationalStatus: "Functional",
        departmentId: department.id,
      },
    });
  }

  console.log(`Seeded ${farmMachinery.length} farm machinery items`);
  console.log("✅ CRI data seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
