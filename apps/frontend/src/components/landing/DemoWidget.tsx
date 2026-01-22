import { useState } from 'react';
import { Coffee, Check, Loader2, Sparkles, ChevronRight, ArrowLeft } from 'lucide-react';
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

export function DemoWidget() {
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
      // 1. Update Tip
      await api.patch(`/sessions/${sessionId}/tip`, {
        tipPercentage: selectedTip
      });

      // 2. Simulate Payment (Real DB Record)
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

  // ... (rest of the render logic remains similar, just ensuring loading states are used)

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-background/50 z-[-2]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            See It In Action
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Experience the smooth, AI-powered payment flow using live data.
          </p>
        </div>

        <div className="max-w-md mx-auto relative group">
          {/* Animated Background Blobs */}
          <div className="blob blob-1 opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />
          <div className="blob blob-2 opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />

          <motion.div
            layout
            className="glass-card-premium rounded-3xl p-8 relative overflow-hidden border border-white/10"
          >
            {/* Header */}
            <motion.div layout className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 shadow-inner">
                <Coffee className="h-7 w-7 text-primary drop-shadow-md" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-foreground">Demo Cafe</h3>
                <p className="text-sm text-muted-foreground font-medium">Coffee & Pastries</p>
              </div>
            </motion.div>

            <div className="relative min-h-[300px]">
              <AnimatePresence mode="wait" custom={step === 'bill' ? 1 : -1}>
                {step === 'bill' && (
                  <motion.div
                    key="bill"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground ml-1">Total Bill Amount</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-light text-muted-foreground">$</span>
                        <Input
                          type="number"
                          value={billAmount}
                          onChange={(e) => setBillAmount(e.target.value)}
                          className="pl-10 h-20 text-4xl font-bold bg-secondary/30 border-white/5 focus-visible:ring-primary/50 transition-all rounded-2xl"
                          placeholder="0.00"
                          disabled={isProcessing}
                        />
                      </div>
                    </div>

                    <Button
                      className="w-full h-14 text-lg font-medium gradient-primary shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 rounded-xl"
                      onClick={handleNext}
                      disabled={isProcessing}
                    >
                      {isProcessing ? <Loader2 className="animate-spin" /> : <>Continue <ChevronRight className="ml-2 h-5 w-5" /></>}
                    </Button>
                  </motion.div>
                )}

                {/* ... Tip Step ... (Rest preserved but need to make sure I don't delete it by accident if I replace whole file. replace_file_content replaces the whole file if I don't use chunks. The prompt asks to update, but ReplaceContent is often truncated in these instructions. I should replace the WHOLE file to be safe or use chunks if I'm confident.)
                I will replace the whole file to ensure logic consistency. */}
                {step === 'tip' && (
                  <motion.div
                    key="tip"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 -ml-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setStep('bill')}
                        disabled={isProcessing}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium text-muted-foreground">Select Tip</span>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20 animate-pulse-slow">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs font-semibold text-primary uppercase tracking-wide">AI Recommendation</p>
                        <p className="text-sm text-foreground">Based on great service & similar orders</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {tipAmounts.map((tip) => {
                        const amount = calculateTipAmount(tip.value);
                        const isSuggested = tip.value === suggestedTipPercentage;

                        return (
                          <button
                            key={tip.value}
                            onClick={() => handleSelectTip(tip.value)}
                            disabled={isProcessing}
                            className={cn(
                              "relative p-4 rounded-xl border transition-all duration-200 text-left group overflow-hidden",
                              selectedTip === tip.value
                                ? "border-primary bg-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                                : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                            )}
                          >
                            {isSuggested && (
                              <div className="absolute top-0 right-0 p-1 bg-primary rounded-bl-lg">
                                <Sparkles className="h-3 w-3 text-white" />
                              </div>
                            )}
                            <div className="text-2xl font-bold mb-1 group-hover:scale-105 transition-transform duration-200">
                              {tip.label}
                            </div>
                            <div className="text-muted-foreground text-sm font-medium group-hover:text-foreground transition-colors">
                              ${amount.toFixed(2)}
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold text-foreground">
                          ${(parseFloat(billAmount || '0') + calculateTipAmount(selectedTip || 0)).toFixed(2)}
                        </p>
                      </div>
                      <Button
                        className="h-12 px-8 gradient-primary shadow-lg shadow-primary/20 rounded-xl"
                        onClick={handleConfirmTip}
                        disabled={!selectedTip || isProcessing}
                      >
                        {isProcessing ? <Loader2 className="animate-spin" /> : 'Pay'}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="flex flex-col items-center justify-center py-8 text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center mb-6 ring-1 ring-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                      >
                        <Check className="h-10 w-10 text-green-500" />
                      </motion.div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
                    <p className="text-muted-foreground mb-8 text-lg">
                      You tipped ${calculateTipAmount(selectedTip || 0).toFixed(2)} to {account ? 'Demo Cafe' : 'Demo Cafe (Simulated)'}.
                    </p>
                    <Button variant="outline" onClick={resetDemo} className="rounded-xl hover:bg-white/5 border-white/10">
                      Make Another Payment
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
