"use client";

import { Wallet, PieChart, Sparkles } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const Steps = [
    {
        icon: Wallet,
        title: "Instant Digital Tipping Anywhere",
        description: "Weep lets customers tip instantly through QR codes, links, or embedded widgets. No app install, no sign-ups. Wallets are used only to approve and settle payments, making tipping frictionless."
    },
    {
        icon: PieChart,
        title: "Transparent Tip Distribution",
        description: "With Weep, businesses define clear distribution policies while employees receive tips directly into their own wallets. Every allocation is verifiable, eliminating disputes."
    },
    {
        icon: Sparkles,
        title: "AI-Driven, Context-Aware Tipping",
        description: "Weep uses AI to analyze service context, location, and cultural norms to recommend appropriate tip amounts. This reduces decision friction for users."
    }
];

const FeaturesSection = () => {
    return (
        <section className="py-24 bg-gradient-to-b from-background to-blue-950/20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">Using Weep</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {Steps.map((step, idx) => (
                        <div key={idx} className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all group">
                            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                                <step.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export const IntegrationSection = () => {
    return (
        <section className="py-24 bg-background border-t border-white/5">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">Integrations</h2>
                    <p className="text-gray-400">Works seamlessly with your favorite tools and frameworks</p>
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {['Next.js', 'React', 'Vue', 'HTML5', 'Shopify', 'WordPress', 'Wix', 'Squarespace'].map((item) => (
                            <div key={item} className="bg-white/5 border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-white/10 transition-colors group cursor-default">
                                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                                    <Sparkles size={20} />
                                </div>
                                <span className="text-white font-medium">{item}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <Link href="/docs" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                            View Documentation <Sparkles size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection;
