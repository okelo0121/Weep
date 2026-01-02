import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import ThirdwebProviderWrapper from "./components/ThirdwebProviderWrapper";

export const metadata: Metadata = {
  title: "Weep | Tipping Infrastructure",
  description: "AI-native, x402-powered tipping infrastructure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "Weep", "version": "1.0.0"}'
        />
        <ThirdwebProviderWrapper>
          {children}
        </ThirdwebProviderWrapper>
      </body>
    </html>
  );
}
