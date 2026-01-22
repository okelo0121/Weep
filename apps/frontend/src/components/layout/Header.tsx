import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from "thirdweb/react";
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import weepLogo from '@/assets/weep-logo.png';
import { client, chain } from '@/lib/thirdweb';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/widget', label: 'Widget' },
  { to: '/docs', label: 'Docs' },
  { to: '/disputes', label: 'Disputes' },
];

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card">
      <div className="container mx-auto px-6 py-3 max-w-[1600px]">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-105">
            <img src={weepLogo} alt="Weep" className="h-20 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-lg font-bold transition-all hover:text-primary hover:scale-105 ${location.pathname === link.to
                  ? 'text-primary'
                  : 'text-muted-foreground'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Connect Wallet Button */}
          <div className="hidden md:block">
            <ConnectButton
              client={client}
              chain={chain}
              theme="dark"
              connectButton={{ className: "!h-12 !px-6 !text-base !font-bold" }}
              connectModal={{
                size: "compact",
              }}
            />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-14 w-14" /> : <Menu className="h-14 w-14" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.to
                    ? 'text-primary'
                    : 'text-muted-foreground'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2">
                <ConnectButton
                  client={client}
                  chain={chain}
                  theme="dark"
                />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
