import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const departmentId = "amri";
const departmentName = "Agricultural Mechanization Research Institute";

const infrastructureData = [
  { name: "Farm Area", quantity: "8 acres", remarks: "For field demonstration machinery and testing and trials", type: "Infrastructure" },
  { name: "Design Lab", quantity: "1", remarks: "Designing of agricultural machinery by using 3D printers and autoCaD software", type: "Laboratory" },
  { name: "Workshop", quantity: "1", remarks: "Manufacturing and repairing machinery by using a welding facility, conventional lathe machine, plasma cutter, CNC Miling and CNC lathe", type: "Facility" },
  { name: "Spray Lab", quantity: "1", remarks: "Testing of Sprays and nozzles by using lab equipment i.e spray pump testers, drift test bench, gauge tester, independent nozzle tester", type: "Laboratory" },
  { name: "Administrative Block", quantity: "2", remarks: "For the offices of ADG, Director(T&T) , Director(F&W), Director(D&D)", type: "Infrastructure" },
  { name: "Machinery Sheds", quantity: "2", remarks: "For the parking and placement of machinery and implements", type: "Infrastructure" },
];

const machineryData = [
  { name: "Disk Plow", quantity: "1 No", status: "Functional" },
  { name: "Ditcher", quantity: "1 No", status: "Functional" },
  { name: "Chisel Plow", quantity: "1 No", status: "Functional" },
  { name: "Border Disk", quantity: "1 No", status: "Functional" },
  { name: "Post Hole Digger", quantity: "1 No", status: "Functional" },
  { name: "Fertilizer Spreader", quantity: "1 No", status: "Functional" },
  { name: "Disk Retoner", quantity: "1 No", status: "Functional" },
  { name: "Rice Straw Shredder", quantity: "1 No", status: "Functional" },
  { name: "MB Plough 5-tine (Local)", quantity: "1 No", status: "Functional" },
  { name: "Trencher along with cross", quantity: "1 No", status: "Functional" },
  { name: "Sprinkler Gun", quantity: "1 No", status: "Functional" },
  { name: "Jip Crane", quantity: "1 No", status: "Functional" },
  { name: "Wheat Bed Planter", quantity: "1 No", status: "Functional" },
  { name: "Double coulter Drill with Fertilizer", quantity: "1 No", status: "Functional" },
  { name: "Vegetable Seeder", quantity: "2 No", status: "Functional" },
  { name: "Vegetable Planter", quantity: "2 No", status: "Functional" },
  { name: "Maize Cob Harvester", quantity: "2 No", status: "Functional" },
  { name: "Mango Pruner", quantity: "2 No", status: "Functional" },
  { name: "Hydraulic Trolley", quantity: "1 No", status: "Functional" },
  { name: "Sugarcane Loader", quantity: "2 No", status: "Functional" },
  { name: "Sugarcane Crusher", quantity: "2 No", status: "Functional" },
  { name: "Tadder (Class) ", quantity: "1 No", status: "Functional" },
  { name: "Rack (Class)", quantity: "1 No", status: "Functional" },
  { name: "Silage Bailer ", quantity: "2 No", status: "Functional" },
  { name: "Sugarcane Loader (Local Made)", quantity: "1 No", status: "Functional" },
  { name: "Onion Harvester", quantity: "1 No", status: "Functional" },
  { name: "Hay Bailer", quantity: "1 No", status: "Functional" },
  { name: "Hay Buster Drill (Imported)", quantity: "1 No", status: "Functional" },
  { name: "Hay Buster Drill (Local)", quantity: "3 No", status: "Functional" },
  { name: "Rigger Vegetable", quantity: "1 No", status: "Functional" },
  { name: "Cotton Ball Stripper", quantity: "1 No", status: "Functional" },
  { name: "Fruit Picker", quantity: "1 No", status: "Functional" },
  { name: "Rotary Disk Harrow", quantity: "1 No", status: "Functional" },
  { name: "Wheat Bed & Farrow Drill", quantity: "1 No", status: "Functional" },
  { name: "Bud Cutter", quantity: "1 No", status: "Functional" },
  { name: "Wheat Wrapper", quantity: "1 No", status: "Functional " },
  { name: "AMRI Super Seeder (Old)", quantity: "1 No", status: "Functional" },
  { name: "Walk Behind Reaper", quantity: "1 No", status: "Functional" },
  { name: "ULV Sprayer", quantity: "1 No", status: "Functional" },
  { name: "Jecto/Canon Sprayer", quantity: "1 No", status: "Functional" },
  { name: "Vegetable Nursery Transplanter with Ridger (Local)", quantity: "1 No", status: "Functional" },
  { name: "Vegetable Nursery Transplanter (Imported)", quantity: "1 No", status: "Functional" },
  { name: "Hay Bailer (Local)", quantity: "1 No", status: "Functional" },
  { name: "Hay Bailer (Imported)", quantity: "1 No", status: "Functional" },
  { name: "Rotary Tillage and fertilizer seeder (Imported)", quantity: "1 No", status: "Functional" },
  { name: "Inter Tillage weeder (Cultivator)", quantity: "2 No", status: "Functional" },
  { name: "Trimmer", quantity: "1 No", status: "Functional" },
  { name: "Orchard Sprayer", quantity: "1 No", status: "Functional" },
  { name: "Speed Cultivator", quantity: "1 No", status: "Functional" },
  { name: "Sugarcane Base cutter", quantity: "1 No", status: "Functional" },
  { name: "Tadder (Imported)", quantity: "1 No", status: "Functional" },
  { name: "Rack (Imported)", quantity: "1 No", status: "Functional" },
  { name: "Vegetable Nursery Transplanter USA", quantity: "1 No", status: "Functional" },
  { name: "Vegetable Nursery Transplanter China", quantity: "1 No", status: "Functional" },
  { name: "Onion Harvester (Local)", quantity: "1 No", status: "Functional" },
  { name: "Rice Nursery Raising Machine", quantity: "1 No", status: "Functional" },
  { name: "Hot Water Treatment Plant", quantity: "1 No", status: "Functional" },
  { name: "Garlic Weeder (Local)", quantity: "1 No", status: "Functional" },
  { name: "Rotary Slasher (Sugarcane)", quantity: "1 No", status: "Functional" },
  { name: "Disc Harrow", quantity: "1 No", status: "Functional" },
  { name: "Fruit Picker", quantity: "1 No", status: "Functional" },
  { name: "Cotton Root Digger", quantity: "1 No", status: "Functional" },
  { name: "Cotton Stock Shredder", quantity: "1 No", status: "Functional" },
  { name: "Cotton Root Digger", quantity: "1 No", status: "Functional" },
  { name: "Cultivator (5-tine)", quantity: "1 No", status: "Functional" },
  { name: "Rotary Slusher (Cotton)", quantity: "1 No", status: "Functional" },
  { name: "Large Disc Harrow", quantity: "1 No", status: "Functional" },
  { name: "MB Plough 3-bottom (Imported)", quantity: "1 No", status: "Functional" },
  { name: "MB Plough 3-bottom (Local)", quantity: "1 No", status: "Functional" },
  { name: "MB Plough 2-bottom (Imported)", quantity: "1 No", status: "Functional" },
  { name: "Rice Transplanter", quantity: "1 No", status: "Not Functional" },
  { name: "Sub Soiler", quantity: "1 No", status: "Not Functional" },
  { name: "Rotary Slasher", quantity: "1 No", status: "Not Functional" },
  { name: "Spring Tine Cultivator", quantity: "1 No", status: "Not Functional" },
  { name: "Sugarcane set cutter", quantity: "1 No", status: "Not Functional" },
  { name: "Self-Leveling boom sprayer", quantity: "1 No", status: "Not Functional" },
  { name: "Bed Shipper Planter", quantity: "1 No", status: "Not Functional" },
  { name: "Granular Distributor", quantity: "1 No", status: "Not Functional" },
  { name: "AMRI Rotary Ditcher", quantity: "1 No", status: "Not Functional" },
  { name: "Precision Sprayer (Local Made)", quantity: "1 No", status: "Not Functional" },
  { name: "Para Plough", quantity: "1 No", status: "Not Functional" },
  { name: "Wheat Straw Bailer", quantity: "1 No", status: "Not Functional" },
  { name: "Runner Type Dry Sowing Drill", quantity: "1 No", status: "Not Functional" },
  { name: "Hand Fertilizer Spreader (AMRI Made)", quantity: "1 No", status: "Not Functional" },
  { name: "Sugarcane Harvester", quantity: "1 No", status: "Not Functional" },
  { name: "Chopper Blower", quantity: "1 No", status: "Not Functional" },
  { name: "Coulter Type (Drill Cotton)", quantity: "1 No", status: "Not Functional" },
  { name: "Hill Planter", quantity: "1 No", status: "Not Functional" },
  { name: "Bracketing Machine", quantity: "1 No", status: "Not Functional" },
  { name: "Rotary Harrow", quantity: "1 No", status: "Not Functional" },
  { name: "Mechanical Hitch Cutter", quantity: "1 No", status: "Not Functional" },
  { name: "Garlic Harvester ", quantity: "2 No", status: "Not Functional" },
  { name: "Fodder Cutter/Wrapper", quantity: "2 No", status: "Not Functional" },
  { name: "Sugarcane Loader (Local Made)", quantity: "1 No", status: "Not Functional" },
  { name: "Garlic Harvester (Local Made)", quantity: "1 No", status: "Not Functional" },
  { name: "Forage Harvester", quantity: "1 No", status: "Not Functional" },
  { name: "Maize Rigger Planter", quantity: "1 No", status: "Not Functional" },
  { name: "Rotary Rigger", quantity: "1 No", status: "Not Functional" },
  { name: "Fodder Chopper Stationary", quantity: "1 No", status: "Not Functional" },
  { name: "Multicrop Planter", quantity: "1 No", status: "Not Functional" },
  { name: "White Fly Shaker", quantity: "1 No", status: "Not Functional" },
  { name: "Small disc Harrow", quantity: "1 No", status: "Not Functional" },
  { name: "MB Plough Small", quantity: "1 No", status: "Not Functional" },
  { name: "Cultivator (7-tine)", quantity: "1 No", status: "Not Functional" },
  { name: "Garlic Planter", quantity: "1 No", status: "Not Functional" },
  { name: "Fodder Cutter disc mover (local)", quantity: "1 No", status: "Not Functional" },
  { name: "Garlic Harvester (Imported)", quantity: "1 No", status: "Not Functional" },
  { name: "Wheat Straw Chopper Blower", quantity: "1 No", status: "Not Functional" },
  { name: "Rota Drill", quantity: "1 No", status: "Not Functional" },
  { name: "Rotary Drill", quantity: "1 No", status: "Not Functional" },
  { name: "Single Coulter Drill", quantity: "1 No", status: "Not Functional" },
  { name: "Carrot Washer (Engine)", quantity: "1 No", status: "Not Functional" },
  { name: "Carrot Washer (Tractor Mounted)", quantity: "1 No", status: "Not Functional" },
  { name: "Double Coulter Drill with fertilizer", quantity: "1 No", status: "Not Functional" },
  { name: "Sugarcane rotavator", quantity: "1 No", status: "Not Functional" },
  { name: "Garlic Planter", quantity: "1 No", status: "Not Functional" },
  { name: "Multi Crop Planter", quantity: "1 No", status: "Not Functional" },
  { name: "Fodder Cutter Cum Chopper", quantity: "1 No", status: "Not Functional" },
  { name: "Wheat Straw Baler", quantity: "1 No", status: "Not Functional" },
  { name: "Laser Land Leveler", quantity: "1 No", status: "Not Functional" },
];

