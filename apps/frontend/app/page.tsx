'use client'

import Navbar from "./components/landing/navbar";
import HeroSection from "./components/landing/hero";
import DemoSection from "./components/landing/demo-section";
import FeaturesSection, { IntegrationSection } from "./components/landing/features";
import Footer from "./components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans selection:bg-blue-500/30">
      <Navbar />
      <HeroSection />
      <DemoSection />
      <FeaturesSection />
      <IntegrationSection />
      <Footer />
    </main>
  );
}