"use client";

import { motion, useInView, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Building2, FlaskConical, Users, Tractor, BarChart3, Database } from "lucide-react";

const stats = [
  {
    icon: Building2,
    value: 18,
    suffix: "+",
    label: "Departments",
    color: "text-primary",
  },
  {
    icon: FlaskConical,
    value: 1000,
    suffix: "+",
    label: "Equipment Items",
    color: "text-secondary",
  },
  {
    icon: Users,
    value: 500,
    suffix: "+",
    label: "Staff Members",
    color: "text-primary",
  },
  {
    icon: Tractor,
    value: 200,
    suffix: "+",
    label: "Farm Machinery",
    color: "text-secondary",
  },
  {
    icon: Database,
    value: 24,
    suffix: "/7",
    label: "Access",
    color: "text-primary",
  },
];

const partners = [
  { src: "/icons/logo1.png", alt: "Partner 1" },
  { src: "/icons/logo2.png.png", alt: "Partner 2" },
  { src: "/icons/logo3.png", alt: "Partner 3" },
  { src: "/icons/logo4.png", alt: "Partner 4" },
  { src: "/icons/logo5.png", alt: "Partner 5" },
  { src: "/icons/logo6.png", alt: "Partner 6" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView && ref.current) {
      const controls = animate(0, value, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate(current) {
          if (ref.current) {
            ref.current.textContent = Math.round(current).toString();
          }
        },
      });
      return () => controls.stop();
    }
  }, [isInView, value]);

  return (
    <span className="flex items-center">
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
}

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [hasTrackedVisit, setHasTrackedVisit] = useState(false);

  useEffect(() => {
    // Track visitor and get count on mount
    const trackVisitor = async () => {
      if (!hasTrackedVisit) {
        try {
          const response = await fetch("/api/visitor-count", {
            method: "POST",
          });
          const data = await response.json();
          if (data.success) {
            setVisitorCount(data.count);
            setHasTrackedVisit(true);
          }
        } catch (error) {
          console.error("Failed to track visitor:", error);
          // Fallback: just get the count
          try {
            const response = await fetch("/api/visitor-count");
            const data = await response.json();
            if (data.success) {
              setVisitorCount(data.count);
            }
          } catch (error) {
            console.error("Failed to get visitor count:", error);
          }
        }
      }
    };

    trackVisitor();
  }, [hasTrackedVisit]);

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
        ease: "easeOut",
      },
    },
  };

  // Add visitor count to stats dynamically
  const allStats = [
    ...stats, // All existing stats
    {
      icon: BarChart3,
      value: visitorCount,
      suffix: "+",
      label: "Site Visits",
      color: "text-secondary",
    },
  ];

  return (
    <section id="about" className="py-20 bg-muted/30" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Empowering Agriculture Through Data
            </h2>
            <p className="text-lg text-muted-foreground">
              We bridge the gap between research and application by providing a centralized platform for agricultural resources, equipment tracking, and departmental collaboration across South Punjab.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-20"
          >
            {allStats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-card hover:shadow-lg transition-shadow duration-300 rounded-xl p-6 text-center border border-border/50 group"
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/5 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Partner Logos Section - Infinite Marquee */}
          <motion.div
            variants={itemVariants}
            className="relative w-full overflow-hidden py-10"
          >
            <div className="text-center mb-10">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Strategic Partners
              </h3>
              <p className="text-sm text-muted-foreground">
                Collaborating with leading institutions to drive agricultural innovation
              </p>
            </div>

            {/* Gradient Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 z-10 bg-gradient-to-r from-muted/30 to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 z-10 bg-gradient-to-l from-muted/30 to-transparent pointer-events-none" />

            {/* Marquee Container */}
            <div className="flex flex-col gap-16">
              {/* Row 1: Left Scroll */}
              <div className="flex overflow-hidden group">
                <motion.div
                  className="flex gap-12 md:gap-24 min-w-full shrink-0 items-center justify-around"
                  animate={{ x: [0, -1000] }}
                  transition={{
                    x: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 30,
                      ease: "linear",
                    },
                  }}
                >
                  {[...partners, ...partners, ...partners].map((partner, index) => (
                    <div
                      key={`row1-${index}`}
                      className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center transition-transform duration-500 cursor-pointer hover:scale-105"
                    >
                      <Image
                        src={partner.src}
                        alt={partner.alt}
                        fill
                        className="object-contain drop-shadow-sm"
                        sizes="(max-width: 768px) 96px, 128px"
                      />
                    </div>
                  ))}
                </motion.div>
                <motion.div
                  className="flex gap-12 md:gap-24 min-w-full shrink-0 items-center justify-around"
                  animate={{ x: [0, -1000] }}
                  transition={{
                    x: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 30,
                      ease: "linear",
                    },
                  }}
                >
                  {[...partners, ...partners, ...partners].map((partner, index) => (
                    <div
                      key={`row1-dup-${index}`}
                      className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center transition-transform duration-500 cursor-pointer hover:scale-105"
                    >
                      <Image
                        src={partner.src}
                        alt={partner.alt}
                        fill
                        className="object-contain drop-shadow-sm"
                        sizes="(max-width: 768px) 96px, 128px"
                      />
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Row 2: Right Scroll (Reverse) */}
              <div className="flex overflow-hidden group">
                <motion.div
                  className="flex gap-12 md:gap-24 min-w-full shrink-0 items-center justify-around"
                  animate={{ x: [-1000, 0] }}
                  transition={{
                    x: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 35,
                      ease: "linear",
                    },
                  }}
                >
                  {[...partners, ...partners, ...partners].reverse().map((partner, index) => (
                    <div
                      key={`row2-${index}`}
                      className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center transition-transform duration-500 cursor-pointer hover:scale-105"
                    >
                      <Image
                        src={partner.src}
                        alt={partner.alt}
                        fill
                        className="object-contain drop-shadow-sm"
                        sizes="(max-width: 768px) 96px, 128px"
                      />
                    </div>
                  ))}
                </motion.div>
                <motion.div
                  className="flex gap-12 md:gap-24 min-w-full shrink-0 items-center justify-around"
                  animate={{ x: [-1000, 0] }}
                  transition={{
                    x: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 35,
                      ease: "linear",
                    },
                  }}
                >
                  {[...partners, ...partners, ...partners].reverse().map((partner, index) => (
                    <div
                      key={`row2-dup-${index}`}
                      className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center transition-transform duration-500 cursor-pointer hover:scale-105"
                    >
                      <Image
                        src={partner.src}
                        alt={partner.alt}
                        fill
                        className="object-contain drop-shadow-sm"
                        sizes="(max-width: 768px) 96px, 128px"
                      />
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
