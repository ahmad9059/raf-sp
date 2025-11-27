"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { MapPin, Users, Eye, Building2 } from "lucide-react";

const departments = [
  {
    id: "food-science-technology",
    name: "Food Science and Technology",
    location: "MNS University of Agriculture, Multan",
    description:
      "Focuses on the science of food, from production to consumption, including food safety, nutrition, and processing technologies.",
    image: "/images/departments/food-science.jpg",
    hasData: true,
    focalPerson: "Dr. Shabbir Ahmad",
    designation: "Professor & Head",
    phone: "+92-61-9210071",
    email: "shabbir.ahmad@mnsuam.edu.pk",
  },
  {
    id: "agronomy",
    name: "Agronomy Department",
    location: "MNS University of Agriculture, Multan",
    description:
      "Specializes in crop production, soil management, and sustainable farming practices for improved agricultural productivity.",
    image: "/images/departments/agronomy.jpg",
    hasData: true,
    focalPerson: "Dr. Mahmood Alam",
    designation: "Professor",
    phone: "+92-61-9210072",
    email: "mahmood.alam@mnsuam.edu.pk",
  },
  {
    id: "floriculture-research",
    name: "Floriculture Research Sub-station",
    location: "MNS University of Agriculture, Multan",
    description:
      "Research and development in ornamental plants, landscaping, and floriculture production techniques.",
    image: "/images/departments/floriculture.jpg",
    hasData: true,
    focalPerson: "Dr. Asif Ali",
    designation: "Research Officer",
    phone: "+92-61-9210073",
    email: "asif.ali@mnsuam.edu.pk",
  },
  {
    id: "soil-water-testing",
    name: "Soil & Water Testing Laboratory",
    location: "MNS University of Agriculture, Multan",
    description:
      "Comprehensive soil and water analysis services for agricultural research and farmer support.",
    image: "/images/departments/soil-water.jpg",
    hasData: true,
    focalPerson: "Dr. Muhammad Tariq",
    designation: "Lab Director",
    phone: "+92-61-9210074",
    email: "tariq@mnsuam.edu.pk",
  },
  {
    id: "entomology-research",
    name: "Entomology Research Sub-Station",
    location: "MNS University of Agriculture, Multan",
    description:
      "Research on insect pests, beneficial insects, and integrated pest management strategies.",
    image: "/images/departments/entomology.jpg",
    hasData: true,
    focalPerson: "Dr. Sohail Ahmad",
    designation: "Senior Entomologist",
    phone: "+92-61-9210075",
    email: "sohail.ahmad@mnsuam.edu.pk",
  },
  {
    id: "mango-research",
    name: "Mango Research Institute",
    location: "Multan, Punjab",
    description:
      "Dedicated research facility for mango cultivation, varieties development, and post-harvest technologies.",
    image: "/images/departments/mango.jpg",
    hasData: true,
    focalPerson: "Dr. Muhammad Tauseef",
    designation: "Senior Scientist (Agronomy)",
    phone: "+923340072357",
    email: "tauseef@mri.gov.pk",
  },
  {
    id: "agricultural-mechanization",
    name: "Agricultural Mechanization Research Institute",
    location: "Multan, Punjab",
    description:
      "Research and development in farm machinery, mechanization technologies, and agricultural engineering.",
    image: "/images/departments/mechanization.jpg",
    hasData: true,
    focalPerson: "Dr. Khalid Mahmood",
    designation: "Director",
    phone: "+92-61-9210076",
    email: "khalid.mahmood@amri.gov.pk",
  },
  {
    id: "mnsuam-estate",
    name: "MNSUAM Estate & Facilities",
    location: "MNS University of Agriculture, Multan",
    description:
      "Management of university infrastructure, facilities, and estate operations.",
    image: "/images/departments/estate.jpg",
    hasData: true,
    focalPerson: "Engr. Ahmad Hassan",
    designation: "Estate Manager",
    phone: "+92-61-9210077",
    email: "ahmad.hassan@mnsuam.edu.pk",
  },
  {
    id: "horticulture",
    name: "Horticulture",
    location: "MNS University of Agriculture, Multan",
    description:
      "Research and education in fruit and vegetable production, post-harvest handling, and horticultural sciences.",
    image: "/images/departments/horticulture.jpg",
    hasData: false,
    focalPerson: "Dr. Rashid Ali",
    designation: "Professor",
    phone: "+92-61-9210078",
    email: "rashid.ali@mnsuam.edu.pk",
  },
  {
    id: "plant-breeding",
    name: "Plant Breeding and Genetics",
    location: "MNS University of Agriculture, Multan",
    description:
      "Development of improved crop varieties through conventional and modern breeding techniques.",
    image: "/images/departments/plant-breeding.jpg",
    hasData: false,
    focalPerson: "Dr. Saeed Ahmad",
    designation: "Professor & Head",
    phone: "+92-61-9210079",
    email: "saeed.ahmad@mnsuam.edu.pk",
  },
  {
    id: "plant-pathology",
    name: "Plant Pathology",
    location: "MNS University of Agriculture, Multan",
    description:
      "Research on plant diseases, disease management, and development of resistant varieties.",
    image: "/images/departments/plant-pathology.jpg",
    hasData: false,
    focalPerson: "Dr. Iftikhar Ahmad",
    designation: "Professor",
    phone: "+92-61-9210080",
    email: "iftikhar.ahmad@mnsuam.edu.pk",
  },
  {
    id: "forestry-range",
    name: "Forestry and Range Management",
    location: "MNS University of Agriculture, Multan",
    description:
      "Forest conservation, range management, and sustainable natural resource utilization.",
    image: "/images/departments/forestry.jpg",
    hasData: false,
    focalPerson: "Dr. Muhammad Akram",
    designation: "Professor",
    phone: "+92-61-9210081",
    email: "akram@mnsuam.edu.pk",
  },
  {
    id: "animal-science",
    name: "Animal Science",
    location: "MNS University of Agriculture, Multan",
    description:
      "Livestock production, animal nutrition, breeding, and veterinary sciences.",
    image: "/images/departments/animal-science.jpg",
    hasData: false,
    focalPerson: "Dr. Zulfiqar Ali",
    designation: "Professor & Head",
    phone: "+92-61-9210082",
    email: "zulfiqar.ali@mnsuam.edu.pk",
  },
  {
    id: "biotechnology",
    name: "Biotechnology",
    location: "MNS University of Agriculture, Multan",
    description:
      "Modern biotechnological approaches for crop improvement and agricultural innovation.",
    image: "/images/departments/biotechnology.jpg",
    hasData: false,
    focalPerson: "Dr. Farah Naz",
    designation: "Associate Professor",
    phone: "+92-61-9210083",
    email: "farah.naz@mnsuam.edu.pk",
  },
  {
    id: "water-management",
    name: "Water Management",
    location: "MNS University of Agriculture, Multan",
    description:
      "Irrigation systems, water conservation, and efficient water use in agriculture.",
    image: "/images/departments/water-management.jpg",
    hasData: false,
    focalPerson: "Dr. Ghulam Murtaza",
    designation: "Professor",
    phone: "+92-61-9210084",
    email: "ghulam.murtaza@mnsuam.edu.pk",
  },
];

