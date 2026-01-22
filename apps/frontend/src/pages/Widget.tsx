import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, FileCode, Book } from 'lucide-react';

const iframeCode = `<!-- Add this to your HTML -->
<iframe
  src="https://widget.weep.io/tip?
    merchant=YOUR_MERCHANT_ID&
    theme=dark"
  width="100%"
  height="400"
  frameborder="0"
  allow="payment"
></iframe>`;

const iframeAdvancedCode = `<!-- Advanced configuration -->
<iframe
  src="https://widget.weep.io/tip?
    merchant=YOUR_MERCHANT_ID&
    theme=dark&
    currency=USDC&
    network=avalanche&
    suggested_tip=5&
    show_ai_suggestions=true"
  width="100%"
  height="450"
  frameborder="0"
  allow="payment"
  style="border-radius: 12px;"
></iframe>

<script>
  // Listen for tip events
  window.addEventListener('message', (event) => {
    if (event.origin !== 'https://widget.weep.io') return;
    
    if (event.data.type === 'TIP_COMPLETE') {
      console.log('Tip received:', event.data.amount);
    }
  });
</script>`;

const reactInstallCode = `npm install @weep/react-widget`;

const reactUsageCode = `import { WeepWidget } from '@weep/react-widget';

function TipPage() {
  const handleTipComplete = (tip) => {
    console.log('Tip received:', tip);
  };

  return (
    <WeepWidget
      merchantId="YOUR_MERCHANT_ID"
      theme="dark"
      currency="USDC"
      network="avalanche"
      onTipComplete={handleTipComplete}
    />
  );
}`;

const reactAdvancedCode = `import { WeepWidget, useWeepTips } from '@weep/react-widget';

function AdvancedTipPage() {
  const { tips, total, isLoading } = useWeepTips({
    merchantId: 'YOUR_MERCHANT_ID',
  });

  return (
    <div>
      <h2>Total Earned: \${total}</h2>
      
      <WeepWidget
        merchantId="YOUR_MERCHANT_ID"
        theme="dark"
        showAiSuggestions
        allowCustomAmount
        minTip={1}
        maxTip={100}
        currencies={['USDC', 'ETH', 'AVAX']}
        networks={['avalanche', 'ethereum', 'polygon']}
        onTipStart={() => console.log('Tip started')}
        onTipComplete={(tip) => console.log('Complete:', tip)}
        onTipError={(error) => console.error('Error:', error)}
      />
    </div>
  );
}`;

export default function Widget() {
  const [activeTab, setActiveTab] = useState('iframe');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Widget Integration</h1>
          <p className="text-lg text-muted-foreground">
            Add the Weep tip widget to your website in minutes. Choose your preferred integration method.
          </p>
        </div>

        {/* Integration Options */}
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="iframe" className="flex items-center gap-2">
                <FileCode className="h-4 w-4" />
                iFrame Embed
                <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">
                  Available Now
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="react" className="flex items-center gap-2">
                <FileCode className="h-4 w-4" />
                React Component
                <Badge variant="outline" className="ml-2">
                  Coming Soon
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="iframe" className="space-y-8">
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Quick Start</h3>
                <p className="text-muted-foreground mb-4">
                  The fastest way to add Weep to your website. Just copy and paste this code:
                </p>
                <CodeBlock code={iframeCode} language="html" title="Basic iFrame Embed" />
              </div>

              <div className="glass-card rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Advanced Configuration</h3>
                <p className="text-muted-foreground mb-4">
                  Customize the widget with additional options and listen for tip events:
                </p>
                <CodeBlock code={iframeAdvancedCode} language="html" title="Advanced iFrame with Events" showLineNumbers />
              </div>

              <div className="glass-card rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-2">Configuration Options</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-foreground">Parameter</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Type</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Description</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4 font-mono text-primary">merchant</td>
                        <td className="py-3 px-4">string</td>
                        <td className="py-3 px-4">Your unique merchant ID</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4 font-mono text-primary">theme</td>
                        <td className="py-3 px-4">string</td>
                        <td className="py-3 px-4">"light" or "dark"</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4 font-mono text-primary">currency</td>
                        <td className="py-3 px-4">string</td>
                        <td className="py-3 px-4">Default currency (USDC, ETH, AVAX)</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4 font-mono text-primary">network</td>
                        <td className="py-3 px-4">string</td>
                        <td className="py-3 px-4">Blockchain network</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-mono text-primary">suggested_tip</td>
                        <td className="py-3 px-4">number</td>
                        <td className="py-3 px-4">Default suggested tip amount</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="react" className="space-y-8">
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Installation</h3>
                <p className="text-muted-foreground mb-4">
                  Install the Weep React widget package:
                </p>
                <CodeBlock code={reactInstallCode} language="bash" title="Terminal" />
              </div>

              <div className="glass-card rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Basic Usage</h3>
                <p className="text-muted-foreground mb-4">
                  Import and use the WeepWidget component in your React app:
                </p>
                <CodeBlock code={reactUsageCode} language="tsx" title="TipPage.tsx" showLineNumbers />
              </div>

              <div className="glass-card rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Advanced Usage</h3>
                <p className="text-muted-foreground mb-4">
                  Use hooks and advanced props for more control:
                </p>
                <CodeBlock code={reactAdvancedCode} language="tsx" title="AdvancedTipPage.tsx" showLineNumbers />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* About Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="glass-card rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">About Weep Protocol</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Weep Protocol is the leading AI-powered tipping infrastructure for the modern web.
              Our widget enables seamless cryptocurrency tips with intelligent suggestions,
              secure transactions, and instant settlements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild>
                <Link to="/docs">
                  <Book className="mr-2 h-4 w-4" />
                  Read Documentation
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://github.com/okelo0121/Weep" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
