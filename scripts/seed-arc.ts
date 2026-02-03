import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const departmentId = "arc";
  const departmentName = "Adaptive Research Center";

  console.log(`Seeding ${departmentName}...`);

  // Ensure we don't end up with duplicate departments when names change
  const existingByName = await prisma.department.findUnique({
    where: { name: departmentName },
  });

  if (existingByName && existingByName.id !== departmentId) {
    console.log(`Existing ${departmentName} found with id ${existingByName.id}, replacing with stable id '${departmentId}'`);
    await prisma.department.delete({ where: { id: existingByName.id } });
  }

  // Clean up legacy station naming if it exists
  const legacyStation = await prisma.department.findFirst({
    where: {
      name: {
        contains: "Adaptive Research Station",
        mode: "insensitive",
      },
    },
  });

  if (legacyStation && legacyStation.id !== departmentId) {
    console.log(`Removing legacy Adaptive Research Station entry with id ${legacyStation.id}`);
    await prisma.department.delete({ where: { id: legacyStation.id } });
  }

  const department = await prisma.department.upsert({
    where: { id: departmentId },
    update: {
      name: departmentName,
      location: "Govt. Agri. Station Multan",
      description: "Monthly vacancy position for the Office of Assistant Director Agriculture (Farm) at the Adaptive Research Center.",
      focalPerson: "Office of Assistant Director Agriculture (Farm)",
      designation: "Govt. Agri. Station Multan",
      phone: "",
      email: "",
      logo: "/images/adp.jpg.jpg",
    },
    create: {
      id: departmentId,
      name: departmentName,
      location: "Govt. Agri. Station Multan",
      description: "Monthly vacancy position for the Office of Assistant Director Agriculture (Farm) at the Adaptive Research Center.",
      focalPerson: "Office of Assistant Director Agriculture (Farm)",
      designation: "Govt. Agri. Station Multan",
      phone: "",
      email: "",
      logo: "/images/adp.jpg.jpg",
    },
  });

  console.log(`Department ready with id ${department.id}`);

  // Clear previous data
  await prisma.adaptiveResearchPosition.deleteMany({
    where: { departmentId: department.id },
  });

  const attachedDepartment = "DA (F.T & AR) Vehari / Assistant Director Agriculture (Farm) Govt. Agri. Station Multan";

  const positions = [
    {
      orderNumber: 1,
      postName: "Assistant Director (Farm)",
      bpsScale: "BPS-18",
      sanctionedPosts: 1,
      filledPosts: 1,
      vacantPosts: 0,
      promotionPosts: 0,
      initialRecruitmentPosts: 0,
    },
    {
      orderNumber: 2,
      postName: "Farm Manager / AO",
      bpsScale: "BPS-17",
      sanctionedPosts: 1,
      filledPosts: 1,
      vacantPosts: 0,
      promotionPosts: 0,
      initialRecruitmentPosts: 0,
    },
    {
      orderNumber: 3,
      postName: "Senior Clerk",
      bpsScale: "BPS-14",
      sanctionedPosts: 1,
      filledPosts: 1,
      vacantPosts: 0,
      promotionPosts: 0,
      initialRecruitmentPosts: 0,
    },
    {
      orderNumber: 4,
      postName: "Field Investigator",
      bpsScale: "BPS-14",
      sanctionedPosts: 1,
      filledPosts: 1,
      vacantPosts: 0,
      promotionPosts: 0,
      initialRecruitmentPosts: 0,
    },
    {
      orderNumber: 5,
      postName: "Senior Field Assistant",
      bpsScale: "BPS-12",
      sanctionedPosts: 2,
      filledPosts: 0,
      vacantPosts: 2,
      promotionPosts: 2,
      initialRecruitmentPosts: 0,
    },
    {
      orderNumber: 6,
      postName: "Field Assistant",
      bpsScale: "BPS-11",
      sanctionedPosts: 3,
      filledPosts: 2,
      vacantPosts: 1,
      promotionPosts: 0,
      initialRecruitmentPosts: 1,
    },
    {
      orderNumber: 7,
      postName: "Junior Clerk",
      bpsScale: "BPS-11",
      sanctionedPosts: 1,
      filledPosts: 0,
      vacantPosts: 1,
      promotionPosts: 0,
      initialRecruitmentPosts: 1,
    },
    {
      orderNumber: 8,
      postName: "Tractor Driver",
      bpsScale: "BPS-06",
      sanctionedPosts: 1,
      filledPosts: 1,
      vacantPosts: 0,
      promotionPosts: 0,
      initialRecruitmentPosts: 0,
    },
    {
      orderNumber: 9,
      postName: "Carpenter",
      bpsScale: "BPS-01",
      sanctionedPosts: 1,
      filledPosts: 0,
      vacantPosts: 1,
      promotionPosts: 0,
      initialRecruitmentPosts: 1,
    },
    {
      orderNumber: 10,
      postName: "Tube Well Operator",
      bpsScale: "BPS-07",
      sanctionedPosts: 2,
      filledPosts: 1,
      vacantPosts: 1,
      promotionPosts: 0,
      initialRecruitmentPosts: 1,
      remarks: "One vacant post is on LPR",
    },
    {
      orderNumber: 11,
      postName: "Greaser",
      bpsScale: "BPS-01",
      sanctionedPosts: 1,
      filledPosts: 0,
      vacantPosts: 1,
      promotionPosts: 0,
      initialRecruitmentPosts: 1,
    },
    {
      orderNumber: 12,
      postName: "Naib Qasid",
      bpsScale: "BPS-02",
      sanctionedPosts: 1,
      filledPosts: 1,
      vacantPosts: 0,
      promotionPosts: 0,
      initialRecruitmentPosts: 0,
    },
    {
      orderNumber: 13,
      postName: "Chowkidar",
      bpsScale: "BPS-03 & 05",
      sanctionedPosts: 2,
      filledPosts: 1,
      vacantPosts: 1,
      promotionPosts: 0,
      initialRecruitmentPosts: 1,
    },
    {
      orderNumber: 14,
      postName: "Field Man",
      bpsScale: "BPS-03",
      sanctionedPosts: 1,
      filledPosts: 0,
      vacantPosts: 1,
      promotionPosts: 0,
      initialRecruitmentPosts: 1,
    },
    {
      orderNumber: 15,
      postName: "Water Man",
      bpsScale: "BPS-01",
      sanctionedPosts: 1,
      filledPosts: 0,
      vacantPosts: 1,
      promotionPosts: 0,
      initialRecruitmentPosts: 1,
    },
    {
      orderNumber: 16,
      postName: "Tractor Cleaner",
      bpsScale: "BPS-01",
      sanctionedPosts: 1,
      filledPosts: 0,
      vacantPosts: 1,
      promotionPosts: 0,
      initialRecruitmentPosts: 1,
    },
    {
      orderNumber: 17,
      postName: "Beldar",
      bpsScale: "BPS-01",
      sanctionedPosts: 22,
      filledPosts: 14,
      vacantPosts: 8,
      promotionPosts: 0,
      initialRecruitmentPosts: 8,
    },
    {
      orderNumber: 18,
      postName: "Mali",
      bpsScale: "BPS-01",
      sanctionedPosts: 1,
      filledPosts: 0,
      vacantPosts: 1,
      promotionPosts: 0,
      initialRecruitmentPosts: 1,
    },
  ];

  await prisma.adaptiveResearchPosition.createMany({
    data: positions.map((position) => ({
      ...position,
      attachedDepartment,
      departmentId: department.id,
    })),
  });

  const totals = positions.reduce(
    (acc, pos) => {
      acc.sanctioned += pos.sanctionedPosts;
      acc.filled += pos.filledPosts;
      acc.vacant += pos.vacantPosts;
      acc.promotion += pos.promotionPosts;
      acc.initial += pos.initialRecruitmentPosts;
      return acc;
    },
    { sanctioned: 0, filled: 0, vacant: 0, promotion: 0, initial: 0 }
  );

  console.log(
    `Seeded ${positions.length} positions (Sanctioned: ${totals.sanctioned}, Filled: ${totals.filled}, Vacant: ${totals.vacant}, Promotion: ${totals.promotion}, Initial: ${totals.initial})`
  );
}

main()
  .catch((error) => {
    console.error("Seeding failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
