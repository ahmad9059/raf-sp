import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { AboutSection } from "@/components/landing/about-section";
import { DepartmentsSection } from "@/components/landing/departments-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <AboutSection />
      <DepartmentsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
