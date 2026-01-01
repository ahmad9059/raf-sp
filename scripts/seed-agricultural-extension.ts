import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const departmentId = "agri-ext";
const departmentName = "Agricultural Extension Wing";

async function main() {
  let department;
  try {
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

    // First, ensure the department exists
    department = await prisma.department.upsert({
      where: { id: departmentId },
      update: {
        name: departmentName,
        location: "Multan",
        description:
          "Agricultural Extension Wing - Provincial Agriculture Department office providing extension services",
        focalPerson: "Deputy Director Agriculture (Ext)",
        phone: "+92-XXX-XXXXXXX",
        email: "ext@agripunjab.gov.pk",
      },
      create: {
        id: departmentId,
        name: departmentName,
        location: "Multan",
        description:
          "Agricultural Extension Wing - Provincial Agriculture Department office providing extension services",
        focalPerson: "Deputy Director Agriculture (Ext)",
        phone: "+92-XXX-XXXXXXX",
        email: "ext@agripunjab.gov.pk",
      },
    });
    console.log("Agricultural Extension Wing department ready");

    // Delete existing equipment for fresh seeding
    await prisma.agriculturalExtensionWing.deleteMany({
      where: { departmentId: department.id },
    });

    // Agricultural Extension Wing Offices - from agrExt.txt
    const extensionOffices = [
      {
        name: "Office of the Deputy Director Agriculture (Ext)",
        type: "Administrative Office",
        location: "Old Shujabad Road Agriculture Complex, Multan",
        areaSquareFeet: 288585,
        remarks: "Agriculture Department (Ext) Wing",
        status: "Utilized",
        functionality: "Operational",
      },
      {
        name: "SAO / EADA",
        type: "Administrative Office",
        location: "Dera Adda, Behind Telephone Exchange, Multan",
        areaSquareFeet: 13056,
        remarks: "Dismantled from Building Department",
        status: "Un used",
        functionality: "Operational",
      },
      {
        name: "Office of the Assistant Director Agriculture (Ext)",
        type: "Administrative Office",
        location: "Old Multan Road, Near Boys High School, Shujabad",
        areaSquareFeet: 89100,
        remarks: "Agriculture Department",
        status: "Utilized",
        functionality: "Operational",
      },
      {
        name: "Office of the Assistant Director Agriculture (Ext)",
        type: "Administrative Office",
        location: "Shujabad Road, Near Virtual University, Jalalpur Pirwala",
        areaSquareFeet: null,
        remarks: "Temporarily adjusted in Health Department Building",
        status: "Utilized",
        functionality: "Operational",
      },
    ];

    // Insert all offices
    for (const office of extensionOffices) {
      await prisma.agriculturalExtensionWing.create({
        data: {
          ...office,
          departmentId: department.id,
          equipmentStatus: "AVAILABLE",
        },
      });
    }

    console.log(
      `Inserted ${extensionOffices.length} Agricultural Extension Wing office records`
    );
    console.log("Agricultural Extension Wing data seeded successfully");
  } catch (error) {
    console.error("Error seeding Agricultural Extension Wing data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
