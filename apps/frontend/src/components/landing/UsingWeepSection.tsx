import { Wallet, Users, Brain } from 'lucide-react';

const useCases = [
  {
    icon: Wallet,
    title: 'Instant Digital Tipping',
    description: 'Enable customers to tip service providers instantly using any cryptocurrency. No more cash handling or card processing fees.',
  },
  {
    icon: Users,
    title: 'Transparent Distribution',
    description: 'Smart contracts ensure fair and transparent tip distribution among team members. Every transaction is verifiable on-chain.',
  },
  {
    icon: Brain,
    title: 'AI-Driven Tipping',
    description: 'Our AI analyzes multiple factors to suggest optimal tip amounts, improving customer satisfaction and staff earnings.',
  },
];

export function UsingWeepSection() {
  return (
    <section className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Using Weep</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Transform your tipping experience with our comprehensive solution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                <useCase.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">{useCase.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
