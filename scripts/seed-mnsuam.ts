import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const departmentId = "mnsuam";
  const departmentName = "MNS University of Agriculture";

  console.log(`Seeding ${departmentName} data...`);

  const department = await prisma.department.upsert({
    where: { id: departmentId },
    update: {
      name: departmentName,
      location: "Old Shujabad Road, Multan",
      description:
        "Vibrant agricultural university providing research-driven facilities, modern labs, and collaborative spaces for South Punjab Regional Agriculture Forum.",
      focalPerson: "Dr. Mahmood Alam",
      designation: "Directorate of University Farms",
      phone: "+92-61-9210071",
      email: "mahmood.alam@mnsuam.edu.pk",
    },
    create: {
      id: departmentId,
      name: departmentName,
      location: "Old Shujabad Road, Multan",
      description:
        "Vibrant agricultural university providing research-driven facilities, modern labs, and collaborative spaces for South Punjab Regional Agriculture Forum.",
      focalPerson: "Dr. Mahmood Alam",
      designation: "Directorate of University Farms",
      phone: "+92-61-9210071",
      email: "mahmood.alam@mnsuam.edu.pk",
    },
  });

  console.log("Department upserted:", department.name);

  await prisma.mNSUAMEstateFacilities.deleteMany({
    where: { departmentId: department.id },
  });
  await prisma.agronomyLabEquipment.deleteMany({
    where: { departmentId: department.id },
  });
  console.log("Cleared existing estate facilities and agronomy equipment.");

  const facilityData = [
    {
      blockName: "Admin Block",
      name: "Syndicate Hall",
      facilityType: "Meeting Hall",
      capacityPersons: 50,
      type: "Facility",
      imageUrl: "🏛️",
    },
    {
      blockName: "Admin Block",
      name: "Committee Room",
      facilityType: "Meeting Room",
      capacityPersons: 20,
      type: "Facility",
      imageUrl: "🧭",
    },
    {
      blockName: "Academic Block",
      name: "Lecture Hall 110",
      facilityType: "Lecture Hall",
      capacityPersons: 150,
      type: "Facility",
      imageUrl: "🎓",
    },
    {
      blockName: "Academic Block",
      name: "Lecture Hall 132",
      facilityType: "Lecture Hall",
      capacityPersons: 96,
      type: "Facility",
      imageUrl: "📚",
    },
    {
      blockName: "Academic Block",
      name: "Computer Labs",
      facilityType: "Laboratory",
      capacityPersons: 5,
      type: "Facility",
      imageUrl: "💻",
    },
    {
      blockName: "S.T.I. Library",
      name: "Training Hall",
      facilityType: "Training Hall",
      capacityPersons: 80,
      type: "Facility",
      imageUrl: "📖",
    },
    {
      blockName: "Genome Centre / UNESCO Chair",
      name: "Meeting Room",
      facilityType: "Meeting Room",
      capacityPersons: 15,
      type: "Facility",
      imageUrl: "🧬",
    },
    {
      blockName: "Graduate Block / A Block",
      name: "Sybrid Hall",
      facilityType: "Training Hall",
      capacityPersons: 30,
      type: "Facility",
      imageUrl: "🏫",
    },
    {
      blockName: "Graduate Block / A Block",
      name: "Executive Hall-I",
      facilityType: "Meeting Hall",
      capacityPersons: 35,
      type: "Facility",
      imageUrl: "👥",
    },
    {
      blockName: "Graduate Block / A Block",
      name: "Lecture Hall",
      facilityType: "Lecture Hall",
      capacityPersons: 35,
      type: "Facility",
      imageUrl: "🎤",
    },
    {
      blockName: "Graduate Block / A Block",
      name: "ORIC Meeting Hall",
      facilityType: "Meeting Hall",
      capacityPersons: 30,
      type: "Facility",
      imageUrl: "🤝",
    },
    {
      blockName: "Graduate Block / A Block",
      name: "QEC Meeting Hall",
      facilityType: "Meeting Hall",
      capacityPersons: 12,
      type: "Facility",
      imageUrl: "🧭",
    },
  ];

  await prisma.mNSUAMEstateFacilities.createMany({
    data: facilityData.map((facility) => ({
      ...facility,
      departmentId: department.id,
    })),
  });
  console.log(`Inserted ${facilityData.length} estate facilities.`);

  const agronomyEquipment = [
    { name: "Analytical Balance", quantity: 1, type: "Balance" },
    { name: "Digital Balance", quantity: 3, type: "Balance" },
    { name: "Top Loading Balance", quantity: 2, type: "Balance" },
    { name: "Leaf Area Meter", quantity: 1, type: "Measurement" },
    { name: "Flame Photometer", quantity: 1, type: "Analyzer" },
    { name: "SPAD", quantity: 1, type: "Measurement" },
    { name: "pH Meter", quantity: 1, type: "Analyzer" },
    { name: "EC Meter", quantity: 1, type: "Analyzer" },
    { name: "Autoclave", quantity: 1, type: "Sterilization" },
    { name: "Cooling Incubator", quantity: 1, type: "Incubation" },
    { name: "Oven", quantity: 2, type: "Processing" },
    { name: "Trinocular Microscope", quantity: 1, type: "Microscopy" },
    { name: "Hot Plate & Magnetic Stirrer", quantity: 2, type: "Processing" },
    { name: "Moisture Meter", quantity: 1, type: "Measurement" },
    { name: "Water Distillation Unit", quantity: 1, type: "Water Systems" },
    { name: "Water Bath", quantity: 1, type: "Processing" },
    { name: "Mini Centrifuge Machine", quantity: 1, type: "Separation" },
    { name: "Spectrophotometer", quantity: 1, type: "Analyzer" },
    { name: "Seed Grinder", quantity: 1, type: "Processing" },
    { name: "Kjeldahl Apparatus", quantity: 1, type: "Analyzer" },
    { name: "Digital Vernier Caliper", quantity: 1, type: "Measurement" },
    { name: "Aquarium Pump", quantity: 2, type: "Support Equipment" },
  ];

  await prisma.agronomyLabEquipment.createMany({
    data: agronomyEquipment.map((item) => ({
      departmentId: department.id,
      name: item.name,
      type: item.type,
      quantity: item.quantity,
      focalPerson1: "Dr. Nabeel Ahmad Ikram",
    })),
  });
  console.log(`Inserted ${agronomyEquipment.length} agronomy equipment items.`);

  console.log("Seeding completed for MNSUAM.");
}

main()
  .catch((error) => {
    console.error("Error seeding MNSUAM data:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
