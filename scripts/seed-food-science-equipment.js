const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Food Science & Technology equipment data...");

  // First, find the Food Science and Technology department
  const foodScienceDept = await prisma.department.findUnique({
    where: { name: "Food Science and Technology" },
  });

  if (!foodScienceDept) {
    console.error(
      "Food Science and Technology department not found. Please run seed-departments.js first."
    );
    return;
  }

  console.log(
    `Found department: ${foodScienceDept.name} (ID: ${foodScienceDept.id})`
  );

  // Food Science & Technology equipment data
  const equipmentData = [
    // Value Addition and Food Analysis Lab - Room # 127 Academic Block
    {
      name: "Kjeldhal Apparatus Digestion unit and Distillation unit",
      type: "Analytical Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Value Addition and Food Analysis Lab",
      roomNumber: "127",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
    {
      name: "Water Activity meter",
      type: "Analytical Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Value Addition and Food Analysis Lab",
      roomNumber: "127",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
    {
      name: "Soxhlet Apparatus",
      type: "Analytical Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Value Addition and Food Analysis Lab",
      roomNumber: "127",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
    {
      name: "Analytical Weighing Balance",
      type: "Analytical Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Value Addition and Food Analysis Lab",
      roomNumber: "127",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
    {
      name: "Autoclave",
      type: "Sterilization Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Value Addition and Food Analysis Lab",
      roomNumber: "127",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
    {
      name: "Texture Analyzer",
      type: "Testing Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Value Addition and Food Analysis Lab",
      roomNumber: "127",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
    {
      name: "Freeze Dryer",
      type: "Processing Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Value Addition and Food Analysis Lab",
      roomNumber: "127",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
    {
      name: "Pulse Electric Field",
      type: "Processing Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Value Addition and Food Analysis Lab",
      roomNumber: "127",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
    {
      name: "Ozonation chamber",
      type: "Processing Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Value Addition and Food Analysis Lab",
      roomNumber: "127",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
    {
      name: "Pasteurizer",
      type: "Processing Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Value Addition and Food Analysis Lab",
      roomNumber: "127",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
    {
      name: "Fermenter",
      type: "Processing Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Value Addition and Food Analysis Lab",
      roomNumber: "127",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
    // Nutrient Analytical & Food Processing Lab - Room # 114-115 Postgraduate Block
    {
      name: "Kjeldhal Apparatus",
      type: "Analytical Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
    {
      name: "Digestion unit and Distillation unit",
      type: "Analytical Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
    {
      name: "Moisture Analyzer",
      type: "Analytical Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
    {
      name: "Soxhlet Apparatus",
      type: "Analytical Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
    {
      name: "Analytical Weighing Balance",
      type: "Analytical Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
    {
      name: "Muffle Furnace",
      type: "Heating Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
    {
      name: "Viscometer",
      type: "Testing Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
    {
      name: "Farinograph",
      type: "Testing Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
    {
      name: "Fume Hood",
      type: "Safety Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
    {
      name: "Desiccator",
      type: "Storage Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
    {
      name: "Gerber machine",
      type: "Testing Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
    {
      name: "Rose head machine",
      type: "Processing Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
    {
      name: "Abrasive peeler",
      type: "Processing Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
    {
      name: "Refrigerator",
      type: "Storage Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
    {
      name: "China Chakki",
      type: "Processing Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
    {
      name: "Grinder",
      type: "Processing Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
    {
      name: "Cheese press",
      type: "Processing Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
    {
      name: "Cheese vat",
      type: "Processing Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
    {
      name: "Cream separator",
      type: "Processing Equipment",
      status: "AVAILABLE",
      imageUrl: null,
      departmentId: foodScienceDept.id,
      labSectionName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
    },
  ];

  // Clear existing equipment for this department
  await prisma.foodAnalysisLabEquipment.deleteMany({
    where: { departmentId: foodScienceDept.id },
  });

  console.log("Cleared existing Food Science equipment data");

  // Insert new equipment data
  for (const equipment of equipmentData) {
    await prisma.foodAnalysisLabEquipment.create({
      data: equipment,
    });
    console.log(`Added: ${equipment.name}`);
  }

  console.log(
    `Successfully added ${equipmentData.length} equipment items to Food Science & Technology department`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
