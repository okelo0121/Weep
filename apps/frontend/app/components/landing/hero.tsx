import React from 'react';
import Link from 'next/link';
import { Button } from '../../ui/Button'; // Assuming we have a shadcn-like button
import { ArrowRight, PlayCircle } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-background pt-32 pb-16 md:pt-48 md:pb-32">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-blue-200 backdrop-blur-sm mb-8">
          <span className="mr-2">✨</span> AI-Powered Tip Widget
        </div>

        {/* Heading */}
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl">
          Weep Protocol
        </h1>

        {/* Subheading */}
        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400 md:text-xl">
          AI-native, x402-powered tipping infrastructure for global service businesses
        </p>

        {/* Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/dashboard">
            <button className="inline-flex h-12 items-center justify-center rounded-lg bg-blue-600 px-8 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </Link>
          <Link href="#widget">
            <button className="inline-flex h-12 items-center justify-center rounded-lg border border-white/10 bg-white/5 px-8 text-sm font-medium text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-background">
              <PlayCircle className="mr-2 h-4 w-4" />
              View Demo
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
