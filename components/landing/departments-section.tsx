"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Users, Building2, ArrowRight } from "lucide-react";

const allDepartments = [
  {
    id: "mnsuam",
    name: "Muhammad Nawaz Shareef University of Agriculture",
    location: "Multan, Punjab",
    description:
      "Leading agricultural university with state-of-the-art laboratories, research facilities, and comprehensive equipment for agricultural education and research.",
    image: "/images/mnsuam_cover.jpg",
    hasData: true,
    focalPerson: "Dr. Muhammad Asif",
    designation: "Director",
    phone: "+92-61-9210071",
    email: "info@mnsuam.edu.pk",
  },
  {
    id: "amri",
    name: "Agricultural Mechanization Research Institute",
    location: "Multan, Punjab",
    description:
      "Research and development in farm machinery, mechanization technologies, and agricultural engineering for modern farming solutions.",
    image: "/images/amri.jpg.jpeg",
    hasData: true,
    focalPerson: "Dr. Khalid Mahmood",
    designation: "Director",
    phone: "+92-61-9210072",
    email: "khalid.mahmood@amri.gov.pk",
  },
  {
    id: "rari",
    name: "Regional Agricultural Research Institute",
    location: "Bahawalpur, Punjab",
    description:
      "Comprehensive agricultural research focusing on crop improvement, plant protection, and sustainable farming practices for the region.",
    image: "/images/rai.jpg.jpg",
    hasData: true,
    focalPerson: "Dr. Asif Ali",
    designation: "Research Officer",
    phone: "+92-61-9210073",
    email: "asif.ali@rari.gov.pk",
  },
  {
    id: "flori",
    name: "Floriculture Research Institute",
    location: "Multan, Punjab",
    description:
      "Specialized research in ornamental plants, landscaping, floriculture production techniques, and horticultural development.",
    image: "/images/flori.jpg.jpg",
    hasData: true,
    focalPerson: "Dr. Muhammad Muzamil Ijaz",
    designation: "Assistant Research Officer",
    phone: "03016984364",
    email: "muzamil.ijaz243@gmail.com",
  },
  {
    id: "soil-water",
    name: "Soil & Water Testing Laboratory",
    location: "Multan, Punjab",
    description:
      "Comprehensive soil and water analysis services providing critical data for agricultural research and farmer support across the region.",
    image: "/images/soil.png.jpg",
    hasData: true,
    focalPerson: "Ms. Fatima Bibi",
    designation: "Principal Scientist",
    phone: "061-4423568",
    email: "swt_mltn@yahoo.com",
  },
  {
    id: "ento",
    name: "Entomological Research Sub Station",
    location: "Multan, Punjab",
    description:
      "Advanced research on insect pests, beneficial insects, and integrated pest management strategies for sustainable agriculture.",
    image: "/images/ent.jpg.jpg",
    hasData: true,
    focalPerson: "Dr. Asifa Hameed",
    designation: "Principal Scientist",
    phone: "+92-61-9210075",
    email: "asifa_hameed_sheikh@yahoo.com",
  },
  {
    id: "mri",
    name: "Mango Research Institute",
    location: "Multan, Punjab",
    description:
      "Dedicated research facility for mango cultivation, variety development, post-harvest technologies, and quality improvement.",
    image: "/images/mango.jpg.jpg",
    hasData: true,
    focalPerson: "Mr. Abid Hameed Khan",
    designation: "Scientific Officer- Entomology",
    phone: "0300-6326987",
    email: "abidhameedkhan@yahoo.com",
  },
  {
    id: "ext",
    name: "Agriculture Extension Wing",
    location: "Multan, Punjab",
    description:
      "Providing agricultural extension services, farmer training, and technology transfer to enhance farming practices across the region.",
    image: "/images/agri_ext.jpg.jpg",
    hasData: true,
    focalPerson: "Dr. Ahmad Hassan",
    designation: "Director Extension",
    phone: "+92-61-9210076",
    email: "ahmad.hassan@ext.gov.pk",
  },
  {
    id: "cotton-institute",
    name: "Cotton Research Institute",
    location: "Multan, Punjab",
    description:
      "Leading research in cotton cultivation, variety development, pest management, and fiber quality improvement for the cotton industry.",
    image: "/images/cotton.jpg.png",
    hasData: true,
    focalPerson: "Dr. Rashid Ali Hassan",
    designation: "Director",
    phone: "+92-61-9210077",
    email: "rashid.ali@cri.gov.pk",
  },
  {
    id: "pest",
    name: "Pesticide Quality Control Laboratory",
    location: "Multan, Punjab",
    description:
      "Quality control and testing of pesticides, ensuring safety standards and regulatory compliance for agricultural chemicals.",
    image: "/images/lab.jpg",
    hasData: true,
    focalPerson: "Dr. Muhammad Asif",
    designation: "Chief Scientist",
    phone: "+92-61-9210078",
    email: "asif@pesticidelab.gov.pk",
  },
  {
    id: "raedc",
    name: "Regional Agricultural Economic Development Centre",
    location: "Multan, Punjab",
    description:
      "Economic research, development planning, and capacity building for agricultural sector growth and farmer prosperity.",
    image: "/images/raedc.jpg.jpg",
    hasData: true,
    focalPerson: "Dr. Zahid Hussain",
    designation: "Director",
    phone: "+92-61-9210085",
    email: "zahid@raedc.gov.pk",
  },
  {
    id: "agri-eng",
    name: "Agriculture Engineering Field Wing",
    location: "Multan, Punjab",
    description:
      "Comprehensive agricultural engineering services including farm machinery, infrastructure development, and technical support across multiple divisions.",
    image: "/images/agri.jpg.png",
    hasData: true,
    focalPerson: "Engr. Muhammad Akram",
    designation: "Director Agricultural Engineering",
    phone: "+92-61-9210086",
    email: "akram@agrieng.gov.pk",
  },
  {
    id: "arc",
    name: "Adaptive Research Center",
    location: "Govt. Agri. Station Multan",
    description:
      "Monthly vacancy position for the Office of Assistant Director Agriculture (Farm), covering sanctioned, filled, and vacant posts.",
    image: "/images/adp.jpg.jpg",
    hasData: true,
    focalPerson: "Office of Assistant Director Agriculture (Farm)",
    designation: "Govt. Agri. Station Multan",
    phone: "",
    email: "",
  },
];

