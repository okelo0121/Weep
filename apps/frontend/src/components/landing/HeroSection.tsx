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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Tip Widget</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            <span className="text-foreground">The Future of </span>
            <span className="text-primary">Digital Tipping</span>
          </h1>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Seamless, AI-driven tipping infrastructure for the modern web. 
            Integrate in minutes, accept tips instantly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="gradient-primary glow-green text-primary-foreground font-semibold px-8">
              <Link to="/widget">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-border hover:bg-secondary">
              <Link to="/docs">
                View Documentation
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">$2.5M+</div>
              <div className="text-sm text-muted-foreground mt-1">Tips Processed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground mt-1">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">50ms</div>
              <div className="text-sm text-muted-foreground mt-1">Avg. Latency</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
