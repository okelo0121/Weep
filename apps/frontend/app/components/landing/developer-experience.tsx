import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const Syntax = {
  Keyword: ({ children }: { children: React.ReactNode }) => <span className="text-purple-600">{children}</span>,
  Type: ({ children }: { children: React.ReactNode }) => <span className="text-green-600">{children}</span>,
  Func: ({ children }: { children: React.ReactNode }) => <span className="text-yellow-600">{children}</span>,
  Str: ({ children }: { children: React.ReactNode }) => <span className="text-orange-500">{children}</span>,
  Attr: ({ children }: { children: React.ReactNode }) => <span className="text-blue-500">{children}</span>,
  Num: ({ children }: { children: React.ReactNode }) => <span className="text-black">{children}</span>,
  Punc: ({ children }: { children: React.ReactNode }) => <span className="text-black">{children}</span>,
  Var: ({ children }: { children: React.ReactNode }) => <span className="text-black">{children}</span>,
};

const codeContent = [
  { n: 1, c: <><Syntax.Keyword>from</Syntax.Keyword> <Syntax.Var>pinecone</Syntax.Var> <Syntax.Keyword>import</Syntax.Keyword> <Syntax.Type>Pinecone</Syntax.Type></> },
  { n: 2, c: <>&nbsp;</> },
  { n: 3, c: <><Syntax.Var>pc</Syntax.Var> = <Syntax.Type>Pinecone</Syntax.Type>(<Syntax.Str>"&lt;API KEY&gt;"</Syntax.Str>)</> },
  { n: 4, c: <>&nbsp;</> },
  { n: 5, c: <><Syntax.Var>pc</Syntax.Var>.<Syntax.Func>Index</Syntax.Func>(<Syntax.Str>"semantic-search"</Syntax.Str>)</> },
  { n: 6, c: <>&nbsp;</> },
  { n: 7, c: <><Syntax.Var>index</Syntax.Var>.<Syntax.Func>query</Syntax.Func>(</> },
  { n: 8, c: <>&nbsp;&nbsp;&nbsp;<Syntax.Attr>namespace</Syntax.Attr>=<Syntax.Str>"breaking-news"</Syntax.Str>,</> },
  { n: 9, c: <>&nbsp;&nbsp;&nbsp;<Syntax.Attr>vector</Syntax.Attr>=[<Syntax.Num>0.13</Syntax.Num>, <Syntax.Num>0.45</Syntax.Num>, <Syntax.Num>1.34</Syntax.Num>, ...],</> },
  { n: 10, c: <>&nbsp;&nbsp;&nbsp;<Syntax.Attr>filter</Syntax.Attr>={'{'}"<Syntax.Attr>category</Syntax.Attr>": {'{'}"$<Syntax.Attr>eq</Syntax.Attr>": <Syntax.Str>"technology"</Syntax.Str>{'}'}{'}'},</> },
  { n: 11, c: <>&nbsp;&nbsp;&nbsp;<Syntax.Attr>top_k</Syntax.Attr>=<Syntax.Num>3</Syntax.Num></> },
  { n: 12, c: <><Syntax.Punc>)</Syntax.Punc></> }
];


const DeveloperExperienceSection = () => {
  return (
    <section className="bg-secondary border-b border-border">
      <div className="container">
        <div className="relative grid grid-cols-1 gap-8 py-16 px-4 md:grid-cols-2 md:gap-16 md:py-24 sm:px-8">
          <div className="space-y-12">
            <div className="space-y-5">
              <span className="block text-primary text-xs/[1.5] font-medium uppercase tracking-[1.8px]">
                Merchant Integration
              </span>
              <h2 className="text-[48px] leading-[58px] tracking-[-0.01em] font-bold text-foreground">
                Instantly enable smart tipping
              </h2>
              <p className="text-body-large text-muted-foreground">
                Deploy AI TipLink by embedding a widget, configuring split rules, and exporting real-time analytics—no web3 experience required.
              </p>
            </div>
            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-xl/[1.4] font-medium tracking-[-0.3px] text-foreground">Drop-in widget</h3>
                <p className="text-base text-muted-foreground">Add tipping to POS or checkout with a single JS snippet. No wallet setup for your guests required.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl/[1.4] font-medium tracking-[-0.3px] text-foreground">Configurable split rules</h3>
                <p className="text-base text-muted-foreground">Set staff roles, percentage splits, and compliance logic right from the dashboard.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl/[1.4] font-medium tracking-[-0.3px] text-foreground">Seamless reporting</h3>
                <p className="text-base text-muted-foreground">Export payouts, generate audit-ready CSVs, or sync to accounting tools automatically.</p>
              </div>
            </div>
          </div>
          <div className="relative bg-background -mx-4 border-y border-border py-4 pl-4 pr-0 sm:-mx-8 sm:rounded-lg sm:border sm:p-6 sm:pl-8 sm:pr-0">
            <div className="flex items-center justify-between pb-4 pr-4 sm:pr-6">
              <p className="text-sm font-medium text-foreground">integration.js</p>
              <a 
                href="/docs/quickstart" 
                className="group flex items-center gap-1 text-sm text-primary transition-colors hover:underline"
              >
                Quickstart guide
                <ArrowUpRight className="h-3 w-3 text-muted-foreground transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
              </a>
            </div>
            <div className="overflow-x-auto">
              <pre className="w-full font-mono text-[13px] leading-[20.8px]">
                <code>{`
// 1. Drop-in widget
<script src='https://cdn.aitiplink.com/widget.min.js'></script>
<script>
  TipLink.init({ merchantId: 'YOUR_MERCHANT_ID' });
</script>

// 2. Configure split rules (dashboard)
POST /api/split_rules
{
  "FOH": 60, "BOH": 30, "Bar": 10
}

// 3. Export reports (fetch sample)
GET /api/tips/export?period=weekly
                `}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeveloperExperienceSection;