const departments = allDepartments;

export function DepartmentsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const headerVariants = {
    hidden: {
      opacity: 0,
      y: 10,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section
      id="departments"
      className="py-20 bg-muted/30 relative overflow-hidden"
      ref={ref}
    >
      {/* Static background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary rounded-full blur-3xl"></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={headerVariants} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Departments & Research Institutes
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore our diverse departments and research institutes dedicated
              to advancing agricultural science and technology across South Punjab.
            </p>
          </motion.div>

          {/* Departments Grid */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 prevent-layout-shift"
          >
            {departments.map((department, index) => (
              <Link
                key={department.id}
                href={`/departments/${department.id}`}
                className="block"
              >
                <motion.div
                  variants={itemVariants}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.3, ease: "easeOut" as const },
                  }}
                  className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 will-change-transform cursor-pointer"
                >
                  {/* Full Card Image Background */}
                  <div className="relative h-80 md:h-96">
                    {department.image ? (
                      <>
                        <Image
                          src={department.image}
                          alt={department.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        {/* Gradient Overlay - stronger at bottom */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300"></div>
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-0 gradient-agriculture"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Building2 className="w-20 h-20 text-white/40" />
                        </div>
                      </>
                    )}

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      {/* Department Name */}
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-lg group-hover:text-secondary transition-colors duration-300">
                        {department.name}
                      </h3>

                      {/* View Details Button */}
                      {/* <Link
                        href={`/departments/${department.id}`}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105 transform"
                      >
                        Explore Department
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link> */}
                    </div>

                    {/* Decorative Corner Badge */}
                    <div className="absolute top-4 right-4 bg-secondary/90 backdrop-blur-sm text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      View Data
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
