"use client";

import React from "react";
import Link from "next/link";

const CtaButton = ({
  href,
  text,
  primary = false,
}: {
  href: string;
  text: string;
  primary?: boolean;
}) => {
  const primaryClasses = {
    wrapper: "bg-primary text-primary-foreground border-primary hover:bg-blue-700 hover:border-blue-700",
    borderSpan: "bg-primary group-hover:bg-foreground",
  };
  const secondaryClasses = {
    wrapper: "bg-background text-foreground border-foreground hover:bg-neutral-100",
    borderSpan: "bg-foreground",
  };

  const a = `group relative inline-block p-1.5`;
  const span = `text-[15px] leading-[1.4] block border px-5 py-2.5 transition-colors ${primary ? primaryClasses.wrapper : secondaryClasses.wrapper}`;
  const borderSpan = `absolute transition-all duration-200 ease-out ${primary ? primaryClasses.borderSpan : secondaryClasses.borderSpan}`;
  
  return (
    <Link href={href} className={a}>
      <span className={span}>{text}</span>
      <span role="presentation" className={`${borderSpan} left-0 top-[5px] h-[1px] w-[6px] group-hover:translate-x-[5px]`}></span>
      <span role="presentation" className={`${borderSpan} left-[5px] top-0 h-[6px] w-[1px] group-hover:translate-y-[5px]`}></span>
      <span role="presentation" className={`${borderSpan} right-0 top-[5px] h-[1px] w-[6px] group-hover:-translate-x-[5px]`}></span>
      <span role="presentation" className={`${borderSpan} right-[5px] top-0 h-[6px] w-[1px] group-hover:translate-y-[5px]`}></span>
      <span role="presentation" className={`${borderSpan} bottom-[5px] left-0 h-[1px] w-[6px] group-hover:translate-x-[5px]`}></span>
      <span role="presentation" className={`${borderSpan} bottom-0 left-[5px] h-[6px] w-[1px] group-hover:-translate-y-[5px]`}></span>
      <span role="presentation" className={`${borderSpan} bottom-[5px] right-0 h-[1px] w-[6px] group-hover:-translate-x-[5px]`}></span>
      <span role="presentation" className={`${borderSpan} bottom-0 right-[5px] h-[6px] w-[1px] group-hover:-translate-y-[5px]`}></span>
    </Link>
  );
};


const FinalCtaSection = () => {
  return (
    <section className="border-b border-border bg-background">
      <div className="container">
        <div className="relative border-x border-border px-4 sm:px-8">
          <div className="pb-8 pt-20 text-center md:pt-24">
            <h2 className="text-5xl font-bold leading-tight tracking-tight text-foreground">
              Ready to modernize tipping?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Get started with AI TipLink—frictionless, transparent, and intelligent tipping for the Base ecosystem. One-click links, QR, and widget-based tips with AI-powered recommendation and fair, auditable distribution.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <CtaButton
                href="/signup"
                text="Get Started with AI TipLink"
                primary
              />
              <CtaButton
                href="/contact?inquiry=demo"
                text="Request a Demo"
              />
            </div>
          </div>
          <hr className="border-border" />
          <div className="flex flex-col items-center justify-between gap-6 py-10 md:flex-row">
            <h3 className="text-3xl font-semibold leading-tight tracking-tighter text-foreground">
              Subscribe to Pinecone
            </h3>
            <form className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
              <div className="relative w-full md:w-auto">
                <label htmlFor="email-subscribe" className="sr-only">
                  Email address
                </label>
                <input
                  type="email"
                  id="email-subscribe"
                  name="email"
                  autoComplete="email"
                  placeholder="Email address"
                  className="peer h-10 w-full border border-border bg-transparent px-4 text-sm text-foreground placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-0 md:min-w-64"
                />
              </div>
              <button
                type="submit"
                className="h-10 w-full shrink-0 border border-primary bg-primary px-3 text-[15px] leading-[1.4] text-primary-foreground transition-colors hover:bg-blue-700 md:mt-0 md:w-auto"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCtaSection;
