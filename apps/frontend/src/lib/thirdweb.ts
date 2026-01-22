import { createThirdwebClient, defineChain } from "thirdweb";

const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;

if (!clientId) {
    throw new Error("VITE_THIRDWEB_CLIENT_ID is required");
}

export const client = createThirdwebClient({
    clientId
});

// Cronos Testnet
export const chain = defineChain(338);

export const wallets = [
    // Add wallet config if needed, usually ConnectButton handles defaults
];
