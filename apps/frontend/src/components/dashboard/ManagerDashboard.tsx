import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Banknote,
  Clock,
  FileText,
  Users,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useMerchantStats, useMerchantStaffStats, useAddStaff, usePayoutEmployee } from '@/hooks/useWeepApi';
import { toast } from 'sonner';

// Hardcoded for demo/MVP
const DEMO_MERCHANT_SLUG = 'demo-cafe';

export function ManagerDashboard() {
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffAddress, setNewStaffAddress] = useState('');

  const { data: stats, isLoading: isStatsLoading } = useMerchantStats(DEMO_MERCHANT_SLUG);
  const { data: staffList, isLoading: isStaffLoading } = useMerchantStaffStats(DEMO_MERCHANT_SLUG);

  const addStaffMutation = useAddStaff();
  const payoutMutation = usePayoutEmployee();

  const handleAddStaff = () => {
    if (!newStaffName || !newStaffAddress) return;

    addStaffMutation.mutate({
      merchantSlug: DEMO_MERCHANT_SLUG,
      name: newStaffName,
      walletAddress: newStaffAddress,
      role: "Staff" // Default role
    }, {
      onSuccess: () => {
        setIsAddStaffOpen(false);
        setNewStaffName('');
        setNewStaffAddress('');
        toast.success("Staff added successfully");
      },
      onError: () => {
        toast.error("Failed to add staff");
      }
    });
  };

  const handlePayout = (employeeId: string, amount: number) => {
    payoutMutation.mutate({
      merchantSlug: DEMO_MERCHANT_SLUG,
      employeeId,
      amount
    }, {
      onSuccess: (data) => {
        toast.success(`Payout of $${amount} initiated! Tx: ${data.data.txHash.slice(0, 10)}...`);
      },
      onError: () => {
        toast.error("Payout failed");
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Daily Tips', value: stats ? `$${stats.totalTipsToday.toLocaleString()}` : '-', sub: stats?.percentChangeToday ? `+${stats.percentChangeToday}% from yesterday` : null, icon: Banknote, color: 'text-blue-500' },
          { label: 'Weekly Tips', value: stats ? `$${stats.totalTipsThisWeek.toLocaleString()}` : '-', sub: stats?.percentChangeWeek ? `${stats.percentChangeWeek > 0 ? '+' : ''}${stats.percentChangeWeek}% from last week` : null, icon: Clock, color: 'text-yellow-500' },
          { label: 'All Time Earnings', value: stats ? `$${stats.totalTipsAllTime.toLocaleString()}` : '-', sub: null, icon: FileText, color: 'text-purple-500' },
          { label: 'Active Staff', value: stats ? stats.activeEmployees : '-', sub: null, icon: Users, color: 'text-gray-400' },
        ].map((stat, i) => (
          <Card key={i} className="bg-[#111111] border-white/5 p-6 flex flex-col justify-between h-32 relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-gray-400">{stat.label}</p>
              <stat.icon className={`h-5 w-5 ${stat.color} opacity-80`} />
            </div>
            <div>
              {isStatsLoading ? (
                <div className="h-8 w-24 bg-white/5 animate-pulse rounded" />
              ) : (
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              )}
              {stat.sub && (
                <p className="text-xs text-green-500 mt-1 font-medium">{stat.sub}</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Staff Payout Status */}
      <Card className="bg-[#111111] border-white/5 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-white">Staff Payout Status</h3>
          <p className="text-sm text-gray-500">Current payment status overview</p>
        </div>

        <div className="space-y-4">
          {/* Pending Payouts Bar */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <div>
                <p className="text-sm font-medium text-orange-200">Pending Payouts</p>
                <p className="text-xs text-orange-500/70">{stats?.pendingPayoutsCount || 0} staff members</p>
              </div>
            </div>
            <p className="text-lg font-bold text-orange-500">${stats?.pendingPayouts.toLocaleString() || '0'}</p>
          </div>

          {/* Paid Out Bar */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium text-green-200">Paid Out</p>
                <p className="text-xs text-green-500/70">{stats?.paidPayoutsCount || 0} staff members</p>
              </div>
            </div>
            <p className="text-lg font-bold text-green-500">${stats?.paidPayouts.toLocaleString() || '0'}</p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/10">
          <div>
            <p className="text-sm font-medium text-white">Total Distributed Tips</p>
            <p className="text-xs text-gray-500">{stats?.activeEmployees || 0} total staff</p>
          </div>
          <p className="text-xl font-bold text-white">${stats?.totalTipsAllTime.toLocaleString() || '0'}</p>
        </div>
      </Card>

      {/* Staff List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Our Staffs</h3>
            <p className="text-sm text-gray-500">Staff members with their earings</p>
          </div>

          <Dialog open={isAddStaffOpen} onOpenChange={setIsAddStaffOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#2E45B8] hover:bg-[#253896] text-white">
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#111111] border-white/10 text-white sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Staff</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Add new staff member details below.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Name</Label>
                  <Input
                    id="name"
                    placeholder="Full Name"
                    className="bg-[#1A1A1A] border-white/10 text-white focus-visible:ring-primary"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wallet" className="text-gray-300">Wallet Address</Label>
                  <Input
                    id="wallet"
                    placeholder="Enter Employee's address"
                    className="bg-[#1A1A1A] border-white/10 text-white focus-visible:ring-primary"
                    value={newStaffAddress}
                    onChange={(e) => setNewStaffAddress(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  className="bg-[#2E45B8] hover:bg-[#253896] text-white w-full sm:w-auto"
                  onClick={handleAddStaff}
                  disabled={addStaffMutation.isPending}
                >
                  {addStaffMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Add Staff
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="bg-[#111111] border-white/5">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-gray-400">Name</TableHead>
                <TableHead className="text-gray-400">Amount</TableHead>
                <TableHead className="text-gray-400">Tx</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-right text-gray-400">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isStaffLoading ? (
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Loading staff data...
                  </TableCell>
                </TableRow>
              ) : staffList?.length === 0 ? (
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No staff found. Add one!
                  </TableCell>
                </TableRow>
              ) : (
                staffList?.map((staff) => (
                  <TableRow key={staff.id} className="border-white/5 hover:bg-white/5">
                    <TableCell className="font-medium text-white py-4">{staff.name}</TableCell>
                    <TableCell className="text-white">${staff.pendingAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-blue-500 font-mono text-xs cursor-pointer" title={staff.lastTxHash}>
                      {staff.lastTxHash ? `${staff.lastTxHash.slice(0, 6)}...${staff.lastTxHash.slice(-4)}` : '-'}
                    </TableCell>
                    <TableCell>
                      {staff.pendingAmount > 0 ? (
                        <span className="text-sm font-medium text-orange-500">Pending</span>
                      ) : (
                        <span className="text-sm font-medium text-green-500">Paid</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-white text-black hover:bg-gray-200 h-8 font-medium"
                        disabled={staff.pendingAmount <= 0 || payoutMutation.isPending}
                        onClick={() => handlePayout(staff.id, staff.pendingAmount)}
                      >
                        {payoutMutation.isPending && payoutMutation.variables?.employeeId === staff.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          "Payout"
                        )}
                      </Button>
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
