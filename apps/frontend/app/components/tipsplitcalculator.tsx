"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Alert, AlertDescription } from "./ui/alert"
import { Calculator, AlertCircle } from "lucide-react"

interface SplitResult {
  foh: number
  boh: number
  bar: number
  digest: string
}

interface TipSplitCalculatorProps {
  merchantId: string
}

export function TipSplitCalculator({ merchantId }: TipSplitCalculatorProps) {
  const [totalAmount, setTotalAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [splitResult, setSplitResult] = useState<SplitResult | null>(null)

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const amount = parseFloat(totalAmount)
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount")
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/merchant/${merchantId}/split`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ total: amount }),
      })

      if (!response.ok) {
        throw new Error('Failed to calculate split')
      }

      const data = await response.json()
      setSplitResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setSplitResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Tip Split Calculator
        </CardTitle>
        <CardDescription>Calculate FOH/BOH/Bar distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="totalAmount">Total Amount ($)</Label>
            <input
              id="totalAmount"
              type="number"
              step="0.01"
              placeholder="100.00"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="w-full" disabled={loading}>
            {loading ? "Calculating..." : "Calculate Split"}
          </button>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {splitResult && (
            <div className="space-y-3 pt-4 border-t">
              <h4 className="font-semibold text-sm">Split Breakdown</h4>
              <div className="grid gap-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <span className="text-sm font-medium">Front of House (FOH)</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    ${splitResult.foh.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <span className="text-sm font-medium">Back of House (BOH)</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    ${splitResult.boh.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <span className="text-sm font-medium">Bar</span>
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    ${splitResult.bar.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="pt-2">
                <Label className="text-xs text-muted-foreground">Digest</Label>
                <p className="text-xs font-mono bg-muted p-2 rounded mt-1 break-all">
                  {splitResult.digest}
                </p>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
