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
  const departmentId = "ento";
  const departmentName = "Entomological Research Sub Station";

  console.log(`Seeding ${departmentName}...`);

  // 1. Create or Update Department
  const department = await prisma.department.upsert({
    where: { id: departmentId },
    update: {
      name: departmentName,
      location: "Multan, Punjab",
      description: "Advanced research on insect pests, beneficial insects, and integrated pest management strategies for sustainable agriculture.",
      focalPerson: "Dr. Asifa Hameed",
      designation: "Principal Scientist",
      phone: "+92-61-9210075",
      email: "asifa_hameed_sheikh@yahoo.com",
    },
    create: {
      id: departmentId,
      name: departmentName,
      location: "Multan, Punjab",
      description: "Advanced research on insect pests, beneficial insects, and integrated pest management strategies for sustainable agriculture.",
      focalPerson: "Dr. Asifa Hameed",
      designation: "Principal Scientist",
      phone: "+92-61-9210075",
      email: "asifa_hameed_sheikh@yahoo.com",
    },
  });

  console.log("Department upserted:", department.name);

  // 2. Clear existing data for this department
  await prisma.eRSSStockRegister.deleteMany({
    where: { departmentId: department.id },
  });
  console.log("Cleared existing ERSSStockRegister data.");

  // 3. Parse and Insert Data
  const dataFilePath = path.join(process.cwd(), "lib", "data", "ento.txt");
  const fileContent = fs.readFileSync(dataFilePath, "utf-8");
  const lines = fileContent.split("\n");

  const itemsToCreate = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#") || trimmedLine.startsWith("LIST OF")) {
      continue;
    }

    // Split by tab
    const parts = trimmedLine.split(/\t+/);

    if (parts.length < 2) {
        continue;
    }

    // Adjust index based on columns
    // 0: # (Index)
    // 1: Name
    // 2: Page #
    // 3: Qty
    // 4: Date received
    // 5: Last verification

    const name = parts[1]?.trim();
    if (!name) continue;

    const pageNoStr = parts[2]?.trim();
    const qtyStr = parts[3]?.trim();
    const dateReceivedStr = parts[4]?.trim();
    const lastVerificationStr = parts[5]?.trim();

    const pageNo = parseInt(pageNoStr) || null;

    let dateReceived: Date | null = null;
    if (dateReceivedStr) {
      const dateParts = dateReceivedStr.split(".");
      if (dateParts.length === 3) {
        // dd.mm.yyyy
        const day = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed
        const year = parseInt(dateParts[2]);
        const date = new Date(year, month, day);
        if (!isNaN(date.getTime())) {
          dateReceived = date;
        }
      }
    }

    itemsToCreate.push({
      departmentId: department.id,
      name: name,
      type: "Non-Consumable Item", // Default type
      registerPageNo: pageNo,
      quantityStr: qtyStr,
      dateReceived: dateReceived,
      lastVerificationDate: lastVerificationStr,
      currentStatusRemarks: "Available", // Default
    });
  }

  if (itemsToCreate.length > 0) {
    console.log(`Inserting ${itemsToCreate.length} items...`);
    await prisma.eRSSStockRegister.createMany({
      data: itemsToCreate,
    });
    console.log(`Seeded ${itemsToCreate.length} items for ${departmentName}.`);
  } else {
    console.log("No items found to seed.");
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
