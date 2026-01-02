"use client";
import { useEffect } from 'react';

{ name: 'Cronos Chain', src: '', href: 'https://cronos.org' },
{ name: 'Metamask', src: '', href: 'https://metamask.io' },
{ name: 'Thirdweb', src: '', href: 'https://thirdweb.com' },
{ name: 'Coinbase Wallet', src: '', href: 'https://wallet.coinbase.com' },
{ name: 'Stripe', src: '', href: 'https://stripe.com' },
{ name: 'Square POS', src: '', href: 'https://squareup.com/us/en/point-of-sale' },

const logosRow2 = [
  { name: 'Toast POS', src: '', href: 'https://toasttab.com' },
  { name: 'Gusto Payroll', src: '', href: 'https://gusto.com' },
  { name: 'QuickBooks', src: '', href: 'https://quickbooks.intuit.com' },
  { name: 'Shopify', src: '', href: 'https://shopify.com' },
  { name: 'OpenTable', src: '', href: 'https://opentable.com' },
];

const MarqueeRow = ({ logos, direction = 'forward' }: { logos: { name: string; src: string; href: string; }[]; direction?: 'forward' | 'reverse' }) => {
  const animationClass = direction === 'forward'
    ? 'animate-[scroll_80s_linear_infinite]'
    : 'animate-[scroll_80s_linear_infinite] [animation-direction:reverse]';

  const logoIcons: Record<string, string> = {
    'Cronos Chain': '🪐',
    'Metamask': '🦊',
    'Thirdweb': '🔺',
    'Coinbase Wallet': '💼',
    'Stripe': '💳',
    'Square POS': '🟩',
    'Toast POS': '🍞',
    'Gusto Payroll': '📊',
    'QuickBooks': '📒',
    'Shopify': '🛒',
    'OpenTable': '🍽️',
  };

  return (
    <div className={`flex w-max items-center ${animationClass}`}>
      {[...logos, ...logos].map((logo, index) => (
        <a
          key={`${logo.name}-${index}`}
          href={logo.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 px-8 py-2 opacity-70 transition-opacity hover:opacity-100 text-4xl"
          aria-label={`${logo.name} integration`}
        >
          <span>{logoIcons[logo.name]}</span>
          <span className="ml-2 text-base font-medium align-middle">{logo.name}</span>
        </a>
      ))}
    </div>
  );
};

const IntegrationsCarouselSection = () => {
  useEffect(() => {
    const styleId = 'integrations-carousel-animations';
    if (document.getElementById(styleId)) {
      return;
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      @keyframes scroll {
        from { transform: translateX(0); }
        to { transform: translateX(-100%); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <section className="bg-background border-b border-border py-16 md:py-24">
      <div className="container">
        <div className="px-4 text-center sm:px-8">
          <h2 className="text-5xl font-bold tracking-tight text-foreground">
            Works with your favorite wallets, payroll & POS
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            AI TipLink connects seamlessly to Web3 wallets, payroll/export, and on-prem or cloud POS so you can enable modern tipping flows in minutes.
          </p>
        </div>
        <div className="mt-8"></div>

        <div className="relative mt-16 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]">
          <MarqueeRow logos={logosRow1} />
          <div className="mt-8">
            <MarqueeRow logos={logosRow2} direction="reverse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationsCarouselSection;
