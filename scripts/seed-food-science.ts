import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const departmentId = "food-science";
const departmentName = "Food Science and Technology";

// Food Science & Technology equipment data
const equipmentData = [
  // Value Addition and Food Analysis Lab - Room # 127 Academic Block
  { name: "Kjeldhal Apparatus Digestion unit and Distillation unit", type: "Analytical Equipment", labSectionName: "Value Addition and Food Analysis Lab", roomNumber: "127", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Water Activity meter", type: "Analytical Equipment", labSectionName: "Value Addition and Food Analysis Lab", roomNumber: "127", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Soxhlet Apparatus", type: "Analytical Equipment", labSectionName: "Value Addition and Food Analysis Lab", roomNumber: "127", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Analytical Weighing Balance", type: "Analytical Equipment", labSectionName: "Value Addition and Food Analysis Lab", roomNumber: "127", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Autoclave", type: "Sterilization Equipment", labSectionName: "Value Addition and Food Analysis Lab", roomNumber: "127", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Texture Analyzer", type: "Testing Equipment", labSectionName: "Value Addition and Food Analysis Lab", roomNumber: "127", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Freeze Dryer", type: "Processing Equipment", labSectionName: "Value Addition and Food Analysis Lab", roomNumber: "127", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Pulse Electric Field", type: "Processing Equipment", labSectionName: "Value Addition and Food Analysis Lab", roomNumber: "127", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Ozonation chamber", type: "Processing Equipment", labSectionName: "Value Addition and Food Analysis Lab", roomNumber: "127", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Pasteurizer", type: "Processing Equipment", labSectionName: "Value Addition and Food Analysis Lab", roomNumber: "127", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Fermenter", type: "Processing Equipment", labSectionName: "Value Addition and Food Analysis Lab", roomNumber: "127", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  // Nutrient Analytical & Food Processing Lab - Room # 114-115 Postgraduate Block
  { name: "Kjeldhal Apparatus", type: "Analytical Equipment", labSectionName: "Nutrient Analytical & Food Processing Lab", roomNumber: "114-115", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Digestion unit and Distillation unit", type: "Analytical Equipment", labSectionName: "Nutrient Analytical & Food Processing Lab", roomNumber: "114-115", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Moisture Analyzer", type: "Analytical Equipment", labSectionName: "Nutrient Analytical & Food Processing Lab", roomNumber: "114-115", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Soxhlet Apparatus", type: "Analytical Equipment", labSectionName: "Nutrient Analytical & Food Processing Lab", roomNumber: "114-115", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Analytical Weighing Balance", type: "Analytical Equipment", labSectionName: "Nutrient Analytical & Food Processing Lab", roomNumber: "114-115", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Muffle Furnace", type: "Heating Equipment", labSectionName: "Nutrient Analytical & Food Processing Lab", roomNumber: "114-115", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Viscometer", type: "Testing Equipment", labSectionName: "Nutrient Analytical & Food Processing Lab", roomNumber: "114-115", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Farinograph", type: "Testing Equipment", labSectionName: "Nutrient Analytical & Food Processing Lab", roomNumber: "114-115", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Fume Hood", type: "Safety Equipment", labSectionName: "Nutrient Analytical & Food Processing Lab", roomNumber: "114-115", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Desiccator", type: "Storage Equipment", labSectionName: "Nutrient Analytical & Food Processing Lab", roomNumber: "114-115", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Gerber machine", type: "Testing Equipment", labSectionName: "Nutrient Analytical & Food Processing Lab", roomNumber: "114-115", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Rose head machine", type: "Processing Equipment", labSectionName: "Nutrient Analytical & Food Processing Lab", roomNumber: "114-115", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Abrasive peeler", type: "Processing Equipment", labSectionName: "Nutrient Analytical & Food Processing Lab", roomNumber: "114-115", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Refrigerator", type: "Storage Equipment", labSectionName: "Nutrient Analytical & Food Processing Lab", roomNumber: "114-115", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "China Chakki", type: "Processing Equipment", labSectionName: "Nutrient Analytical & Food Processing Lab", roomNumber: "114-115", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Grinder", type: "Processing Equipment", labSectionName: "Nutrient Analytical & Food Processing Lab", roomNumber: "114-115", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Cheese press", type: "Processing Equipment", labSectionName: "Nutrient Analytical & Food Processing Lab", roomNumber: "114-115", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Cheese vat", type: "Processing Equipment", labSectionName: "Nutrient Analytical & Food Processing Lab", roomNumber: "114-115", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Cream separator", type: "Processing Equipment", labSectionName: "Nutrient Analytical & Food Processing Lab", roomNumber: "114-115", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Butter churner", type: "Processing Equipment", labSectionName: "Nutrient Analytical & Food Processing Lab", roomNumber: "114-115", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Flaker", type: "Processing Equipment", labSectionName: "Nutrient Analytical & Food Processing Lab", roomNumber: "114-115", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Dough Mixer", type: "Processing Equipment", labSectionName: "Nutrient Analytical & Food Processing Lab", roomNumber: "114-115", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Dough Shitter", type: "Processing Equipment", labSectionName: "Nutrient Analytical & Food Processing Lab", roomNumber: "114-115", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
  { name: "Ice cream machine", type: "Processing Equipment", labSectionName: "Nutrient Analytical & Food Processing Lab", roomNumber: "114-115", quantity: 1, focalPerson: "Dr. Shabbir Ahmad" },
];

async function main() {
  console.log(`Seeding ${departmentName}...`);

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

  // Create or Update Department
  const department = await prisma.department.upsert({
    where: { id: departmentId },
    update: {
      name: departmentName,
      location: "MNS University of Agriculture, Multan",
      description: "Focuses on the science of food, from production to consumption, including food safety, nutrition, and processing technologies.",
      focalPerson: "Dr. Shabbir Ahmad",
      designation: "Professor & Head",
      phone: "+92-61-9210071",
      email: "shabbir.ahmad@mnsuam.edu.pk",
    },
    create: {
      id: departmentId,
      name: departmentName,
      location: "MNS University of Agriculture, Multan",
      description: "Focuses on the science of food, from production to consumption, including food safety, nutrition, and processing technologies.",
      focalPerson: "Dr. Shabbir Ahmad",
      designation: "Professor & Head",
      phone: "+92-61-9210071",
      email: "shabbir.ahmad@mnsuam.edu.pk",
    },
  });

  console.log(`✅ ${departmentName} department ready (ID: ${department.id})`);

  // Clear existing equipment for this department
  await prisma.foodAnalysisLabEquipment.deleteMany({
    where: { departmentId: department.id },
  });
  console.log("Cleared existing Food Science equipment data");

  // Insert new equipment data
  for (const equipment of equipmentData) {
    await prisma.foodAnalysisLabEquipment.create({
      data: {
        ...equipment,
        status: "AVAILABLE",
        departmentId: department.id,
      },
    });
  }

  console.log(`✅ Successfully added ${equipmentData.length} equipment items to ${departmentName}`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
