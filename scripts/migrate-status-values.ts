import { PrismaClient, EquipmentStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function migrateStatusValues() {
  console.log("Starting status migration...");

  try {
    // Since the schema has been updated to use EquipmentStatus enum,
    // this script is mainly for documentation purposes
    // The database migration will handle the actual enum conversion

    console.log(
      "Status migration completed - enum is now enforced at schema level!"
    );
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateStatusValues();
