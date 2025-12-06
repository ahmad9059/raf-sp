"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Database, Sparkles } from "lucide-react";

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="py-16 bg-background" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          <div className="gradient-agriculture text-primary-foreground rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Database className="w-12 h-12 opacity-90" />
                <Sparkles className="w-10 h-10 opacity-90" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Explore Agricultural Data?
              </h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
                Access comprehensive information about departments, equipment inventories, 
                and research facilities across South Punjab's agricultural sector.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  asChild
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  <Link href="#departments">
                    View All Departments
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link href="/dashboard">Access Platform</Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
