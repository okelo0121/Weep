import { Link, useLocation } from 'react-router-dom';
import { Sparkles, User, Wallet, ChevronRight } from 'lucide-react';
import weepLogo from '@/assets/weep-logo.png';
import { cn } from '@/lib/utils';

interface DashboardSidebarProps {
  activeTab: 'manager' | 'employee';
  onTabChange: (tab: 'manager' | 'employee') => void;
  className?: string;
}

export function DashboardSidebar({ activeTab, onTabChange, className }: DashboardSidebarProps) {
  const location = useLocation();

  return (
    <aside className={cn("w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col", className)}>
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3">
          <img src={weepLogo} alt="Weep" className="w-24 h-24 object-contain" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => onTabChange('manager')}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left",
            activeTab === 'manager'
              ? "bg-primary/10 text-primary border border-primary/30"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Sparkles className="h-5 w-5" />
          <span className="font-medium">Manager Dashboard</span>
          {activeTab === 'manager' && <ChevronRight className="h-4 w-4 ml-auto" />}
        </button>

        <button
          onClick={() => onTabChange('employee')}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left",
            activeTab === 'employee'
              ? "bg-primary/10 text-primary border border-primary/30"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <User className="h-5 w-5" />
          <span className="font-medium">Employee Portal</span>
          {activeTab === 'employee' && <ChevronRight className="h-4 w-4 ml-auto" />}
        </button>
      </nav>

      {/* Network Status */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-muted/50">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <div className="flex-1">
            <p className="text-xs font-medium text-foreground">CRONOS MAINNET</p>
            <p className="text-xs text-muted-foreground">Network Stable</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
