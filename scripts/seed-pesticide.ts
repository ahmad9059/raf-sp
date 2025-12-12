import { PrismaClient, EquipmentStatus } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const departmentId = "pest";
  const departmentName = "Pesticide Quality Control Laboratory";

  console.log(`Seeding ${departmentName}...`);

  const existingByName = await prisma.department.findUnique({
    where: { name: departmentName },
  });

  if (existingByName && existingByName.id !== departmentId) {
    console.log(
      `Removing existing department with id ${existingByName.id} to align id -> ${departmentId}`
    );
    await prisma.department.delete({ where: { id: existingByName.id } });
  }

  const department = await prisma.department.upsert({
    where: { id: departmentId },
    update: {
      name: departmentName,
      location: "Multan, Punjab",
      description:
        "Quality control and testing of pesticides, ensuring safety standards and regulatory compliance for agricultural chemicals.",
      focalPerson: "Dr Subhan Danish",
      designation: "Senior Scientist",
      phone: "0304-7996951",
      email: "sd96850@gmail.com",
    },
    create: {
      id: departmentId,
      name: departmentName,
      location: "Multan, Punjab",
      description:
        "Quality control and testing of pesticides, ensuring safety standards and regulatory compliance for agricultural chemicals.",
      focalPerson: "Dr Subhan Danish",
      designation: "Senior Scientist",
      phone: "0304-7996951",
      email: "sd96850@gmail.com",
    },
  });

  console.log("Department ready:", department.id);

  await prisma.pesticideQCLabData.deleteMany({
    where: { departmentId: department.id },
  });
  console.log("Cleared previous pesticide QC lab data.");

  const buildingDetails = [
    "Chief Scientist Office",
    "Establishment Office",
    "ISO Cell",
    "General Laboratory",
    "HPLC Lab-1",
    "HPLC Lab-2",
    "GC Laboratory",
    "Sample Processing Room",
    "Chemical Laboratory",
    "Balance Room",
    "Sample Store Room",
    "Sample Receiving Room",
  ];

  const labInstruments = [
    { name: "HPLC", qty: 3 },
    { name: "GC", qty: 2 },
    { name: "Analytical Balance", qty: 1 },
    { name: "Spectrophotometer", qty: 2 },
    { name: "EC Meter", qty: 1 },
    { name: "Thermo Hygrometer", qty: 4 },
    { name: "pH Meter", qty: 1 },
  ];

  const humanResources = [
    { name: "Chief Scientist", bps: 20, sanctioned: 1, filled: 1, vacant: 0 },
    { name: "Principal Scientist", bps: 19, sanctioned: 1, filled: 0, vacant: 1 },
    { name: "Senior Scientist", bps: 18, sanctioned: 2, filled: 2, vacant: 0 },
    { name: "Scientific Officer", bps: 17, sanctioned: 2, filled: 0, vacant: 2 },
    { name: "Stenographer", bps: 16, sanctioned: 1, filled: 0, vacant: 1 },
    { name: "Research Assistant", bps: 15, sanctioned: 2, filled: 0, vacant: 2 },
    { name: "Senior Clerk", bps: 14, sanctioned: 1, filled: 1, vacant: 0 },
    { name: "Junior Clerk", bps: 11, sanctioned: 1, filled: 1, vacant: 0 },
    { name: "Instrument Technician", bps: 11, sanctioned: 1, filled: 0, vacant: 1 },
    { name: "Lab Technician", bps: 11, sanctioned: 1, filled: 0, vacant: 1 },
    { name: "Lab Assistant", bps: 6, sanctioned: 4, filled: 0, vacant: 4 },
    { name: "Driver", bps: 4, sanctioned: 1, filled: 1, vacant: 0 },
    { name: "Lab Attendant", bps: 1, sanctioned: 1, filled: 1, vacant: 0 },
    { name: "Naib Qasid", bps: 1, sanctioned: 1, filled: 1, vacant: 0 },
    { name: "Chowkidar", bps: 1, sanctioned: 2, filled: 2, vacant: 0 },
    { name: "Sweeper", bps: 1, sanctioned: 1, filled: 1, vacant: 0 },
  ];

  await prisma.pesticideQCLabData.createMany({
    data: [
      ...buildingDetails.map((name) => ({
        departmentId: department.id,
        name,
        type: "Building",
        status: EquipmentStatus.AVAILABLE,
        sectionCategory: "Facility",
        quantityOrSanctioned: 1,
        imageUrl: "🏢",
      })),
      ...labInstruments.map((instrument) => ({
        departmentId: department.id,
        name: instrument.name,
        type: "Lab Equipment",
        status: EquipmentStatus.AVAILABLE,
        quantityOrSanctioned: instrument.qty,
        sectionCategory: "Instrument",
        imageUrl: "🧪",
      })),
      ...humanResources.flatMap((hr) => [
        {
          departmentId: department.id,
          name: hr.name,
          type: "Human Resource",
          status: EquipmentStatus.AVAILABLE,
          quantityOrSanctioned: hr.sanctioned,
          bpsScale: hr.bps,
          sectionCategory: "Sanctioned",
          imageUrl: "📋",
        },
        {
          departmentId: department.id,
          name: hr.name,
          type: "Human Resource",
          status: EquipmentStatus.AVAILABLE,
          quantityOrSanctioned: hr.filled,
          bpsScale: hr.bps,
          sectionCategory: "Filled",
          imageUrl: "✅",
        },
        {
          departmentId: department.id,
          name: hr.name,
          type: "Human Resource",
          status: EquipmentStatus.AVAILABLE,
          quantityOrSanctioned: hr.vacant,
          bpsScale: hr.bps,
          sectionCategory: "Vacant",
          imageUrl: "⚪",
        },
      ]),
    ],
  });

  console.log("Seeded pesticide QC lab buildings, instruments, and HR records.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
