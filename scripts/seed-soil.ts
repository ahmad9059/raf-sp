
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
  const departmentId = "soil-water";
  const departmentName = "Soil & Water Testing Laboratory";

  console.log(`Seeding ${departmentName}...`);

  // 1. Clean up existing data
  // Check if department exists with a different ID but same name to avoid unique constraint errors
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
  const department = await prisma.department.upsert({
    where: { id: departmentId },
    update: {
      name: departmentName,
      location: "Multan, Punjab",
      description: "Comprehensive soil and water analysis services providing critical data for agricultural research and farmer support across the region.",
      focalPerson: "Ms. Fatima Bibi",
      designation: "Principal Scientist",
      phone: "061-4423568",
      email: "swt_mltn@yahoo.com",
      logo: "/images/soil.png.jpg",
    },
    create: {
      id: departmentId,
      name: departmentName,
      location: "Multan, Punjab",
      description: "Comprehensive soil and water analysis services providing critical data for agricultural research and farmer support across the region.",
      focalPerson: "Ms. Fatima Bibi",
      designation: "Principal Scientist",
      phone: "061-4423568",
      email: "swt_mltn@yahoo.com",
      logo: "/images/soil.png.jpg",
    },
  });

  // Delete existing assets for this department
  await prisma.soilWaterTestingProject.deleteMany({
    where: { departmentId },
  });

  const dataPath = path.join(process.cwd(), "lib/data/soil.txt");
  const fileContent = fs.readFileSync(dataPath, "utf-8");
  const lines = fileContent.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);

  let currentSection = "";
  let assetsToCreate = [];

  for (const line of lines) {
    // Detect Sections
    if (line.includes("Budget Summary of the Project")) {
      currentSection = "BUDGET";
      continue;
    } else if (line.includes("HR (Officers)")) {
      currentSection = "HR_OFFICERS";
      continue;
    } else if (line.includes("HR (Officials)")) {
      currentSection = "HR_OFFICIALS";
      continue;
    } else if (line.includes("Plant & Machinery")) {
      currentSection = "MACHINERY";
      continue;
    }

    // Skip headers
    if (
      line.startsWith("Code") ||
      line.startsWith("#") ||
      line.startsWith("Total Estimate") ||
      line.startsWith("Total")
    ) {
      continue;
    }

    // Parse Data based on section
    if (currentSection === "BUDGET") {
      // Format: Code Particulars 2025-26 ... Total
      // Example: A01 Total Employees Related Expenses 00.000 10.000 10.000 10.000 30.00
      // Regex to capture Code, Name, and the last number as Total
      const match = line.match(/^([A-Z0-9]+)\s+(.+?)\s+[\d\.]+\s+[\d\.]+\s+[\d\.]+\s+[\d\.]+\s+([\d\.]+)$/);
      if (match) {
        assetsToCreate.push({
          name: match[2].trim(),
          type: "Budget",
          category: match[1].trim(), // Code
          budgetAllocationTotalMillion: parseFloat(match[3]),
          departmentId,
        });
      }
    } else if (currentSection === "HR_OFFICERS" || currentSection === "HR_OFFICIALS") {
      // Format: # Officials BPS Posts
      // Example: 1 Scientific Officer (Lab) 17 2
      const match = line.match(/^\d+\s+(.+?)\s+(\d+)\s+(\d+)$/);
      if (match) {
        assetsToCreate.push({
          name: match[1].trim(),
          type: currentSection === "HR_OFFICERS" ? "HR - Officers" : "HR - Officials",
          bps: parseInt(match[2]),
          quantityRequired: parseInt(match[3]),
          departmentId,
        });
      }
    } else if (currentSection === "MACHINERY") {
      // Format: # Plant & Machinery Quantity Required Justification
      // Example: 1 Photo Copier 1 Seminars /workshops /meetings
      // This is tricky because Justification can contain spaces.
      // Regex: Number Name Quantity Justification
      // Let's try to split by tab if possible, but the file seems space separated or tab separated.
      // Assuming the structure: Digit Name Digit Justification
      const match = line.match(/^\d+\s+(.+?)\s+(\d+)\s+(.+)$/);
      if (match) {
        assetsToCreate.push({
          name: match[1].trim(),
          type: "Machinery",
          quantityRequired: parseInt(match[2]),
          justificationOrYear: match[3].trim(),
          departmentId,
        });
      }
    }
  }

  console.log(`Found ${assetsToCreate.length} items to seed.`);

  if (assetsToCreate.length > 0) {
    await prisma.soilWaterTestingProject.createMany({
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
