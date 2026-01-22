import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Book, 
  Code, 
  Zap, 
  Shield, 
  HelpCircle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const sidebarSections = [
  {
    title: 'Getting Started',
    icon: Book,
    items: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'quickstart', label: 'Quick Start' },
      { id: 'installation', label: 'Installation' },
    ],
  },
  {
    title: 'API Reference',
    icon: Code,
    items: [
      { id: 'widget-api', label: 'Widget API' },
      { id: 'rest-api', label: 'REST API' },
      { id: 'webhooks', label: 'Webhooks' },
    ],
  },
  {
    title: 'Guides',
    icon: Zap,
    items: [
      { id: 'customization', label: 'Customization' },
      { id: 'theming', label: 'Theming' },
      { id: 'analytics', label: 'Analytics' },
    ],
  },
  {
    title: 'Security',
    icon: Shield,
    items: [
      { id: 'authentication', label: 'Authentication' },
      { id: 'best-practices', label: 'Best Practices' },
    ],
  },
  {
    title: 'FAQ',
    icon: HelpCircle,
    items: [
      { id: 'common-issues', label: 'Common Issues' },
      { id: 'troubleshooting', label: 'Troubleshooting' },
    ],
  },
];

const quickStartCode = `// 1. Install the package
npm install @weep/widget

// 2. Initialize in your app
import { WeepWidget } from '@weep/widget';

// 3. Add the widget to your page
<WeepWidget merchantId="your-merchant-id" />`;

const webhookExample = `// Webhook payload example
{
  "event": "tip.completed",
  "data": {
    "id": "tip_123abc",
    "amount": "5.00",
    "currency": "USDC",
    "from": "0x1234...5678",
    "to": "0xabcd...efgh",
    "timestamp": "2024-01-15T10:30:00Z",
    "network": "avalanche",
    "txHash": "0x..."
  }
}`;

const apiExample = `// Fetch tip history
const response = await fetch('https://api.weep.io/v1/tips', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const tips = await response.json();`;