export function DepartmentsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <section
      id="departments"
      className="py-20 bg-gradient-to-br from-gray-50 to-white"
      ref={ref}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Departments
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our diverse departments and research institutes dedicated
              to advancing agricultural science and technology.
            </p>
          </motion.div>

          {/* Departments Grid */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {departments.map((department) => (
              <motion.div
                key={department.id}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group"
              >
                {/* Department Image */}
                <div className="relative h-48 bg-gradient-to-br from-[#2678E7] to-[#1e5bb8] overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  {/* Placeholder for department-specific imagery */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Building2 className="w-16 h-16 text-white/30" />
                  </div>
                  <div className="absolute top-4 right-4">
                    {department.hasData ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Eye className="w-3 h-3" />
                        Data Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                      {department.name}
                    </h3>
                  </div>
                </div>

                {/* Department Content */}
                <div className="p-6">
                  <div className="flex items-start gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {department.location}
                    </p>
                  </div>

                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {department.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{department.focalPerson}</span>
                    </div>

                    {department.hasData ? (
                      <Link
                        href={`/department/${department.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#2678E7] text-white text-sm font-medium rounded-lg hover:bg-[#1e5bb8] transition-colors duration-200"
                      >
                        View Details
                        <Eye className="w-4 h-4" />
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 text-sm font-medium rounded-lg cursor-not-allowed"
                      >
                        Coming Soon
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