async function main() {
  console.log("Seeding AMRI data...");

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

  // Create or update department
  const department = await prisma.department.upsert({
    where: { id: departmentId },
    update: {
      name: departmentName,
      location: "Multan",
      description: "Research and development in farm machinery, mechanization technologies, and agricultural engineering for modern farming solutions.",
      focalPerson: "Mr Ghulam Hussain",
      designation: "Director (T&T)",
      phone: "061-9200786",
      email: "", // Email not provided in text
    },
    create: {
      id: departmentId,
      name: departmentName,
      location: "Multan",
      description: "Research and development in farm machinery, mechanization technologies, and agricultural engineering for modern farming solutions.",
      focalPerson: "Mr Ghulam Hussain",
      designation: "Director (T&T)",
      phone: "061-9200786",
      email: "",
    },
  });

  console.log(`Department created/updated: ${department.name}`);

  // Delete existing AMRI inventory
  await prisma.aMRIInventory.deleteMany({
    where: { departmentId: department.id },
  });

  console.log("Deleted existing AMRI inventory");

  // Seed Infrastructure/Labs
  for (const item of infrastructureData) {
    await prisma.aMRIInventory.create({
      data: {
        name: item.name,
        type: item.type,
        quantityOrArea: item.quantity,
        remarks: item.remarks,
        departmentId: department.id,
      },
    });
  }
  console.log(`Seeded ${infrastructureData.length} infrastructure items`);

  // Seed Machinery
  for (const item of machineryData) {
    await prisma.aMRIInventory.create({
      data: {
        name: item.name,
        type: "Machinery",
        quantityOrArea: item.quantity,
        functionalStatus: item.status,
        departmentId: department.id,
      },
    });
  }
  console.log(`Seeded ${machineryData.length} machinery items`);

  console.log("✅ AMRI data seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
