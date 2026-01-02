'use client';

import Link from 'next/link';
import { Github, Linkedin, Twitter } from 'lucide-react';

const AiTipLinkLogo = () => (
  <span className="text-3xl font-black text-primary">AI TipLink</span>
);

const footerNav = [
  {
    title: 'Product',
    links: [
      { name: 'Overview', href: '/#' },
      { name: 'How it Works', href: '/#how' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Compliance', href: '/#compliance' },
      { name: 'Integrations', href: '/#integrations' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Docs', href: '/docs', external: false },
      { name: 'Blog', href: '/blog' },
      { name: 'Ecosystem', href: '/#partners' },
      { name: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About', href: '/about' },
      { name: 'Partners', href: '/#partners' },
      { name: 'Contact', href: '/contact' },
      { name: 'Careers', href: '/careers' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { name: 'Platform Terms', href: '/legal/platform-terms' },
      { name: 'Privacy', href: '/legal/privacy' },
      { name: 'Cookies', href: '/legal/cookies' },
      { name: 'Cookie Preferences', href: '#', isButton: true },
    ]
  }
];

const socialLinks = [
  { icon: <Github className="h-5 w-5" />, href: 'https://github.com/aitiplink', 'aria-label': 'GitHub' },
  { icon: <Twitter className="h-5 w-5" />, href: 'https://twitter.com/aitiplink', 'aria-label': 'Twitter' },
  { icon: <Linkedin className="h-5 w-5" />, href: 'https://linkedin.com/company/aitiplink', 'aria-label': 'LinkedIn' },
];

const Footer = () => {
  const handleCookiePrefs = () => {
    // This would typically open a cookie consent management modal.
    console.log('Open cookie preferences');
  };

  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-bold text-white flex items-center gap-2">
                <img src="/logo.png" alt="Weep" className="w-8 h-8 object-contain" />
                Weep
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              AI-native, x402-powered tipping infrastructure for global service businesses. Weep is a programmable tipping infrastructure that enables transparent, automated, and trust-enforced tipping workflows.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a key={index} href={social.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerNav.map((column) => (
              <div key={column.title}>
                <h4 className="font-bold text-white mb-4">{column.title}</h4>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Weep Protocol. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Powered by Cronos EVM</span>
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
