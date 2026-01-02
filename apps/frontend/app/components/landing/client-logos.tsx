import React from 'react';

const Logo = ({ name, className }: { name: string; className?: string }) => (
  <span className={`whitespace-nowrap text-foreground opacity-70 transition-opacity duration-200 group-hover:opacity-100 ${className}`}>
    {name}
  </span>
);

export default function ClientLogosSection() {
  const logos = [
    { id: 'casabonita', name: 'Casa Bonita', className: 'text-2xl font-bold tracking-tight' },
    { id: 'quickride', name: 'QuickRide', className: 'text-2xl font-medium' },
    { id: 'streamstar', name: 'Streamstar', className: 'text-2xl font-medium' },
    { id: 'dinehq', name: 'DineHQ', className: 'text-2xl font-medium' },
    { id: 'hotel-alpha', name: 'Hotel Alpha', className: 'text-xl font-bold' },
    { id: 'solorider', name: 'SoloRider', className: 'text-2xl font-medium' },
    { id: 'baristo', name: 'Baristo', className: 'text-2xl font-medium' },
  ];

  return (
    <section className="border-b border-border">
      <div className="container">
        {/* Desktop view: follows the provided HTML structure with a static flex layout. */}
        <div className="relative hidden h-20 w-full border-x border-border bg-secondary md:flex items-center">
          <a href="/customers/" className="group flex h-full w-full items-center justify-between px-8">
            {logos.map(logo => (
              <Logo key={logo.id} name={logo.name} className={logo.className} />
            ))}
          </a>
        </div>
        
        {/* Mobile view: simplified to a horizontally scrolling container as a fallback for the original's JS-based marquee effect. */}
        <div className="relative h-20 border-x border-border bg-secondary !p-0 md:hidden">
          <div className="h-full w-full overflow-x-auto">
            <a href="/customers/" className="group flex h-full items-center gap-8 px-8">
              {logos.map(logo => (
                <div key={logo.id} className="flex-shrink-0">
                  <Logo name={logo.name} className={logo.className} />
                </div>
              ))}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
