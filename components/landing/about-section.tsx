"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, BarChart3, Users, Wrench } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure & Compliant",
    description:
      "Government-grade security with role-based access control ensuring data protection and compliance.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description:
      "Visualize equipment status, maintenance costs, and inventory distribution with interactive dashboards.",
  },
  {
    icon: Users,
    title: "Multi-Department",
    description:
      "Manage multiple departments with isolated data access and centralized administrative oversight.",
  },
  {
    icon: Wrench,
    title: "Maintenance Tracking",
    description:
      "Track repair history, maintenance costs, and equipment lifecycle for informed decision-making.",
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
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="about" className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              About RAF-SP Platform
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The Repair & Facility Smart Platform is a comprehensive digital
              solution designed to modernize asset management for government
              agriculture departments across the nation.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-8 mb-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex gap-4 p-6 rounded-lg border border-gray-200 hover:border-brand/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-brand" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mission Statement */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-brand/5 to-brand/10 rounded-2xl p-8 md:p-12 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Our Mission
            </h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              To empower government agriculture departments with modern digital
              tools that streamline equipment management, reduce operational
              costs, and improve service delivery to farmers and communities
              across the nation.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <span className="px-4 py-2 bg-white rounded-full">
                🌾 Agriculture Focus
              </span>
              <span className="px-4 py-2 bg-white rounded-full">
                🏛️ Government Standard
              </span>
              <span className="px-4 py-2 bg-white rounded-full">
                📊 Data-Driven
              </span>
              <span className="px-4 py-2 bg-white rounded-full">🔒 Secure</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
