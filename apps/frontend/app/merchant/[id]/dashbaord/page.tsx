"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "../../../components/ui/Button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table.tsx";
import { Slider } from "../../../components/ui/slider.tsx";
import { Loader2, Download, ExternalLink, DollarSign, Users, TrendingUp } from "lucide-react";

interface Tip {
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

export default function MerchantDashboard() {
  const params = useParams();
  const merchantId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [tips, setTips] = useState<Tip[]>([]);
  const [splitConfig, setSplitConfig] = useState({ FOH: 60, BOH: 30, Bar: 10 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!merchantId) return;

    fetch(`/api/merchant/${merchantId}/tips`)
      .then(res => res.json())
      .then(data => {
        setTips(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load tips:", err);
        setLoading(false);
      });
  }, [merchantId]);

  const totalTips = tips.reduce((sum, tip) => sum + parseFloat(tip.amount), 0);
  const totalSessions = tips.length;
  const averageTip = totalSessions > 0 ? totalTips / totalSessions : 0;

  const handleSplitChange = (role: 'FOH' | 'BOH' | 'Bar', value: number) => {
    const newConfig = { ...splitConfig, [role]: value };

    // Ensure total is 100
    const total = newConfig.FOH + newConfig.BOH + newConfig.Bar;
    if (total !== 100) {
      // Adjust other values proportionally
      const diff = 100 - total;
      const others = Object.keys(newConfig).filter(k => k !== role) as ('FOH' | 'BOH' | 'Bar')[];
      const perOther = Math.floor(diff / others.length);
      others.forEach(other => {
        newConfig[other] = Math.max(0, Math.min(100, newConfig[other] + perOther));
      });
    }

    setSplitConfig(newConfig);
  };

  const handleSaveSplit = async () => {
    setSaving(true);
    try {
      await fetch(`/api/merchant/${merchantId}/split`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(splitConfig)
      });
      alert("Split configuration saved!");
    } catch (err) {
      console.error("Failed to save split:", err);
      alert("Failed to save split configuration");
    }
    setSaving(false);
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Session", "Amount", "Currency", "Status", "TX Hash", "Date"];
    const rows = tips.map(tip => [
      tip.id,
      tip.session,
      tip.amount,
      tip.currency,
      tip.status,
      tip.tx_hash,
      new Date(tip.created_at).toLocaleString()
    ]);

    const csv = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tips_${merchantId}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Merchant Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Merchant ID: {merchantId}
            </p>
          </div>
          <Button onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tips</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalTips.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">USDC</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSessions}</div>
              <p className="text-xs text-muted-foreground">Tips received</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Tip</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${averageTip.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Per session</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Tips</CardTitle>
              <CardDescription>All tip transactions for your merchant account</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>TX Hash</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tips.map((tip) => (
                    <TableRow key={tip.id}>
                      <TableCell className="font-mono text-sm">
                        {tip.session.slice(0, 12)}...
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${parseFloat(tip.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                          {tip.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <a
                          href={`https://cronoscan.com/tx/${tip.tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-700 dark:text-purple-400 flex items-center gap-1 text-sm font-mono"
                        >
                          {tip.tx_hash.slice(0, 6)}...
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(tip.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Split Configuration</CardTitle>
              <CardDescription>Adjust tip distribution percentages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-sm font-medium">Front of House (FOH)</label>
                  <span className="text-sm font-bold">{splitConfig.FOH}%</span>
                </div>
                <Slider
                  value={[splitConfig.FOH]}
                  onValueChange={([value]) => handleSplitChange('FOH', value)}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-sm font-medium">Back of House (BOH)</label>
                  <span className="text-sm font-bold">{splitConfig.BOH}%</span>
                </div>
                <Slider
                  value={[splitConfig.BOH]}
                  onValueChange={([value]) => handleSplitChange('BOH', value)}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-sm font-medium">Bar</label>
                  <span className="text-sm font-bold">{splitConfig.Bar}%</span>
                </div>
                <Slider
                  value={[splitConfig.Bar]}
                  onValueChange={([value]) => handleSplitChange('Bar', value)}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Total</span>
                  <span className={`font-bold ${splitConfig.FOH + splitConfig.BOH + splitConfig.Bar === 100 ? 'text-green-600' : 'text-red-600'}`}>
                    {splitConfig.FOH + splitConfig.BOH + splitConfig.Bar}%
                  </span>
                </div>
                <Button
                  className="w-full"
                  onClick={handleSaveSplit}
                  disabled={saving || splitConfig.FOH + splitConfig.BOH + splitConfig.Bar !== 100}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Configuration"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

