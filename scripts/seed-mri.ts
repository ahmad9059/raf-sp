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
  const departmentId = "mri";
  const departmentName = "Mango Research Institute";

  console.log(`Seeding ${departmentName}...`);

  // 0. Check for existing department with same name but different ID
  const existingDept = await prisma.department.findUnique({
    where: { name: departmentName },
  });

  if (existingDept && existingDept.id !== departmentId) {
    console.log(`Found existing department with different ID: ${existingDept.id}. Deleting it...`);
    // Delete related assets first if cascade doesn't handle it (though schema says onDelete: Cascade)
    // We rely on Cascade for MRIAssets, but we might need to handle Users manually if we want to preserve them.
    // For now, assuming we can just delete the department.
    await prisma.department.delete({
      where: { id: existingDept.id },
    });
    console.log("Deleted existing department.");
  }

  // 1. Create or Update Department
  const department = await prisma.department.upsert({
    where: { id: departmentId },
    update: {
      name: departmentName,
      location: "Multan, Punjab",
      description: "Dedicated research facility for mango cultivation, variety development, post-harvest technologies, and quality improvement.",
      focalPerson: "Mr. Abid Hameed Khan",
      designation: "Scientific Officer- Entomology",
      phone: "0300-6326987",
      email: "abidhameedkhan@yahoo.com",
    },
    create: {
      id: departmentId,
      name: departmentName,
      location: "Multan, Punjab",
      description: "Dedicated research facility for mango cultivation, variety development, post-harvest technologies, and quality improvement.",
      focalPerson: "Mr. Abid Hameed Khan",
      designation: "Scientific Officer- Entomology",
      phone: "0300-6326987",
      email: "abidhameedkhan@yahoo.com",
    },
  });

  console.log("Department upserted:", department.name);

  // 2. Clear existing data for this department
  await prisma.mRIAssets.deleteMany({
    where: { departmentId: department.id },
  });
  console.log("Cleared existing MRIAssets data.");

  // 3. Prepare Data
  const assets = [
    // Land Resource
    { category: "Land", name: "Office", remarksOrLocation: "9 Acre", type: "Resource" },
    { category: "Land", name: "Roads & Buildings", remarksOrLocation: "23 Acre", type: "Resource" },
    { category: "Land", name: "Direct Cultivated Area", remarksOrLocation: "32 Acre", type: "Resource" },
    { category: "Land", name: "Total Area", remarksOrLocation: "64 Acre", type: "Resource" },

    // Building Details
    { category: "Building", name: "Building Area", remarksOrLocation: "4 Acres", type: "Resource" },
    { category: "Building", name: "Rooms", totalQuantityOrPosts: 39, type: "Resource" },
    { category: "Building", name: "Men Washroom", totalQuantityOrPosts: 2, type: "Resource" },
    { category: "Building", name: "Women Washroom", totalQuantityOrPosts: 1, type: "Resource" },

    // Farm Machinery
    { category: "Farm Machinery", name: "Tractor", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Farm Machinery", name: "Tractor Trolley", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Farm Machinery", name: "Cultivator", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Farm Machinery", name: "Rotavator", totalQuantityOrPosts: 2, type: "Equipment" },
    { category: "Farm Machinery", name: "Weeds slasher", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Farm Machinery", name: "Air Blast Sprayer", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Farm Machinery", name: "Nozel Sprayer", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Farm Machinery", name: "Water Bowser", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Farm Machinery", name: "Border Disc", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Farm Machinery", name: "Electric Lawn Mower", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Farm Machinery", name: "Manual Lawn Mower", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Farm Machinery", name: "Soil Rotary Tiller", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Farm Machinery", name: "Rear Blade", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Farm Machinery", name: "Hedge Cutter", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Farm Machinery", name: "Trench", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Farm Machinery", name: "Post Hole Digger", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Farm Machinery", name: "Vehicles", totalQuantityOrPosts: 4, type: "Equipment" },

    // Lab Machinery
    { category: "Lab Equipment", name: "Flamephotometer", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Lab Equipment", name: "Shaker", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Lab Equipment", name: "EC-Meter", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Lab Equipment", name: "pH Meter", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Lab Equipment", name: "Digital Weight Balance", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Lab Equipment", name: "Analytical Balance", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Lab Equipment", name: "Hot Plate", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Lab Equipment", name: "Grinder", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Lab Equipment", name: "Oven", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Lab Equipment", name: "Magnetic Hot Plate", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Lab Equipment", name: "Spectrophoto meter", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Lab Equipment", name: "Muffal Furnace", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Lab Equipment", name: "Distilation Unit", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Lab Equipment", name: "Test tube shaker", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Lab Equipment", name: "Autoclave", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Lab Equipment", name: "Distillation unit", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Lab Equipment", name: "Sample grinder", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Lab Equipment", name: "pH meter", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Lab Equipment", name: "EC meter", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Lab Equipment", name: "Ethylene generator", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Lab Equipment", name: "Digital balance", totalQuantityOrPosts: 2, type: "Equipment" },
    { category: "Lab Equipment", name: "Digital burette", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Lab Equipment", name: "Digital Refractrometer", totalQuantityOrPosts: 2, type: "Equipment" },
    { category: "Lab Equipment", name: "Hot water bath", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Lab Equipment", name: "Pulp blender", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Lab Equipment", name: "NIR Case", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Lab Equipment", name: "Hot air dryer", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Lab Equipment", name: "Incubator", totalQuantityOrPosts: 2, type: "Equipment" },
    { category: "Lab Equipment", name: "Small incubator", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Lab Equipment", name: "Laminar flow chamber", totalQuantityOrPosts: 2, type: "Equipment" },
    { category: "Lab Equipment", name: "Autoclave", totalQuantityOrPosts: 3, type: "Equipment" },
    { category: "Lab Equipment", name: "Stereoscope", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Lab Equipment", name: "Microscope", totalQuantityOrPosts: 3, type: "Equipment" },
    { category: "Lab Equipment", name: "Oven", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Lab Equipment", name: "Oven", totalQuantityOrPosts: 1, type: "Equipment" },
    { category: "Lab Equipment", name: "Microtome", totalQuantityOrPosts: 1, type: "Equipment" },

    // Human Resources
    { category: "Human Resources", itemNameOrDesignation: "Principal Scientist (Horticulture)/ Director", bpsScale: 19, totalQuantityOrPosts: 1, filledOrFunctional: 1, vacantOrNonFunctional: 0, type: "Staff" },
    { category: "Human Resources", itemNameOrDesignation: "Principal Scientist (Horticulture)", bpsScale: 19, totalQuantityOrPosts: 1, filledOrFunctional: 0, vacantOrNonFunctional: 1, type: "Staff" },
    { category: "Human Resources", itemNameOrDesignation: "Prinicpal Scientist (Microbiology)", bpsScale: 19, totalQuantityOrPosts: 1, filledOrFunctional: 0, vacantOrNonFunctional: 1, type: "Staff" },
    { category: "Human Resources", itemNameOrDesignation: "Principal Scientist (Plant Pathology)", bpsScale: 19, totalQuantityOrPosts: 1, filledOrFunctional: 0, vacantOrNonFunctional: 1, type: "Staff" },
    { category: "Human Resources", itemNameOrDesignation: "Senior Scientist (Soil Science )", bpsScale: 18, totalQuantityOrPosts: 1, filledOrFunctional: 0, vacantOrNonFunctional: 1, type: "Staff" },
    { category: "Human Resources", itemNameOrDesignation: "Senior Scientist(Entomology)", bpsScale: 18, totalQuantityOrPosts: 1, filledOrFunctional: 1, vacantOrNonFunctional: 0, type: "Staff" },
    { category: "Human Resources", itemNameOrDesignation: "Senior Scientist(Food Technology)", bpsScale: 18, totalQuantityOrPosts: 1, filledOrFunctional: 0, vacantOrNonFunctional: 1, type: "Staff" },
    { category: "Human Resources", itemNameOrDesignation: "Senior Scientist Horticulture", bpsScale: 18, totalQuantityOrPosts: 2, filledOrFunctional: 2, vacantOrNonFunctional: 0, type: "Staff" },
    { category: "Human Resources", itemNameOrDesignation: "Scientific Officer (Horticulture)", bpsScale: 17, totalQuantityOrPosts: 3, filledOrFunctional: 2, vacantOrNonFunctional: 1, type: "Staff" },
    { category: "Human Resources", itemNameOrDesignation: "Scientific Officer (Plant Pathology)", bpsScale: 17, totalQuantityOrPosts: 1, filledOrFunctional: 1, vacantOrNonFunctional: 0, type: "Staff" },
    { category: "Human Resources", itemNameOrDesignation: "Scientific Officer (Entomology)", bpsScale: 17, totalQuantityOrPosts: 1, filledOrFunctional: 1, vacantOrNonFunctional: 0, type: "Staff" },
    { category: "Human Resources", itemNameOrDesignation: "Scientific Officer (Post-harvest)", bpsScale: 17, totalQuantityOrPosts: 1, filledOrFunctional: 1, vacantOrNonFunctional: 0, type: "Staff" },
    { category: "Human Resources", itemNameOrDesignation: "Suprintendent", bpsScale: 17, totalQuantityOrPosts: 1, filledOrFunctional: 0, vacantOrNonFunctional: 1, type: "Staff" },
    { category: "Human Resources", itemNameOrDesignation: "ASSISTANT", bpsScale: 16, totalQuantityOrPosts: 1, filledOrFunctional: 1, vacantOrNonFunctional: 0, type: "Staff" },
    { category: "Human Resources", itemNameOrDesignation: "Stenographer", bpsScale: 15, totalQuantityOrPosts: 1, filledOrFunctional: 1, vacantOrNonFunctional: 0, type: "Staff" },
    { category: "Human Resources", itemNameOrDesignation: "Senior Clerk", bpsScale: 14, totalQuantityOrPosts: 1, filledOrFunctional: 1, vacantOrNonFunctional: 0, type: "Staff" },
    { category: "Human Resources", itemNameOrDesignation: "Field Assistant", bpsScale: 11, totalQuantityOrPosts: 1, filledOrFunctional: 0, vacantOrNonFunctional: 1, type: "Staff" },
    { category: "Human Resources", itemNameOrDesignation: "Junior Clerk", bpsScale: 11, totalQuantityOrPosts: 2, filledOrFunctional: 1, vacantOrNonFunctional: 1, type: "Staff" },
    { category: "Human Resources", itemNameOrDesignation: "Laboratory Assistant", bpsScale: 6, totalQuantityOrPosts: 3, filledOrFunctional: 1, vacantOrNonFunctional: 2, type: "Staff" },
    { category: "Human Resources", itemNameOrDesignation: "Budder", bpsScale: 5, totalQuantityOrPosts: 4, filledOrFunctional: 0, vacantOrNonFunctional: 4, type: "Staff" },
    { category: "Human Resources", itemNameOrDesignation: "Tractor Driver", bpsScale: 5, totalQuantityOrPosts: 1, filledOrFunctional: 0, vacantOrNonFunctional: 1, type: "Staff" },
    { category: "Human Resources", itemNameOrDesignation: "Vehicle Driver", bpsScale: 5, totalQuantityOrPosts: 2, filledOrFunctional: 2, vacantOrNonFunctional: 0, type: "Staff" },
    { category: "Human Resources", itemNameOrDesignation: "Turbine Operator", bpsScale: 3, totalQuantityOrPosts: 1, filledOrFunctional: 1, vacantOrNonFunctional: 0, type: "Staff" },
    { category: "Human Resources", itemNameOrDesignation: "Beldar", bpsScale: 1, totalQuantityOrPosts: 6, filledOrFunctional: 5, vacantOrNonFunctional: 1, type: "Staff" },
    { category: "Human Resources", itemNameOrDesignation: "Chowkidar", bpsScale: 1, totalQuantityOrPosts: 6, filledOrFunctional: 6, vacantOrNonFunctional: 0, type: "Staff" }, // BPS not specified, assuming 1
    { category: "Human Resources", itemNameOrDesignation: "Laboratory Attendant", bpsScale: 1, totalQuantityOrPosts: 3, filledOrFunctional: 2, vacantOrNonFunctional: 1, type: "Staff" },
    { category: "Human Resources", itemNameOrDesignation: "Naib Qasid", bpsScale: 1, totalQuantityOrPosts: 2, filledOrFunctional: 2, vacantOrNonFunctional: 0, type: "Staff" },
    { category: "Human Resources", itemNameOrDesignation: "Sweeper", bpsScale: 1, totalQuantityOrPosts: 1, filledOrFunctional: 1, vacantOrNonFunctional: 0, type: "Staff" },
  ];

  // 4. Insert Data
  console.log(`Inserting ${assets.length} items...`);
  
  await prisma.mRIAssets.createMany({
    data: assets.map((item) => ({
      departmentId: department.id,
      name: item.name || item.itemNameOrDesignation || "Unknown",
      type: item.type,
      category: item.category,
      itemNameOrDesignation: item.itemNameOrDesignation,
      bpsScale: item.bpsScale,
      totalQuantityOrPosts: item.totalQuantityOrPosts,
      filledOrFunctional: item.filledOrFunctional,
      vacantOrNonFunctional: item.vacantOrNonFunctional,
      remarksOrLocation: item.remarksOrLocation,
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
