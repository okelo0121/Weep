import { useState } from 'react';
import { Coffee, Check, Loader2, Sparkles, ChevronRight, ArrowLeft, Zap, Shield, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { useActiveAccount } from "thirdweb/react";
import { toast } from 'sonner';

const tipAmounts = [
    { value: 15, label: '15%' },
    { value: 18, label: '18%' },
    { value: 20, label: '20%' },
    { value: 25, label: '25%' },
];

const features = [
    {
        icon: Sparkles,
        title: 'AI-Powered Suggestions',
        description: 'Smart tip recommendations based on bill amount and context',
    },
    {
        icon: Zap,
        title: 'Lightning Fast',
        description: 'Instant payments on Avalanche with minimal gas fees',
    },
    {
        icon: Shield,
        title: 'Secure & Trustless',
        description: 'Blockchain-verified transactions with full transparency',
    },
    {
        icon: Code2,
        title: 'Easy Integration',
        description: 'Drop-in widget that works with any web application',
    },
];

export function DemoWidgetSection() {
    const [step, setStep] = useState<'bill' | 'tip' | 'success'>('bill');
    const [billAmount, setBillAmount] = useState<string>('24.50');
    const [selectedTip, setSelectedTip] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const account = useActiveAccount();

    const suggestedTipPercentage = 20;

    const handleNext = async () => {
        if (!billAmount || parseFloat(billAmount) <= 0) return;

        setIsProcessing(true);
        try {
            const { data } = await api.post('/sessions', {
                merchantId: 'demo-cafe',
                billAmount: parseFloat(billAmount),
                currency: 'USDC'
            });

            if (data.success) {
                setSessionId(data.data.session.id);
                setStep('tip');
            } else {
                toast.error("Failed to start session");
            }
        } catch (error) {
            toast.error("Error creating session");
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    const calculateTipAmount = (percentage: number) => {
        const bill = parseFloat(billAmount) || 0;
        return (bill * percentage) / 100;
    };

    const handleSelectTip = (percentage: number) => {
        setSelectedTip(percentage);
    };

    const handleConfirmTip = async () => {
        if (selectedTip === null || !sessionId) return;

        setIsProcessing(true);
        try {
            await api.patch(`/sessions/${sessionId}/tip`, {
                tipPercentage: selectedTip
            });

            const { data } = await api.post('/payments/simulate', {
                sessionId,
                payerAddress: account?.address || '0x000000000000000000000000000000000000dEaD'
            });

            if (data.success) {
                setStep('success');
                toast.success("Payment successful!");
            } else {
                toast.error("Payment simulation failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Transaction failed");
        } finally {
            setIsProcessing(false);
        }
    };

    const resetDemo = () => {
        setStep('bill');
        setSelectedTip(null);
        setBillAmount('24.50');
        setSessionId(null);
    };

    return (
        <section className="py-24 relative overflow-hidden bg-black">
            <div className="container mx-auto px-6 md:px-12 relative z-10">

                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                        See It In Action
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Try the widget below — fully functional demo
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">

                    {/* LEFT COLUMN: WIDGET */}
                    <div className="relative group max-w-md mx-auto lg:mx-0 w-full">
                        {/* Widget Container */}
                        <div className="bg-[#0A0A0A] rounded-[32px] p-8 border border-white/10 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col">
                            {/* Fake Browser Traffic Lights */}
                            <div className="flex gap-2 mb-6 opacity-30">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <div className="text-[10px] text-gray-500 ml-auto font-mono">demo.weepprotocol.com</div>
                            </div>

                            {/* Merchant Profile (Always visible) */}
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 rounded-full bg-white/10 mx-auto flex items-center justify-center mb-4">
                                    <Coffee className="h-8 w-8 text-white/80" />
                                </div>
                                <h3 className="font-bold text-xl text-white">Demo Cafe</h3>

                                {/* Steps Indicator */}
                                <div className="flex items-center justify-center gap-2 mt-4 text-xs font-medium text-gray-500">
                                    <span className={cn("px-2 py-0.5 rounded-full", step === 'bill' ? "bg-blue-600 text-white" : "bg-white/10")}>1 Bill</span>
                                    <span className="w-4 h-[1px] bg-white/10"></span>
                                    <span className={cn("px-2 py-0.5 rounded-full", step === 'tip' ? "bg-blue-600 text-white" : "bg-white/10")}>2 Tip</span>
                                </div>
                            </div>

                            {/* Widget Content Area */}
                            <div className="flex-1 relative">
                                <AnimatePresence mode="wait">
                                    {step === 'bill' && (
                                        <motion.div
                                            key="bill"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="space-y-6"
                                        >
                                            <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                                                <label className="text-sm font-medium text-gray-400 block mb-2 text-center">Enter Bill Amount</label>
                                                <div className="relative flex items-center justify-center">
                                                    <span className="text-2xl text-gray-500 mr-2">$</span>
                                                    <Input
                                                        autoFocus
                                                        type="number"
                                                        value={billAmount}
                                                        onChange={(e) => setBillAmount(e.target.value)}
                                                        className="h-12 bg-transparent border-none text-center text-3xl font-bold text-white focus-visible:ring-0 p-0 w-32 placeholder:text-gray-700"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </div>

                                            <Button
                                                className="w-full h-12 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium rounded-xl text-lg"
                                                onClick={handleNext}
                                                disabled={isProcessing}
                                            >
                                                {isProcessing ? <Loader2 className="animate-spin" /> : 'Next ->'}
                                            </Button>
                                        </motion.div>
                                    )}

                                    {step === 'tip' && (
                                        <motion.div
                                            key="tip"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-4"
                                        >
                                            <p className="text-center text-sm text-gray-400 mb-4">
                                                Bill: ${parseFloat(billAmount).toFixed(2)}
                                            </p>

                                            {/* AI Suggestion */}
                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-4">
                                                <Sparkles className="h-5 w-5 text-blue-400" />
                                                <div className="text-left">
                                                    <p className="text-xs font-bold text-blue-400 uppercase">AI Suggestion</p>
                                                    <p className="text-xs text-blue-200">20% for excellent service</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                {tipAmounts.map((tip) => (
                                                    <button
                                                        key={tip.value}
                                                        onClick={() => handleSelectTip(tip.value)}
                                                        className={cn(
                                                            "p-4 rounded-xl border text-center transition-all relative overflow-hidden",
                                                            selectedTip === tip.value
                                                                ? "bg-blue-600 border-blue-500 text-white shadow-lg"
                                                                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                                        )}
                                                    >
                                                        {tip.value === 20 && (
                                                            <div className="absolute top-0 right-0 w-3 h-3 bg-blue-400 rounded-bl-lg" />
                                                        )}
                                                        <div className="text-xl font-bold">{tip.label}</div>
                                                        <div className="text-xs opacity-70">${calculateTipAmount(tip.value).toFixed(2)}</div>
                                                    </button>
                                                ))}
                                            </div>

                                            <Button
                                                className="w-full h-12 mt-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium rounded-xl"
                                                onClick={handleConfirmTip}
                                                disabled={!selectedTip || isProcessing}
                                            >
                                                {isProcessing ? <Loader2 className="animate-spin" /> : `Pay $${(parseFloat(billAmount) + calculateTipAmount(selectedTip || 0)).toFixed(2)}`}
                                            </Button>
                                        </motion.div>
                                    )}

                                    {step === 'success' && (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center py-8"
                                        >
                                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                                                <Check className="h-8 w-8" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">Paid Successfully</h3>
                                            <p className="text-gray-400 mb-8">Thank you for tipping!</p>
                                            <Button variant="outline" onClick={resetDemo} className="rounded-xl border-white/10 hover:bg-white/5 text-white">
                                                Start Over
                                            </Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: WHY CHOOSE WEEP */}
                    <div className="flex flex-col justify-center">
                        <h3 className="text-2xl font-bold text-white mb-8">Why Choose Weep?</h3>
                        <div className="space-y-4">
                            {features.map((feature, idx) => (
                                <div key={idx} className="group bg-[#0A0A0A] border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all duration-300">
                                    <div className="flex items-start gap-5">
                                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                                            <feature.icon className="h-5 w-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-white mb-1">{feature.title}</h4>
                                            <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
