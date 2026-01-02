"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "../components/ui/Button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card.tsx";
import { Loader2, CheckCircle2, Download, ExternalLink, PieChart } from "lucide-react";

interface TipData {
  id: number;
  session: string;
  merchantId: string;
  amount: string;
  currency: string;
  status: string;
  tx_hash: string;
  created_at: string;
  split: {
    FOH: number;
    BOH: number;
    Bar: number;
  };
}

function ReceiptPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [tipData, setTipData] = useState<TipData | null>(null);
  const [splitBreakdown, setSplitBreakdown] = useState<any>(null);

  const session = searchParams.get("session");
  const merchantId = searchParams.get("merchantId");
  const txHash = searchParams.get("tx_hash");

  useEffect(() => {
    if (!merchantId) return;

    // Fetch tip data
    fetch(`/api/merchant/${merchantId}/tips`)
      .then(res => res.json())
      .then(tips => {
        const tip = tips.find((t: TipData) => t.session === session) || tips[0];
        if (tip) {
          setTipData({ ...tip, tx_hash: txHash || tip.tx_hash });

          // Fetch split breakdown
          return fetch(`/api/merchant/${merchantId}/split?total=${tip.amount}`);
        }
      })
      .then(res => res?.json())
      .then(splitData => {
        if (splitData) {
          setSplitBreakdown(splitData);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load receipt:", err);
        setLoading(false);
      });
  }, [session, merchantId, txHash]);

  const handleDownload = () => {
    // In production, generate PDF receipt
    alert("Receipt download feature coming soon!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!tipData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Receipt Not Found</CardTitle>
            <CardDescription>Unable to load receipt information</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Confirmed!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your tip has been successfully processed
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
            <CardDescription>Tip payment receipt</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600 dark:text-gray-400">Amount Tipped</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ${parseFloat(tipData.amount).toFixed(2)} {tipData.currency}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">Status</span>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                {tipData.status}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">Transaction Hash</span>
              <a
                href={`https://cronoscan.com/tx/${tipData.tx_hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-mono text-purple-600 hover:text-purple-700 dark:text-purple-400 flex items-center gap-1"
              >
                {tipData.tx_hash.slice(0, 8)}...{tipData.tx_hash.slice(-8)}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">Date</span>
              <span className="text-sm text-gray-900 dark:text-white">
                {new Date(tipData.created_at).toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Split Distribution
            </CardTitle>
            <CardDescription>How your tip will be distributed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {splitBreakdown && (
              <>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Front of House (FOH)</span>
                      <span className="text-sm font-bold">${splitBreakdown.split.FOH.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${splitBreakdown.percentages.FOH}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{splitBreakdown.percentages.FOH}%</span>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Back of House (BOH)</span>
                      <span className="text-sm font-bold">${splitBreakdown.split.BOH.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${splitBreakdown.percentages.BOH}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{splitBreakdown.percentages.BOH}%</span>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Bar</span>
                      <span className="text-sm font-bold">${splitBreakdown.split.Bar.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${splitBreakdown.percentages.Bar}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{splitBreakdown.percentages.Bar}%</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${splitBreakdown.total.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex-1" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
          <Button className="flex-1" onClick={() => router.push(`/?merchantId=${merchantId}`)}>
            Make Another Tip
          </Button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Thank you for using Tink Protocol</p>
        </div>
      </div>
    </div>
  );
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    }>
      <ReceiptPageContent />
    </Suspense>
  );
}

