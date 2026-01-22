import { Sparkles, Zap, Shield, Code2 } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Suggestions',
    description: 'Our AI analyzes service quality and context to suggest the perfect tip amount.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Tips are processed instantly with sub-50ms latency across all networks.',
  },
  {
    icon: Shield,
    title: 'Secure & Trustless',
    description: 'Built on blockchain technology for transparent, tamper-proof transactions.',
  },
  {
    icon: Code2,
    title: 'Easy Integration',
    description: 'Add our widget to any website with just a few lines of code.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Weep?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            The most advanced tipping infrastructure for modern businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group glass-card rounded-xl p-6 hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
