"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Building2, FlaskConical, Users, Tractor, BarChart3, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const stats = [
  {
    icon: Building2,
    value: "18+",
    label: "Departments",
    color: "text-primary",
  },
  {
    icon: FlaskConical,
    value: "1000+",
    label: "Equipment Items",
    color: "text-secondary",
  },
  {
    icon: Users,
    value: "500+",
    label: "Staff Members",
    color: "text-primary",
  },
  {
    icon: Tractor,
    value: "200+",
    label: "Farm Machinery",
    color: "text-secondary",
  },
  {
    icon: BarChart3,
    value: "100%",
    label: "Data Coverage",
    color: "text-primary",
  },
  {
    icon: Database,
    value: "Real-time",
    label: "Updates",
    color: "text-secondary",
  },
];

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
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
    <section id="about" className="py-16 bg-background" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              About AgriData Hub
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A comprehensive digital platform showcasing agricultural research facilities, 
              equipment inventories, and resources across departments and institutes in South Punjab, Pakistan.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="stat-card text-center"
              >
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Feature Section */}
          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-2 gap-8 items-center mb-12"
          >
            <div className="relative h-64 md:h-96 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/images/mns.png.jpg"
                alt="Agricultural Research"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Comprehensive Agricultural Data
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Access detailed information about research facilities, laboratory equipment, 
                farm machinery, and human resources across multiple departments and institutes 
                in the Agriculture Complex Multan.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <FlaskConical className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground">Equipment Inventory</div>
                    <div className="text-sm text-muted-foreground">Detailed lab equipment lists</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground">Facilities Overview</div>
                    <div className="text-sm text-muted-foreground">Labs, halls, and resources</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground">Staff Directory</div>
                    <div className="text-sm text-muted-foreground">Human resources data</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Tractor className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground">Farm Machinery</div>
                    <div className="text-sm text-muted-foreground">Agricultural equipment</div>
                  </div>
                </div>
              </div>
              <Button asChild size="lg">
                <Link href="#departments">
                  Explore Departments
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Partner Logos Section */}
          <motion.div
            variants={itemVariants}
            className="mt-12"
          >
            <h3 className="text-center text-xl font-bold text-foreground mb-2">
              Made Possible By
            </h3>
            <p className="text-center text-sm text-muted-foreground mb-8">
              In collaboration with our valued partners and supporting organizations
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              <div className="relative w-24 h-24 md:w-28 md:h-28 hover:scale-110 transition-transform duration-300">
                <Image
                  src="/icons/logo.png.png"
                  alt="Partner Organization"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative w-24 h-24 md:w-28 md:h-28 hover:scale-110 transition-transform duration-300">
                <Image
                  src="/icons/logo2.png.png"
                  alt="Partner Organization"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative w-24 h-24 md:w-28 md:h-28 hover:scale-110 transition-transform duration-300">
                <Image
                  src="/icons/logo3.png.jpg"
                  alt="Partner Organization"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative w-24 h-24 md:w-28 md:h-28 hover:scale-110 transition-transform duration-300">
                <Image
                  src="/icons/logo4.jpg.jpeg"
                  alt="Partner Organization"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative w-24 h-24 md:w-28 md:h-28 hover:scale-110 transition-transform duration-300">
                <Image
                  src="/icons/logo5.jpg.jpg"
                  alt="Partner Organization"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative w-24 h-24 md:w-28 md:h-28 hover:scale-110 transition-transform duration-300">
                <Image
                  src="/icons/logo6.png"
                  alt="Partner Organization"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
