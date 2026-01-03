"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/Button"; // Ensure we have a Button component or use standard HTML button styling
import { ConnectButton } from "thirdweb/react";
// import { client } from "../../client"; // Removed unused import 
// Actually, `apps/frontend/app/pay/page.tsx` used imports from `thirdweb`. 
// I should check where `client` is initialized. If not globally, I'll initialize a local one or use a shared one.
// Let's assume for now we use the ConnectButton which handles its own state mostly, but needs a client.
// I will create a `client.ts` in `apps/frontend/app/client.ts` if it doesn't exist, to share the thirdweb client.

import { client } from "../../client";

const thirdwebClient = client;

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative h-8 w-8">
                        <Image
                            src="/logo.png"
                            alt="Weep Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-xl font-bold text-white"></span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/dashboard" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        Dashboard
                    </Link>
                    <Link href="#widget" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        Widget
                    </Link>
                    <Link href="/docs" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        Docs
                    </Link>
                    <Link href="/disputes" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        Disputes
                    </Link>
                </div>

                {/* Connect Wallet */}
                <div>
                    <ConnectButton
                        client={thirdwebClient}
                        theme="dark"
                        connectButton={{
                            label: "Connect Wallet",
                            className: "!bg-primary !text-blue !font-medium !rounded-md !h-9 !px-4 !text-sm"
                        }}
                    />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
