export interface ChainConfig {
    chainId: number;
    networkString: string;
    usdc: string;
    explorer: string;
    rpc: string;
    name: string;
    contracts: {
        registry: string;
        distributor: string;
    };
}

export const cronosMainnet: ChainConfig = {
    chainId: 25,
    networkString: "cronos",
    usdc: "0xc21223249CA28397B4B6541dfFaEcC539BfF0c59",
    explorer: "https://explorer.cronos.org/",
    rpc: "https://evm.cronos.org",
    name: "Cronos Mainnet",
    contracts: {
        registry: "0x0000000000000000000000000000000000000000", // TBD
        distributor: "0x0000000000000000000000000000000000000000", // TBD
    }
}

export const cronosTestnet: ChainConfig = {
    chainId: 338,
    networkString: "cronos-testnet",
    usdc: "0x7C8cf427BB01246843bDED21B71BeF343a824712",
    explorer: "https://explorer.cronos.org/testnet",
    rpc: "https://evm-t3.cronos.org",
    name: "Cronos Testnet",
    contracts: {
        registry: "0x81aec0b87caa631365b0ac0b628a84afdf6f1fe9",
        distributor: "0xa9eaf8e76966b60e9ab63c74a42605e84adf9ece",
    }
}

export const CHAIN_CONFIG: Record<string, ChainConfig> = {
    mainnet: cronosMainnet,
    testnet: cronosTestnet
};

export type NetworkType = keyof typeof CHAIN_CONFIG;

/**
 * Retrieves the configuration for the blockchain network based on the environment's chain ID.
 *
 * @return {ChainConfig} The configuration object for the corresponding blockchain network.
 */
export function getChainConfig(): ChainConfig {
    const chainId = parseInt(process.env.CHAIN_ID || '338');
    const network = chainId === 25 ? 'mainnet' : 'testnet';
    return CHAIN_CONFIG[network];
}

export const USDC_DECIMALS = 6;

/**
 * Converts a USD amount into atomic units based on a fixed decimal scale.
 * The conversion assumes the USD value is represented in a number format
 * and applies the required scaling using the predefined USDC_DECIMALS constant.
 *
 * @param {number} usdAmount - The amount in USD to be converted into atomic units.
 * @return {bigint} The equivalent value in atomic units as a bigint.
 */
export function usdToAtomicUnits(usdAmount: number): bigint {
    return BigInt(Math.round(usdAmount * 10 ** USDC_DECIMALS));
}


/**
 * Converts a value in atomic units to its USD equivalent.
 *
 * @param atomicUnits - The value in atomic units as a bigint.
 * @return The equivalent value in USD as a number.
 */
export function atomicUnitsToUsd(atomicUnits: bigint): number {
    return Number(atomicUnits) / 10 ** USDC_DECIMALS;
}

/**
 * Formats the given number as a USD currency string.
 *
 * @param {number} amount - The numeric value to format as USD.
 * @return {string} The formatted USD currency string.
 */
export function formatUsdAmount(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
}
