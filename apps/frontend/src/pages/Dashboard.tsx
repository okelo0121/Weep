import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useActiveAccount } from "thirdweb/react";
import { ConnectButton } from "thirdweb/react";
import { Wallet, Menu, X } from 'lucide-react';
import { ManagerDashboard } from '@/components/dashboard/ManagerDashboard';
import { EmployeePortal } from '@/components/dashboard/EmployeePortal';
import { cn } from '@/lib/utils';
import weepLogo from '@/assets/weep-logo.png';
import { client, chain } from '@/lib/thirdweb';

function ConnectWalletPrompt() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Wallet className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-white">Connect Your Wallet</h1>
        <p className="text-gray-400 mb-8">
          Connect your wallet to access your dashboard and view your tip earnings, transactions, and analytics.
        </p>
        <ConnectButton
          client={client}
          chain={chain}
          theme="dark"
          connectModal={{
            size: "compact",
            title: "Sign in to Weep",
          }}
        />

        <div className="mt-8">
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

const NavLink = ({ active, children, href }: { active?: boolean; children: React.ReactNode; href: string }) => (
  <a
    href={href}
    className={cn(
      "text-lg font-bold transition-colors hover:text-primary tracking-wide",
      active ? "text-white" : "text-gray-400"
    )}
  >
    {children}
  </a>
);

export default function Dashboard() {
  const account = useActiveAccount();
  const [activeView, setActiveView] = useState<'manager' | 'employee'>('manager');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!account) {
    return <ConnectWalletPrompt />;
  }

  return (
    <div className="min-h-screen bg-black font-sans text-foreground selection:bg-primary/20">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-black border-b border-white/10 flex items-center justify-between px-4 md:px-8 z-50 transition-all duration-300">
        <div className="flex items-center gap-4 md:gap-12">
          {/* Mobile Menu Button - Massive size */}
          <button
            className="md:hidden text-gray-400 hover:text-white transform hover:scale-110 transition-transform"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={56} /> : <Menu size={56} />}
          </button>

          {/* Logo - Large relative to header */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src={weepLogo} alt="Weep" className="h-16 md:h-20 w-auto transition-transform group-hover:scale-105" />
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-12">
            <NavLink active href="/dashboard">Dashboard</NavLink>
            <NavLink href="/widget">Widget</NavLink>
            <NavLink href="/docs">Docs</NavLink>
            <NavLink href="/disputes">Disputes</NavLink>
          </nav>
        </div>

        {/* Right Side - Wallet & Balance - enhanced visibility */}
        <div className="flex items-center gap-6">
          <ConnectButton
            client={client}
            chain={chain}
            theme="dark"
            connectButton={{ className: "!h-12 !px-6 !text-base !font-bold" }}
          />
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-sm pt-20 px-6 md:hidden">
          <nav className="flex flex-col gap-6 text-lg">
            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-white font-medium">Dashboard</Link>
            <Link to="/widget" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white">Widget</Link>
            <Link to="/docs" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white">Docs</Link>
            <Link to="/disputes" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white">Disputes</Link>
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="pt-28 px-6 md:px-12 max-w-[1600px] mx-auto pb-16">
        {/* Page Header & Toggle */}
        <div className="bg-[#111111] rounded-2xl p-4 md:p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-white/5">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white mb-1">Tip Management System</h1>
            <p className="text-gray-400 text-sm">
              {activeView === 'manager' ? 'Manager Dashboard' : 'Employee Dashboard'}
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex w-full md:w-auto items-center bg-[#1A1A1A] p-1 rounded-lg border border-white/5">
            <button
              onClick={() => setActiveView('manager')}
              className={cn(
                "flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                activeView === 'manager'
                  ? "bg-[#3B82F6] text-white shadow-lg shadow-blue-500/20"
                  : "text-gray-400 hover:text-white"
              )}
            >
              Manager View
            </button>
            <button
              onClick={() => setActiveView('employee')}
              className={cn(
                "flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                activeView === 'employee'
                  ? "bg-[#3B82F6] text-white shadow-lg shadow-blue-500/20"
                  : "text-gray-400 hover:text-white"
              )}
            >
              Employee View
            </button>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeView === 'manager' ? (
            <ManagerDashboard />
          ) : (
            <EmployeePortal walletAddress={account.address} />
          )}
        </div>
      </main>
    </div>
  );
}
