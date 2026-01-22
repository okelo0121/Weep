import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Wallet, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { useMerchantStaffStats, useEmployeePayouts } from '@/hooks/useWeepApi';

interface EmployeePortalProps {
  walletAddress?: string;
}

// Hardcoded for demo
const DEMO_MERCHANT_SLUG = 'demo-cafe';

export function EmployeePortal({ walletAddress }: EmployeePortalProps) {
  const { data: staffList, isLoading: isStaffLoading } = useMerchantStaffStats(DEMO_MERCHANT_SLUG);

  // Find current employee based on connected wallet
  const currentEmployee = staffList?.find(
    e => e.walletAddress.toLowerCase() === walletAddress?.toLowerCase()
  );

  const { data: payouts, isLoading: isPayoutsLoading } = useEmployeePayouts(
    DEMO_MERCHANT_SLUG,
    currentEmployee?.id
  );

  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : 'Not Connected';

  if (!walletAddress) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500 border border-white/5 rounded-2xl bg-[#111111]">
        <Wallet className="h-12 w-12 mb-4 opacity-50" />
        <h3 className="text-xl font-medium text-white">Wallet Not Connected</h3>
        <p>Please connect your wallet to view your employee dashboard.</p>
      </div>
    );
  }

  if (isStaffLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500">
        <div className="animate-spin h-8 w-8 border-2 border-white/20 border-t-white rounded-full mb-4" />
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!currentEmployee) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500 border border-white/5 rounded-2xl bg-[#111111]">
        <AlertTriangle className="h-12 w-12 mb-4 text-yellow-500" />
        <h3 className="text-xl font-medium text-white">Employee Not Found</h3>
        <p className="max-w-md mx-auto mt-2 text-sm text-gray-400">
          Your wallet address <span className="font-mono text-xs bg-white/10 px-2 py-0.5 rounded mx-1 text-white">{shortAddress}</span> is not registered as an employee for this merchant.
          <br /><br />
          Please ask your manager to add you to the system.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header / Profile Card */}
      <Card className="bg-[#111111] border-white/5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{currentEmployee.name}</h2>
            <p className="text-gray-400 capitalize">{currentEmployee.role}</p>
            <p className="text-xs text-gray-500 mt-1">ID: {currentEmployee.id.slice(0, 8)}</p>
          </div>
          <Badge className={`px-4 py-1.5 text-sm font-medium ${currentEmployee.status === 'active' ? 'bg-white text-black' : 'bg-red-500 text-white'}`}>
            {currentEmployee.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </Card>

      {/* Earnings Overview Card */}
      <Card className="bg-[#111111] border-white/5 p-8 relative overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-400">
              <Wallet className="h-5 w-5" />
              <span className="font-medium">Total Received Payouts</span>
            </div>
            <div className="pt-2">
              <p className="text-lg font-medium text-gray-300">Net Tips Pending</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm font-mono text-blue-500 mb-2">Address: {shortAddress}</p>
            <div className="flex flex-col items-end">
              <span className="text-5xl font-bold text-white tracking-tight">
                ${currentEmployee.totalEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              {currentEmployee.pendingAmount > 0 ? (
                <span className="text-sm text-orange-500 font-medium mt-1">
                  + ${currentEmployee.pendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Pending
                </span>
              ) : (
                <span className="text-sm text-green-500/50 font-medium mt-1">
                  No pending tips
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Payout History */}
      <div className="space-y-4 pt-4">
        <div>
          <h3 className="text-lg font-bold text-white">Payout History</h3>
          <p className="text-sm text-gray-500">Your previous tip payments</p>
        </div>

        <Card className="bg-[#111111] border-white/5">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-gray-400 pl-6">Date</TableHead>
                <TableHead className="text-gray-400">Merchant</TableHead>
                <TableHead className="text-gray-400">Net Payout</TableHead>
                <TableHead className="text-right text-gray-400 pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPayoutsLoading ? (
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                    Loading history...
                  </TableCell>
                </TableRow>
              ) : !payouts || payouts.length === 0 ? (
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                    No payouts record found.
                  </TableCell>
                </TableRow>
              ) : (
                payouts.map((payout) => (
                  <TableRow key={payout.id} className="border-white/5 hover:bg-white/5">
                    <TableCell className="font-medium text-white py-4 pl-6">
                      {new Date(payout.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-gray-400">Current Merchant</TableCell>
                    <TableCell className={`font-medium ${payout.status === 'pending' ? 'text-orange-500' : 'text-green-500'}`}>
                      ${payout.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      {payout.status === 'pending' ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-medium">
                          <Clock className="h-3 w-3" />
                          Pending
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-medium">
                          <CheckCircle2 className="h-3 w-3" />
                          Paid
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
