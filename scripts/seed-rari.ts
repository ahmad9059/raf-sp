
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load environment variables
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const departmentId = "rari";
  const departmentName = "Regional Agricultural Research Institute";

  console.log(`Seeding ${departmentName}...`);

  // 1. Clean up existing data
  const conflictingDept = await prisma.department.findFirst({
    where: {
      name: departmentName,
      NOT: {
        id: departmentId
      }
    }
  });

  if (conflictingDept) {
    console.log(`Found conflicting department: ${conflictingDept.name} (${conflictingDept.id}). Deleting...`);
    await prisma.department.delete({
      where: { id: conflictingDept.id }
    });
  }

  // Upsert Department
  await prisma.department.upsert({
    where: { id: departmentId },
    update: {
      name: departmentName,
      location: "Bahawalpur, Punjab",
      description:
        "Comprehensive agricultural research focusing on crop improvement, plant protection, and sustainable farming practices for the region.",
      focalPerson: "RASHID MINHAS",
      designation: "PRINCIPAL SCIENTIST",
      phone: "",
      email: "",
      logo: "/images/rai.jpg.jpg",
    },
    create: {
      id: departmentId,
      name: departmentName,
      location: "Bahawalpur, Punjab",
      description:
        "Comprehensive agricultural research focusing on crop improvement, plant protection, and sustainable farming practices for the region.",
      focalPerson: "RASHID MINHAS",
      designation: "PRINCIPAL SCIENTIST",
      phone: "",
      email: "",
      logo: "/images/rai.jpg.jpg",
    },
  });

  // Delete existing assets
  await prisma.rARIBahawalpurAssets.deleteMany({
    where: { departmentId },
  });

  const dataPath = path.join(process.cwd(), "lib/data/rari.txt");
  const fileContent = fs.readFileSync(dataPath, "utf-8");
  const lines = fileContent.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);

  let currentSection = "";
  let assetsToCreate = [];

  // Manual Land Data Injection (since it's unstructured in text)
  assetsToCreate.push(
    { name: "Total Area", type: "Land", quantity: 178, conditionStatus: "Acres", departmentId },
    { name: "Cultivated Area", type: "Land", quantity: 123, conditionStatus: "Acres", departmentId },
    { name: "Roads/Building Area", type: "Land", quantity: 55, conditionStatus: "Acres", departmentId }
  );

  // Manual Building Data Injection
  assetsToCreate.push(
    { name: "Office Buildings", type: "Building", quantity: 5, conditionStatus: "Blocks", departmentId },
    { name: "Residential Quarters", type: "Building", quantity: 29, conditionStatus: "Units", departmentId },
    { name: "Produce Store/Shed", type: "Building", quantity: 1, conditionStatus: "Units", departmentId }
  );

  for (const line of lines) {
    if (line.includes("FARM MACHINERY/EQUIPMENT")) {
      currentSection = "FARM_MACHINERY";
      continue;
    } else if (line.includes("LAB MACHINERY/EQUIPMENT")) {
      currentSection = "LAB_MACHINERY";
      continue;
    } else if (line.includes("HUMAN RESOURCES")) {
      currentSection = "HR_OFFICERS";
      continue;
    } else if (line.includes("OFFICALS STAFF")) {
      currentSection = "HR_OFFICIALS";
      continue;
    }

    // Skip headers
    if (
      line.startsWith("Sr. No") ||
      line.startsWith("Name of") ||
      line.startsWith("S. No") ||
      line.startsWith("PROVISION") ||
      line.startsWith("•") ||
      line.startsWith("1\tRegional") // Skip the land row as we added it manually
    ) {
      continue;
    }

    if (currentSection === "FARM_MACHINERY") {
      // Format: 1 Rabi Drill 01 Working
      // Regex: Digit Name Quantity Remarks
      // The text file uses tabs or multiple spaces.
      // Example: 1	Rabi Drill 	01	Working
      const parts = line.split(/\t+/);
      if (parts.length >= 4) {
        assetsToCreate.push({
          name: parts[1].trim(),
          type: "Farm Machinery",
          quantity: parseInt(parts[2]),
          conditionStatus: parts[3].trim(),
          departmentId,
        });
      } else {
        // Try regex if split fails (sometimes spaces are used)
        const match = line.match(/^\d+\s+(.+?)\s+(\d+)\s+(.+)$/);
        if (match) {
          assetsToCreate.push({
            name: match[1].trim(),
            type: "Farm Machinery",
            quantity: parseInt(match[2]),
            conditionStatus: match[3].trim(),
            departmentId,
          });
        }
      }
    } else if (currentSection === "LAB_MACHINERY") {
      // Format: Name Use Condition
      // Example: Top Loaded Balance To Weight Soil Samples Working
      // This is hard to parse with regex because "Use" can contain spaces.
      // Assuming tab separation based on file look.
      const parts = line.split(/\t+/);
      if (parts.length >= 3) {
        assetsToCreate.push({
          name: parts[0].trim(),
          type: "Lab Equipment",
          useApplication: parts[1].trim(),
          conditionStatus: parts[2].trim(),
          departmentId,
        });
      }
    } else if (currentSection === "HR_OFFICERS" || currentSection === "HR_OFFICIALS") {
      // Format: 1 Principal Scientist: 19 08 01 07
      // Regex: Digit Name BS Sanctioned OnRoll Vacant
      // Note: Name might contain spaces.
      // Try tab split first
      const parts = line.split(/\t+/);
      if (parts.length >= 6) {
        assetsToCreate.push({
          name: parts[1].trim(),
          type: currentSection === "HR_OFFICERS" ? "HR - Officers" : "HR - Officials",
          category: `BPS-${parts[2].trim()}`,
          quantity: parseInt(parts[3]), // Sanctioned
          conditionStatus: `Filled: ${parts[4]}, Vacant: ${parts[5]}`,
          departmentId,
        });
      } else {
         // Regex fallback
         // 1 Name BS S R V
         const match = line.match(/^\d+\.?\s+(.+?)\s+(\d+)\s+(\d+)\s+(\d+|-\d*)\s+(\d+|-\d*)$/);
         if (match) {
            const filled = match[4] === '-' ? '0' : match[4];
            const vacant = match[5] === '-' ? '0' : match[5];
            assetsToCreate.push({
              name: match[1].trim(),
              type: currentSection === "HR_OFFICERS" ? "HR - Officers" : "HR - Officials",
              category: `BPS-${match[2].trim()}`,
              quantity: parseInt(match[3]),
              conditionStatus: `Filled: ${filled}, Vacant: ${vacant}`,
              departmentId,
            });
         }
      }
    }
  }

  console.log(`Found ${assetsToCreate.length} items to seed.`);

  if (assetsToCreate.length > 0) {
    await prisma.rARIBahawalpurAssets.createMany({
      data: assetsToCreate,
    });
    console.log("Seeding completed successfully.");
  } else {
    console.log("No data found to seed.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
