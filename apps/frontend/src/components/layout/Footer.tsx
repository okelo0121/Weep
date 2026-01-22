import { Link } from 'react-router-dom';
import { Github, Twitter, MessageCircle } from 'lucide-react';
import weepLogo from '@/assets/weep-logo.png';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo and Tagline */}
          <div className="flex items-center gap-3">
            <img src={weepLogo} alt="Weep" className="w-12 h-12 object-contain" />
            <span className="text-sm text-muted-foreground">
              Powered by <span className="text-primary font-medium">Weep Protocol</span>
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <Link
              to="/docs"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Documentation
            </Link>
            <Link
              to="/widget"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Integration
            </Link>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy
            </a>
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Discord"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Weep Protocol. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
