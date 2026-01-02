"use client";

import { Wallet, PieChart, Sparkles } from 'lucide-react';
import { useState } from 'react';

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
                    <h2 className="text-3xl font-bold text-white mb-4">Quick Integration</h2>
                    <p className="text-gray-400">Get up and running in minutes with our simple API</p>
                </div>

                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Method 1 */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">1</span>
                            <h3 className="text-xl font-bold text-white">Add the iframe to your site (Method 1)</h3>
                            <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">No code required</span>
                        </div>
                        <div className="bg-black/50 rounded-xl border border-white/10 overflow-hidden">
                            <div className="px-4 py-2 border-b border-white/10 text-xs text-gray-500 flex justify-between">
                                <span>Iframe Integration</span>
                                <button className="hover:text-white">Copy</button>
                            </div>
                            <pre className="p-4 text-sm text-gray-300 overflow-x-auto font-mono">
                                {`<!-- Add this anywhere in your HTML -->
<iframe
  src="https://tink.protocol/embed?merchant=demo-cafe"
  width="400"
  height="600"
  frameborder="0"
  style="border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);"
></iframe>`}
                            </pre>
                        </div>
                    </div>

                    {/* Method 2 */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">2</span>
                            <h3 className="text-xl font-bold text-white">React Component (Method 2)</h3>
                            <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded">Coming Soon</span>
                        </div>
                        <div className="bg-black/50 rounded-xl border border-white/10 overflow-hidden mb-6">
                            <div className="px-4 py-2 border-b border-white/10 text-xs text-gray-500">Install the package</div>
                            <pre className="p-4 text-sm text-gray-300 font-mono">npm install @tink/widget</pre>
                        </div>
                    </div>

                    <div className="bg-green-900/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">✓</div>
                        <div>
                            <h4 className="text-green-400 font-bold text-sm">You are all set!</h4>
                            <p className="text-green-500/70 text-sm">Your widget is live and ready to accept tips. Works on any website platform!</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection;