export default function Docs() {
  const [activeSection, setActiveSection] = useState('introduction');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search docs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary/50"
                />
              </div>

              {/* Navigation */}
              <nav className="space-y-6">
                {sidebarSections.map((section) => (
                  <div key={section.title}>
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                      <section.icon className="h-4 w-4 text-primary" />
                      {section.title}
                    </div>
                    <ul className="space-y-1 ml-6">
                      {section.items.map((item) => (
                        <li key={item.id}>
                          <button
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full text-left text-sm py-1.5 px-2 rounded transition-colors ${
                              activeSection === item.id
                                ? 'text-primary bg-primary/10'
                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                            }`}
                          >
                            {item.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <div className="prose prose-invert max-w-none">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Link to="/docs" className="hover:text-primary">Docs</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">Getting Started</span>
              </div>

              {/* Introduction Section */}
              {activeSection === 'introduction' && (
                <div className="space-y-8 animate-fade-in">
                  <div>
                    <h1 className="text-4xl font-bold mb-4">Introduction to Weep Protocol</h1>
                    <p className="text-lg text-muted-foreground">
                      Weep Protocol is an AI-powered tipping infrastructure that enables seamless 
                      cryptocurrency tips on any website. Our widget provides intelligent tip 
                      suggestions, multi-currency support, and instant settlements.
                    </p>
                  </div>

                  <div className="glass-card rounded-xl p-6">
                    <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Zap className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">AI-Powered Suggestions</h3>
                          <p className="text-sm text-muted-foreground">
                            Smart algorithms suggest optimal tip amounts
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Shield className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Secure Transactions</h3>
                          <p className="text-sm text-muted-foreground">
                            Built on blockchain for trustless payments
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Quick Start</h2>
                    <p className="text-muted-foreground mb-4">
                      Get started with Weep in just 3 simple steps:
                    </p>
                    <CodeBlock code={quickStartCode} language="typescript" title="Quick Start" showLineNumbers />
                  </div>

                  <div className="flex gap-4">
                    <Button asChild>
                      <Link to="/widget">
                        View Integration Guide
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        API Reference
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              {/* Webhooks Section */}
              {activeSection === 'webhooks' && (
                <div className="space-y-8 animate-fade-in">
                  <div>
                    <h1 className="text-4xl font-bold mb-4">Webhooks</h1>
                    <p className="text-lg text-muted-foreground">
                      Receive real-time notifications when tips are processed. Configure webhooks 
                      to integrate Weep events into your backend systems.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Event Types</h2>
                    <div className="space-y-2">
                      <div className="glass-card rounded-lg p-4">
                        <code className="text-primary">tip.created</code>
                        <span className="text-muted-foreground ml-2">- A new tip has been initiated</span>
                      </div>
                      <div className="glass-card rounded-lg p-4">
                        <code className="text-primary">tip.completed</code>
                        <span className="text-muted-foreground ml-2">- A tip has been successfully processed</span>
                      </div>
                      <div className="glass-card rounded-lg p-4">
                        <code className="text-primary">tip.failed</code>
                        <span className="text-muted-foreground ml-2">- A tip transaction has failed</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Webhook Payload</h2>
                    <CodeBlock code={webhookExample} language="json" title="Webhook Payload Example" showLineNumbers />
                  </div>
                </div>
              )}

              {/* REST API Section */}
              {activeSection === 'rest-api' && (
                <div className="space-y-8 animate-fade-in">
                  <div>
                    <h1 className="text-4xl font-bold mb-4">REST API</h1>
                    <p className="text-lg text-muted-foreground">
                      Access your tip data programmatically with our REST API. 
                      Retrieve tip history, analytics, and manage your merchant settings.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
                    <p className="text-muted-foreground mb-4">
                      All API requests require authentication using your API key:
                    </p>
                    <CodeBlock code={apiExample} language="typescript" title="API Request Example" showLineNumbers />
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Endpoints</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-medium">Method</th>
                            <th className="text-left py-3 px-4 font-medium">Endpoint</th>
                            <th className="text-left py-3 px-4 font-medium">Description</th>
                          </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                          <tr className="border-b border-border/50">
                            <td className="py-3 px-4"><code className="text-green-400">GET</code></td>
                            <td className="py-3 px-4 font-mono">/v1/tips</td>
                            <td className="py-3 px-4">List all tips</td>
                          </tr>
                          <tr className="border-b border-border/50">
                            <td className="py-3 px-4"><code className="text-green-400">GET</code></td>
                            <td className="py-3 px-4 font-mono">/v1/tips/:id</td>
                            <td className="py-3 px-4">Get a specific tip</td>
                          </tr>
                          <tr className="border-b border-border/50">
                            <td className="py-3 px-4"><code className="text-blue-400">POST</code></td>
                            <td className="py-3 px-4 font-mono">/v1/webhooks</td>
                            <td className="py-3 px-4">Create a webhook</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4"><code className="text-green-400">GET</code></td>
                            <td className="py-3 px-4 font-mono">/v1/analytics</td>
                            <td className="py-3 px-4">Get analytics data</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Default/Other sections */}
              {!['introduction', 'webhooks', 'rest-api'].includes(activeSection) && (
                <div className="space-y-8 animate-fade-in">
                  <div>
                    <h1 className="text-4xl font-bold mb-4 capitalize">
                      {activeSection.replace('-', ' ')}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      This section is coming soon. Check back later for updated documentation.
                    </p>
                  </div>

                  <div className="glass-card rounded-xl p-8 text-center">
                    <Book className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Documentation In Progress</h2>
                    <p className="text-muted-foreground mb-4">
                      We're working on expanding our documentation. Need help now?
                    </p>
                    <Button variant="outline">
                      Contact Support
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
}
