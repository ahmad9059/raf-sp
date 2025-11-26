import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { AboutSection } from "@/components/landing/about-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <AboutSection />
      <FeaturesSection />
      <Footer />
    </main>
  );
}
