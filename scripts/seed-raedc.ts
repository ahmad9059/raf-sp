import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const departmentId = "raedc";
const departmentName = "RAEDC";

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
        location: "Vehari",
        description:
          "Regional Agricultural Economic Development Centre (RAEDC), Vehari - Specialized training and capacity-building institution",
        focalPerson: "Director, RAEDC",
        phone: "+92-XXX-XXXXXXX",
        email: "raedc@agripunjab.gov.pk",
      },
      create: {
        id: departmentId,
        name: departmentName,
        location: "Vehari",
        description:
          "Regional Agricultural Economic Development Centre (RAEDC), Vehari - Specialized training and capacity-building institution",
        focalPerson: "Director, RAEDC",
        phone: "+92-XXX-XXXXXXX",
        email: "raedc@agripunjab.gov.pk",
      },
    });
    console.log("RAEDC department ready");

    // Delete existing equipment for fresh seeding
    await prisma.rAEDCEquipment.deleteMany({
      where: { departmentId: department.id },
    });

    // RAEDC Facilities - EXACTLY as per raedc.md
    const raedcEquipment = [
      {
        name: "Training halls equipped with multimedia",
        type: "Training Facility",
        facilityType: "Training Halls",
        capacity: null,
        location: "RAEDC Vehari",
        functionality: "Operational",
        imageUrl: null,
      },
      {
        name: "Computer lab with capacity for 30–35 participants",
        type: "Laboratory",
        facilityType: "Computer Lab",
        capacity: 35,
        location: "RAEDC Vehari",
        functionality: "Operational",
        imageUrl: null,
      },
      {
        name: "Library with agriculture and training resources",
        type: "Library",
        facilityType: "Library",
        capacity: null,
        location: "RAEDC Vehari",
        functionality: "Operational",
        imageUrl: null,
      },
      {
        name: "Auditorium accommodating approximately 300 participants",
        type: "Auditorium",
        facilityType: "Auditorium",
        capacity: 300,
        location: "RAEDC Vehari",
        functionality: "Operational",
        imageUrl: null,
      },
      {
        name: "Demonstration farm used for hands-on training and technology demonstrations",
        type: "Farm Facility",
        facilityType: "Demonstration Farm",
        capacity: null,
        location: "RAEDC Vehari",
        functionality: "Operational",
        imageUrl: null,
      },
    ];

    // Insert all equipment
    for (const equipment of raedcEquipment) {
      await prisma.rAEDCEquipment.create({
        data: {
          ...equipment,
          departmentId: department.id,
          status: "AVAILABLE",
        },
      });
    }

    console.log(
      `Inserted ${raedcEquipment.length} RAEDC equipment/facility records`
    );
    console.log("RAEDC data seeded successfully");
  } catch (error) {
    console.error("Error seeding RAEDC data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
