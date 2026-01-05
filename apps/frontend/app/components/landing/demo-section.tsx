"use client";

import { useState } from 'react';
import { Scan, Zap, Shield, Code2, Loader2, CheckCircle2 } from 'lucide-react';

const Features = [
    {
        icon: Scan,
        title: "AI-Powered Suggestions",
        description: "Smart tip recommendations based on bill amount and context"
    },
    {
        icon: Zap,
        title: "Lightning Fast",
        description: "Instant payments on Cronos EVM with minimal gas fees"
    },
    {
        icon: Shield,
        title: "Secure & Trustless",
        description: "Blockchain-verified transactions with full transparency"
    },
    {
        icon: Code2,
        title: "Easy Integration",
        description: "Drop-in widget that works with any web application"
    }
];

const DemoSection = () => {
    const [amount, setAmount] = useState<string>("");
    const [step, setStep] = useState<'input' | 'process' | 'success'>('input');

    const handleNext = () => {
        if (!amount) return;
        setStep('process');
        setTimeout(() => setStep('success'), 1500);
    };

    const reset = () => {
        setAmount("");
        setStep('input');
    };

    return (
        <section id="widget" className="py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">See It In Action</h2>
                    <p className="text-gray-400">Try the widget below — fully functional demo</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Demo Widget Mockup */}
                    <div className="flex justify-center">
                        <div className="w-full max-w-sm bg-black rounded-3xl border border-white/10 p-6 shadow-2xl relative overflow-hidden h-[400px] flex flex-col">
                            {/* Mock UI for Widget */}
                            <div className="text-center mb-8 mt-4">
                                <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                                    <span className="text-2xl">☕</span>
                                </div>
                                <h3 className="text-xl font-bold text-white">Demo Cafe</h3>
                                <div className="flex justify-center items-center gap-4 mt-2 text-sm text-gray-400">
                                    <span>Store #123</span>
                                </div>
                            </div>

                            {step === 'input' && (
                                <div className="space-y-4 mb-8 flex-1 flex flex-col justify-center">
                                    <label className="block text-sm text-gray-400 mb-1 pl-1">Enter Bill Amount</label>
                                    <div className="bg-gray-900 rounded-xl px-4 py-3 border border-white/5 flex items-center">
                                        <span className="text-gray-400 mr-2">$</span>
                                        <input
                                            type="number"
                                            className="bg-transparent text-white w-full focus:outline-none font-bold text-lg placeholder:text-gray-600"
                                            placeholder="0.00"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        onClick={handleNext}
                                        disabled={!amount}
                                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors mt-4"
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}

                            {step === 'process' && (
                                <div className="flex-1 flex flex-col items-center justify-center">
                                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                                    <p className="text-gray-400">Processing...</p>
                                </div>
                            )}

                            {step === 'success' && (
                                <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                                    </div>
                                    <h4 className="text-xl font-bold text-white mb-2">Payment Sent!</h4>
                                    <p className="text-gray-400 text-sm mb-6">Thank you for tipping!</p>
                                    <button
                                        onClick={reset}
                                        className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                                    >
                                        Make another payment
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Why Choose Weep */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-8">Why Choose Weep?</h3>
                        <div className="space-y-4">
                            {Features.map((feature, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-center gap-4 hover:bg-white/10 transition-colors">
                                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                        <feature.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">{feature.title}</h4>
                                        <p className="text-sm text-gray-400">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DemoSection;
