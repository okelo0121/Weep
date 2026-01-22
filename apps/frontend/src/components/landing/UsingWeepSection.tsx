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
    <section className="py-24 bg-black relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Using Weep</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <div key={index} className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300 group relative overflow-hidden">
              {/* Accent Gradient */}
              <div className="absolute top-0 left-0 w-20 h-1 bg-blue-500 rounded-full" />

              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-blue-900/10 flex items-center justify-center mb-6 mt-2 group-hover:scale-110 transition-transform duration-300">
                <useCase.icon className="h-7 w-7 text-blue-500" />
              </div>

              <h3 className="text-xl font-bold mb-4 text-white">{useCase.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
