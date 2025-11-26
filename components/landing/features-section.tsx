"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Package,
  FileText,
  TrendingUp,
  Lock,
  Upload,
  Bell,
} from "lucide-react";

const features = [
  {
    icon: Package,
    title: "Equipment Inventory",
    description:
      "Comprehensive tracking of all agriculture equipment with detailed information, images, and status updates.",
  },
  {
    icon: FileText,
    title: "Maintenance Logs",
    description:
      "Record and track all maintenance activities, repair costs, and equipment history for informed decisions.",
  },
  {
    icon: TrendingUp,
    title: "Analytics Dashboard",
    description:
      "Visualize equipment distribution, status, and trends with interactive charts and real-time data.",
  },
  {
    icon: Lock,
    title: "Role-Based Access",
    description:
      "Secure access control with admin and department head roles ensuring data privacy and proper authorization.",
  },
  {
    icon: Upload,
    title: "Bulk Import",
    description:
      "Import multiple equipment records at once using CSV or PDF files for efficient data entry.",
  },
  {
    icon: Bell,
    title: "Real-Time Updates",
    description:
      "Get instant notifications and updates on equipment status changes and maintenance schedules.",
  },
];

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <section
      id="features"
      className="py-20 bg-gradient-to-br from-gray-50 to-white"
      ref={ref}
    >
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
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage agriculture equipment efficiently
              and effectively.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
              >
                <div className="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-brand" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
