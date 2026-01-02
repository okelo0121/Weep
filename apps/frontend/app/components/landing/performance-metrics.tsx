"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils'; // Assuming this utility is available from shadcn/ui setup.

interface Metric {
  value: string;
  label: string;
}

interface UseCase {
  id: 'merchants' | 'workers' | 'guests' | 'compliance';
  title: string;
  description: string;
  workload: string;
  metrics: Metric[];
}

const useCases: UseCase[] = [
  {
    id: 'merchants',
    title: 'Merchants',
    description: 'Boost tip revenue, cut reconciliation time, automate compliance, and gain actionable insights.',
    workload: 'Restaurant chain, hotel group, rideshare Tink merchant environment',
    metrics: [
      { value: '+24%', label: 'Tip Conversion Rate' },
      { value: '-90%', label: 'Reconciliation Time' },
      { value: '100%', label: 'Automated Report Export' },
    ],
  },
  {
    id: 'workers',
    title: 'Workers',
    description: 'Transparent tip distribution, instant payout options, self-serve dashboard and dispute workflow.',
    workload: 'FOH/BOH, drivers, staff, creators on TipLink',
    metrics: [
      { value: '100%', label: 'Transparent Audit Proof' },
      { value: '<5min', label: 'Avg. Payout Time' },
      { value: '-72%', label: 'Tip Disputes' },
    ],
  },
  {
    id: 'guests',
    title: 'Guests',
    description: 'One-tap tipping with verifiable split info, privacy-first UX, and AI-optimized suggestions.',
    workload: 'Guest/consumer table, rideshare, stream, or event flow',
    metrics: [
      { value: '2 taps', label: 'To Complete Tip' },
      { value: '100%', label: 'Split Disclosure' },
      { value: '+18%', label: 'Avg. Tip vs. Pre-AI' },
    ],
  },
  {
    id: 'compliance',
    title: 'Compliance',
    description: 'On-chain/hybrid proof anchoring, exportable for payroll/tax, audit-ready and privacy-first.',
    workload: 'US/EU pilots and hybrid settlement',
    metrics: [
      { value: '0', label: 'Unverifiable Payments' },
      { value: '100%', label: 'Audit Pass Rate' },
      { value: 'SOC2 read', label: 'On-chain Digest/Export' },
    ],
  }
];


const AnimatedBorderLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Link href={href} className="group relative inline-block p-1.5">
      <span className="block border border-foreground bg-background px-5 py-2.5 text-[15px] leading-[1.4] text-foreground transition-colors group-hover:border-primary">
        {children}
      </span>
      <span role="presentation" className="absolute left-0 top-[5px] h-[1px] w-[6px] bg-foreground transition-all duration-200 ease-out group-hover:translate-x-[5px] group-hover:bg-primary"></span>
      <span role="presentation" className="absolute left-[5px] top-0 h-[6px] w-[1px] bg-foreground transition-all duration-200 ease-out group-hover:translate-y-[5px] group-hover:bg-primary"></span>
      <span role="presentation" className="absolute right-0 top-[5px] h-[1px] w-[6px] bg-foreground transition-all duration-200 ease-out group-hover:-translate-x-[5px] group-hover:bg-primary"></span>
      <span role="presentation" className="absolute right-[5px] top-0 h-[6px] w-[1px] bg-foreground transition-all duration-200 ease-out group-hover:translate-y-[5px] group-hover:bg-primary"></span>
      <span role="presentation" className="absolute bottom-[5px] left-0 h-[1px] w-[6px] bg-foreground transition-all duration-200 ease-out group-hover:translate-x-[5px] group-hover:bg-primary"></span>
      <span role="presentation" className="absolute bottom-0 left-[5px] h-[6px] w-[1px] bg-foreground transition-all duration-200 ease-out group-hover:-translate-y-[5px] group-hover:bg-primary"></span>
      <span role="presentation" className="absolute bottom-[5px] right-0 h-[1px] w-[6px] bg-foreground transition-all duration-200 ease-out group-hover:-translate-x-[5px] group-hover:bg-primary"></span>
      <span role="presentation" className="absolute bottom-0 right-[5px] h-[6px] w-[1px] bg-foreground transition-all duration-200 ease-out group-hover:-translate-y-[5px] group-hover:bg-primary"></span>
    </Link>
  );
};


export default function PerformanceMetricsSection() {
  const [activeTab, setActiveTab] = useState<UseCase['id']>('search');

  const activeUseCase = useMemo(
    () => useCases.find((uc) => uc.id === activeTab),
    [activeTab]
  );
  
  const contentAnimation = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3, ease: 'easeInOut' }
  };

  return (
    <section className="border-b border-border bg-background">
      <div className="container">
        <div className="relative border-x border-border px-4 pt-16 pb-16 sm:px-8 md:pt-24 md:pb-24">
          <div className="mb-12 flex space-x-5">
            {useCases.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "cursor-pointer text-sm font-medium transition-colors duration-300",
                  activeTab === tab.id
                    ? "text-foreground"
                    : "text-gray-300 hover:text-foreground"
                )}
              >
                {`{${tab.title}}`}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeUseCase && (
              <motion.div
                key={activeUseCase.id}
                className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-8 min-h-[400px]"
                {...contentAnimation}
              >
                <div className="flex flex-col">
                  <h2 className="text-5xl font-bold leading-tight tracking-tight text-foreground">
                    {activeUseCase.title} KPIs
                  </h2>
                  <p className="mt-4 max-w-[32ch] text-lg leading-relaxed text-muted-foreground">
                    {activeUseCase.description}
                  </p>
                  <div className="mt-auto pt-8">
                    <AnimatedBorderLink href="/product/">Learn More</AnimatedBorderLink>
                  </div>
                </div>

                <div className="relative flex flex-col justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Example: {activeUseCase.workload}
                    </p>
                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {activeUseCase.metrics.map((metric, index) => (
                        <div key={index} className="rounded-lg border border-border bg-card p-6">
                          <span className="block text-[52px] font-light leading-none text-foreground">
                            {metric.value}
                          </span>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {metric.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
