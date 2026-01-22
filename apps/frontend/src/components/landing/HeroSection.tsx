import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-white">AI-Powered Tip Widget</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight animate-fade-in">
            Weep Protocol
          </h1>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            AI-native, x402-powered tipping infrastructure for global service businesses
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-12 px-8 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium rounded-lg transition-all shadow-lg shadow-blue-500/20">
              <Link to="/widget">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg backdrop-blur-sm">
              <Link to="/widget">
                <span className="mr-2">⚡</span>
                View Demo
              </Link>
            </Button>
          </div>


        </div>
      </div>
    </section>
  );
}
