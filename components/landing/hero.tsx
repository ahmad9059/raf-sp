"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-brand/5 via-white to-brand/10 pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center px-4 py-2 rounded-full bg-brand/10 text-brand text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 bg-brand rounded-full mr-2 animate-pulse"></span>
            Ministry of Agriculture - Digital Initiative
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Repair & Facility
            <span className="block text-brand mt-2">Smart Platform</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            A comprehensive asset management system for government agriculture
            departments. Track equipment, manage maintenance, and visualize
            inventory data with role-based dashboards.
          </motion.p>

          {/* University Branding */}
          <motion.div
            variants={fadeInUp}
            className="mb-10 text-sm text-gray-500"
          >
            <p className="font-medium">
              Developed in collaboration with MNSUAM University
            </p>
            <p className="text-xs mt-1">
              Modernizing Agriculture Asset Management
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              asChild
              className="bg-brand hover:bg-brand/90 text-white px-8 py-6 text-lg"
            >
              <Link href="/signup">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-brand text-brand hover:bg-brand/5 px-8 py-6 text-lg"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-brand">100+</div>
              <div className="text-sm text-gray-600 mt-1">Departments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand">5000+</div>
              <div className="text-sm text-gray-600 mt-1">
                Equipment Tracked
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand">99.9%</div>
              <div className="text-sm text-gray-600 mt-1">Uptime</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
