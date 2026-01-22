import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Search,
  Filter,
  Eye,
  MessageSquare,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Mock disputes data
const disputesData = [
  {
    id: 'DSP-001',
    title: 'Tip not received',
    description: 'Customer claims tip was sent but merchant did not receive it.',
    amount: 15.00,
    currency: 'USDC',
    status: 'open',
    createdAt: '2024-01-15',
    from: '0x1234...5678',
    to: '0xabcd...efgh',
    txHash: '0x9876...5432',
    messages: [
      { from: 'customer', message: 'I sent a $15 tip but the merchant says they didnt receive it.', time: '2024-01-15 10:30' },
      { from: 'support', message: 'Were investigating this issue. Please provide the transaction hash.', time: '2024-01-15 11:00' },
    ],
  },
  {
    id: 'DSP-002',
    title: 'Wrong amount charged',
    description: 'Tip amount was higher than what the customer intended.',
    amount: 50.00,
    currency: 'USDC',
    status: 'pending',
    createdAt: '2024-01-14',
    from: '0xfedc...ba98',
    to: '0x1122...3344',
    txHash: '0xaaaa...bbbb',
    messages: [
      { from: 'customer', message: 'I meant to tip $5 but $50 was charged.', time: '2024-01-14 15:20' },
    ],
  },
  {
    id: 'DSP-003',
    title: 'Duplicate transaction',
    description: 'Customer was charged twice for the same tip.',
    amount: 10.00,
    currency: 'AVAX',
    status: 'resolved',
    createdAt: '2024-01-13',
    from: '0x5555...6666',
    to: '0x7777...8888',
    txHash: '0xcccc...dddd',
    resolution: 'Refund issued to customer wallet.',
    messages: [
      { from: 'customer', message: 'I was charged twice for a $10 tip.', time: '2024-01-13 09:00' },
      { from: 'support', message: 'We found the duplicate charge. Processing refund now.', time: '2024-01-13 10:30' },
      { from: 'support', message: 'Refund has been issued. Please check your wallet.', time: '2024-01-13 11:00' },
    ],
  },
  {
    id: 'DSP-004',
    title: 'Unauthorized tip',
    description: 'Customer claims they did not authorize this tip transaction.',
    amount: 25.00,
    currency: 'ETH',
    status: 'open',
    createdAt: '2024-01-12',
    from: '0x9999...aaaa',
    to: '0xbbbb...cccc',
    txHash: '0xeeee...ffff',
    messages: [
      { from: 'customer', message: 'I did not authorize this transaction.', time: '2024-01-12 14:00' },
    ],
  },
  {
    id: 'DSP-005',
    title: 'Service not rendered',
    description: 'Tip was sent but service was not provided.',
    amount: 8.00,
    currency: 'USDC',
    status: 'resolved',
    createdAt: '2024-01-10',
    from: '0xdddd...eeee',
    to: '0xffff...0000',
    txHash: '0x1111...2222',
    resolution: 'Partial refund issued after mediation.',
    messages: [],
  },
];

const statusConfig = {
  open: { label: 'Open', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: AlertTriangle },
  pending: { label: 'Pending', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: Clock },
  resolved: { label: 'Resolved', color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: CheckCircle },
};

export default function Disputes() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDispute, setSelectedDispute] = useState<typeof disputesData[0] | null>(null);

  const filteredDisputes = disputesData.filter((dispute) => {
    const matchesStatus = statusFilter === 'all' || dispute.status === statusFilter;
    const matchesSearch = 
      dispute.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: disputesData.length,
    open: disputesData.filter(d => d.status === 'open').length,
    pending: disputesData.filter(d => d.status === 'pending').length,
    resolved: disputesData.filter(d => d.status === 'resolved').length,
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Disputes</h1>
          <p className="text-muted-foreground">
            View and manage tip dispute cases. Track resolutions and communicate with support.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total Disputes</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-500">{stats.open}</div>
              <p className="text-sm text-muted-foreground">Open</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-500">{stats.pending}</div>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-500">{stats.resolved}</div>
              <p className="text-sm text-muted-foreground">Resolved</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-secondary/50">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Disputes List */}
        <div className="space-y-4">
          {filteredDisputes.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="py-12 text-center">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No disputes found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Try adjusting your filters.'
                    : 'You have no dispute cases at this time.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredDisputes.map((dispute) => {
              const status = statusConfig[dispute.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;

              return (
                <Card key={dispute.id} className="glass-card hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${status.color}`}>
                          <StatusIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-sm text-muted-foreground">{dispute.id}</span>
                            <Badge variant="outline" className={status.color}>
                              {status.label}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg">{dispute.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{dispute.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Amount: ${dispute.amount.toFixed(2)} {dispute.currency}</span>
                            <span>•</span>
                            <span>Created: {dispute.createdAt}</span>
                            {dispute.messages.length > 0 && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  {dispute.messages.length} messages
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedDispute(dispute)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Dispute Detail Modal */}
        <Dialog open={!!selectedDispute} onOpenChange={() => setSelectedDispute(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedDispute && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-muted-foreground">{selectedDispute.id}</span>
                    <Badge 
                      variant="outline" 
                      className={statusConfig[selectedDispute.status as keyof typeof statusConfig].color}
                    >
                      {statusConfig[selectedDispute.status as keyof typeof statusConfig].label}
                    </Badge>
                  </div>
                  <DialogTitle className="text-xl">{selectedDispute.title}</DialogTitle>
                  <DialogDescription>{selectedDispute.description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  {/* Transaction Details */}
                  <div className="glass-card rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Transaction Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Amount</span>
                        <p className="font-medium">${selectedDispute.amount.toFixed(2)} {selectedDispute.currency}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Date</span>
                        <p className="font-medium">{selectedDispute.createdAt}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">From</span>
                        <p className="font-mono text-xs">{selectedDispute.from}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">To</span>
                        <p className="font-mono text-xs">{selectedDispute.to}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Transaction Hash</span>
                        <p className="font-mono text-xs">{selectedDispute.txHash}</p>
                      </div>
                    </div>
                  </div>

                  {/* Resolution (if resolved) */}
                  {selectedDispute.resolution && (
                    <div className="glass-card rounded-lg p-4 border-green-500/20 bg-green-500/5">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Resolution
                      </h4>
                      <p className="text-sm text-muted-foreground">{selectedDispute.resolution}</p>
                    </div>
                  )}

                  {/* Messages */}
                  {selectedDispute.messages.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Communication</h4>
                      <div className="space-y-3">
                        {selectedDispute.messages.map((msg, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg ${
                              msg.from === 'support' 
                                ? 'bg-primary/10 border border-primary/20' 
                                : 'bg-secondary/50 border border-border'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium capitalize">{msg.from}</span>
                              <span className="text-xs text-muted-foreground">{msg.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{msg.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
