import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink } from 'lucide-react';

const earningHistory = [
  { 
    id: '1', 
    date: 'Jan 18, 2026 • 8:32 PM', 
    payout: 42.50, 
    status: 'confirmed',
    txHash: '0x1234...5678'
  },
  { 
    id: '2', 
    date: 'Jan 17, 2026 • 9:15 PM', 
    payout: 38.20, 
    status: 'confirmed',
    txHash: '0xabcd...efgh'
  },
  { 
    id: '3', 
    date: 'Jan 16, 2026 • 7:45 PM', 
    payout: 55.80, 
    status: 'confirmed',
    txHash: '0x9876...5432'
  },
  { 
    id: '4', 
    date: 'Jan 15, 2026 • 10:20 PM', 
    payout: 31.40, 
    status: 'pending',
    txHash: '0xfedc...ba98'
  },
  { 
    id: '5', 
    date: 'Jan 14, 2026 • 8:55 PM', 
    payout: 48.90, 
    status: 'confirmed',
    txHash: '0x1122...3344'
  },
];

export function EarningHistory() {
  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">Earning History</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Your recent tip distributions</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border/50">
              <TableHead className="text-muted-foreground">DATE & TIME</TableHead>
              <TableHead className="text-muted-foreground">PAYOUT</TableHead>
              <TableHead className="text-muted-foreground">NETWORK STATUS</TableHead>
              <TableHead className="text-muted-foreground text-right">ON-CHAIN LINK</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {earningHistory.map((entry) => (
              <TableRow key={entry.id} className="border-border/50">
                <TableCell className="font-medium text-foreground">{entry.date}</TableCell>
                <TableCell className="text-primary font-semibold">
                  ${entry.payout.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={entry.status === 'confirmed' ? 'default' : 'secondary'}
                    className={entry.status === 'confirmed' 
                      ? 'bg-primary/20 text-primary border-primary/30' 
                      : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
                    }
                  >
                    {entry.status === 'confirmed' ? '✓ Confirmed' : '◷ Pending'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                    View Transaction
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
