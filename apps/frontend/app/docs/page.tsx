"use client";

import Navbar from "../components/landing/navbar";
import Footer from "../components/landing/footer";

export default function DocsPage() {
    return (
        <main className="min-h-screen bg-background text-foreground font-sans selection:bg-blue-500/30">
            <Navbar />
            <div className="container mx-auto px-4 py-24">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-white mb-8">Integration Documentation</h1>
                    <p className="text-xl text-gray-400 mb-12">Get up and running in minutes with our simple API</p>

                    <div className="space-y-12">
                        {/* Method 1 */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">1</span>
                                <h3 className="text-xl font-bold text-white">Add the iframe to your site (Method 1)</h3>
                                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">No code required</span>
                            </div>
                            <div className="bg-black/50 rounded-xl border border-white/10 overflow-hidden">
                                <div className="px-4 py-2 border-b border-white/10 text-xs text-gray-500 flex justify-between">
                                    <span>Iframe Integration</span>
                                    <button className="hover:text-white">Copy</button>
                                </div>
                                <pre className="p-4 text-sm text-gray-300 overflow-x-auto font-mono">
                                    {`<!-- Add this anywhere in your HTML -->
<iframe
  src="https://tink.protocol/embed?merchant=demo-cafe"
  width="400"
  height="600"
  frameborder="0"
  style="border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);"
></iframe>`}
                                </pre>
                            </div>
                        </div>

                        {/* Method 2 */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">2</span>
                                <h3 className="text-xl font-bold text-white">React Component (Method 2)</h3>
                                <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded">Coming Soon</span>
                            </div>
                            <div className="bg-black/50 rounded-xl border border-white/10 overflow-hidden mb-6">
                                <div className="px-4 py-2 border-b border-white/10 text-xs text-gray-500">Install the package</div>
                                <pre className="p-4 text-sm text-gray-300 font-mono">npm install @tink/widget</pre>
                            </div>
                        </div>

                        <div className="bg-green-900/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">✓</div>
                            <div>
                                <h4 className="text-green-400 font-bold text-sm">You are all set!</h4>
                                <p className="text-green-500/70 text-sm">Your widget is live and ready to accept tips. Works on any website platform!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
