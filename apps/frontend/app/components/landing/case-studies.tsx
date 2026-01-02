

const CaseStudiesSection = () => {
  return (
    <section className="border-b border-border bg-background">
      <div className="container px-4 sm:px-8 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-5xl font-bold tracking-tight text-foreground">
            Real AI TipLink Case Studies
          </h2>
          <p className="mt-4 text-xl text-text-secondary">
            See how frictionless, transparent, and intelligent tipping changes the game across service industries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Restaurant Chain */}
          <div className="group h-full">
            <div className="h-full flex flex-col rounded-lg border border-border bg-card p-8 transition-shadow duration-300 group-hover:shadow-lg">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-text-secondary">
                Restaurant Chain
              </p>
              <div className="h-6 my-6 flex items-center justify-center">
                <span role="img" aria-label="plate" className="text-3xl">🍽️</span>
              </div>
              <p className="flex-grow text-lg text-foreground">
                AI TipLink deployed at 18 locations. Result: tip conversion up 24%, end-of-shift reconciliation time down 90%, staff satisfaction +30%. Employees see split, tips auditable by all!
              </p>
              <div className="mt-auto pt-6 text-base font-semibold text-primary">Proof: On-chain audits. <span className="ml-2">→</span></div>
            </div>
          </div>
          {/* Ride-Share */}
          <div className="group h-full">
            <div className="h-full flex flex-col rounded-lg border border-border bg-card p-8 transition-shadow duration-300 group-hover:shadow-lg">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-text-secondary">Ride-share Platform</p>
              <div className="h-6 my-6 flex items-center justify-center"><span role="img" aria-label="car" className="text-3xl">🚗</span></div>
              <p className="flex-grow text-lg text-foreground">Instant QR and link tipping at ride completion. AI recommendations boost average tip. Drivers receive real-time payout with proof and timeline.</p>
              <div className="mt-auto pt-6 text-base font-semibold text-primary">Feature: Worker payout dashboard. <span className="ml-2">→</span></div>
            </div>
          </div>
          {/* Creator Economy */}
          <div className="group h-full">
            <div className="h-full flex flex-col rounded-lg border border-border bg-card p-8 transition-shadow duration-300 group-hover:shadow-lg">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-text-secondary">Streaming & Creator</p>
              <div className="h-6 my-6 flex items-center justify-center"><span role="img" aria-label="video">🎥</span></div>
              <p className="flex-grow text-lg text-foreground">With AI TipLink links in chat and overlays, creators saw a 42% uptick in micro-tips. Fans see how much goes to the performer with every transaction.</p>
              <div className="mt-auto pt-6 text-base font-semibold text-primary">Value: Transparent receipts. <span className="ml-2">→</span></div>
            </div>
          </div>
          {/* Boutique Hotel Group */}
          <div className="group h-full">
            <div className="h-full flex flex-col rounded-lg border border-border bg-card p-8 transition-shadow duration-300 group-hover:shadow-lg">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-text-secondary">Boutique Hotel Group</p>
              <div className="h-6 my-6 flex items-center justify-center"><span role="img" aria-label="hotel">🏨</span></div>
              <p className="flex-grow text-lg text-foreground">Pilots at 3 hotels saw guests leave tips in 2 taps. Hotel managers exported automated, tax-ready reporting, and workers tracked exact distribution/split by shift.</p>
              <div className="mt-auto pt-6 text-base font-semibold text-primary">Feature: Compliance reporting. <span className="ml-2">→</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;
