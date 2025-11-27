import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const departments = [
  {
    name: "Food Science and Technology",
    location: "MNS University of Agriculture, Multan",
    description:
      "Focuses on the science of food, from production to consumption, including food safety, nutrition, and processing technologies.",
    focalPerson: "Dr. Shabbir Ahmad",
    designation: "Professor & Head",
    phone: "+92-61-9210071",
    email: "shabbir.ahmad@mnsuam.edu.pk",
  },
  {
    name: "Agronomy Department",
    location: "MNS University of Agriculture, Multan",
    description:
      "Specializes in crop production, soil management, and sustainable farming practices for improved agricultural productivity.",
    focalPerson: "Dr. Mahmood Alam",
    designation: "Professor",
    phone: "+92-61-9210072",
    email: "mahmood.alam@mnsuam.edu.pk",
  },
  {
    name: "Floriculture Research Sub-station",
    location: "MNS University of Agriculture, Multan",
    description:
      "Research and development in ornamental plants, landscaping, and floriculture production techniques.",
    focalPerson: "Dr. Asif Ali",
    designation: "Research Officer",
    phone: "+92-61-9210073",
    email: "asif.ali@mnsuam.edu.pk",
  },
  {
    name: "Soil & Water Testing Laboratory",
    location: "MNS University of Agriculture, Multan",
    description:
      "Comprehensive soil and water analysis services for agricultural research and farmer support.",
    focalPerson: "Dr. Muhammad Tariq",
    designation: "Lab Director",
    phone: "+92-61-9210074",
    email: "tariq@mnsuam.edu.pk",
  },
  {
    name: "Entomology Research Sub-Station",
    location: "MNS University of Agriculture, Multan",
    description:
      "Research on insect pests, beneficial insects, and integrated pest management strategies.",
    focalPerson: "Dr. Sohail Ahmad",
    designation: "Senior Entomologist",
    phone: "+92-61-9210075",
    email: "sohail.ahmad@mnsuam.edu.pk",
  },
  {
    name: "Mango Research Institute",
    location: "Multan, Punjab",
    description:
      "Dedicated research facility for mango cultivation, varieties development, and post-harvest technologies.",
    focalPerson: "Dr. Muhammad Tauseef",
    designation: "Senior Scientist (Agronomy)",
    phone: "+923340072357",
    email: "tauseef@mri.gov.pk",
  },
  {
    name: "Agricultural Mechanization Research Institute",
    location: "Multan, Punjab",
    description:
      "Research and development in farm machinery, mechanization technologies, and agricultural engineering.",
    focalPerson: "Dr. Khalid Mahmood",
    designation: "Director",
    phone: "+92-61-9210076",
    email: "khalid.mahmood@amri.gov.pk",
  },
  {
    name: "MNSUAM Estate & Facilities",
    location: "MNS University of Agriculture, Multan",
    description:
      "Management of university infrastructure, facilities, and estate operations.",
    focalPerson: "Engr. Ahmad Hassan",
    designation: "Estate Manager",
    phone: "+92-61-9210077",
    email: "ahmad.hassan@mnsuam.edu.pk",
  },
  {
    name: "Horticulture",
    location: "MNS University of Agriculture, Multan",
    description:
      "Research and education in fruit and vegetable production, post-harvest handling, and horticultural sciences.",
    focalPerson: "Dr. Rashid Ali",
    designation: "Professor",
    phone: "+92-61-9210078",
    email: "rashid.ali@mnsuam.edu.pk",
  },
  {
    name: "Plant Breeding and Genetics",
    location: "MNS University of Agriculture, Multan",
    description:
      "Development of improved crop varieties through conventional and modern breeding techniques.",
    focalPerson: "Dr. Saeed Ahmad",
    designation: "Professor & Head",
    phone: "+92-61-9210079",
    email: "saeed.ahmad@mnsuam.edu.pk",
  },
  {
    name: "Plant Pathology",
    location: "MNS University of Agriculture, Multan",
    description:
      "Research on plant diseases, disease management, and development of resistant varieties.",
    focalPerson: "Dr. Iftikhar Ahmad",
    designation: "Professor",
    phone: "+92-61-9210080",
    email: "iftikhar.ahmad@mnsuam.edu.pk",
  },
  {
    name: "Forestry and Range Management",
    location: "MNS University of Agriculture, Multan",
    description:
      "Forest conservation, range management, and sustainable natural resource utilization.",
    focalPerson: "Dr. Muhammad Akram",
    designation: "Professor",
    phone: "+92-61-9210081",
    email: "akram@mnsuam.edu.pk",
  },
  {
    name: "Animal Science",
    location: "MNS University of Agriculture, Multan",
    description:
      "Livestock production, animal nutrition, breeding, and veterinary sciences.",
    focalPerson: "Dr. Zulfiqar Ali",
    designation: "Professor & Head",
    phone: "+92-61-9210082",
    email: "zulfiqar.ali@mnsuam.edu.pk",
  },
  {
    name: "Biotechnology",
    location: "MNS University of Agriculture, Multan",
    description:
      "Modern biotechnological approaches for crop improvement and agricultural innovation.",
    focalPerson: "Dr. Farah Naz",
    designation: "Associate Professor",
    phone: "+92-61-9210083",
    email: "farah.naz@mnsuam.edu.pk",
  },
  {
    name: "Water Management",
    location: "MNS University of Agriculture, Multan",
    description:
      "Irrigation systems, water conservation, and efficient water use in agriculture.",
    focalPerson: "Dr. Ghulam Murtaza",
    designation: "Professor",
    phone: "+92-61-9210084",
    email: "ghulam.murtaza@mnsuam.edu.pk",
  },
];

async function main() {
  console.log("Seeding departments...");

  for (const dept of departments) {
    const existingDept = await prisma.department.findUnique({
      where: { name: dept.name },
    });

    if (!existingDept) {
      await prisma.department.create({
        data: dept,
      });
      console.log(`Created department: ${dept.name}`);
    } else {
      await prisma.department.update({
        where: { name: dept.name },
        data: dept,
      });
      console.log(`Updated department: ${dept.name}`);
    }
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
