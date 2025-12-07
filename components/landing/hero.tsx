"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" as const },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export function Hero() {
  return (
    <section className="relative gradient-agriculture text-primary-foreground py-20 md:py-32 overflow-hidden">
      {/* Decorative emojis */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl">🌾</div>
        <div className="absolute top-20 right-20 text-5xl">🌿</div>
        <div className="absolute bottom-20 left-1/4 text-4xl">🌾</div>
        <div className="absolute bottom-32 right-1/3 text-5xl">🌿</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >



          {/* Main Heading */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 leading-tight"
          >
            Regional Agriculture Forum
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-xl sm:text-2xl lg:text-3xl mb-8 opacity-90"
          >
            South Punjab
          </motion.p>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg lg:text-xl mb-10 max-w-2xl mx-auto leading-relaxed opacity-90"
          >
            Comprehensive agricultural research facilities, equipment inventories, and resources across departments and institutes in South Punjab, Pakistan
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button
              size="lg"
              asChild
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-6 text-lg"
            >
              <Link href="#departments">
                View Departments
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

          </motion.div>
        </motion.div>
      </div>

      {/* Wave SVG Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}
