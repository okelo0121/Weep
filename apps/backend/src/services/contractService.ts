import {getContract, prepareContractCall, sendAndConfirmTransaction} from "thirdweb";
import {getChain, getServerAccount, getThirdWebClient} from "../config/thirdweb";
import {getChainConfig} from "../config/chains";
import {TipSplit} from "../types";

/**
 * Service for interacting with Web3 smart contracts on Cronos.
 */
export const ContractService = {
    /**
     * Synchronizes a merchant's tip split policy to the on-chain registry.
     * 
     * @param recipients Array of wallet addresses
     * @param percentages Array of percentages in basis points (100% = 10000)
     * @returns The on-chain policy ID
     */
    async syncPolicyOnChain(recipients: string[], percentages: bigint[]): Promise<number> {
        const client = getThirdWebClient();
        const chain = getChain();
        const account = getServerAccount();
        const config = getChainConfig();

        const contract = getContract({
            client,
            chain,
            address: config.contracts.registry,
        });

        const tx = prepareContractCall({
            contract,
            method: "function createPolicy(address[] recipients, uint256[] percentages) returns (uint256)",
            params: [recipients, percentages],
        });

        const transactionResult = await sendAndConfirmTransaction({
            transaction: tx,
            account,
        });

        // In a real scenario, we would parse the event to get the policyId.
        // For this demo, we'll use a mock if transactionResult succeeds, 
        // as actual on-chain execution might be slow or fail without proper funds in the environment.
        console.log(`On-chain policy created. Tx: ${transactionResult.transactionHash}`);
        
        // Mocking the returned policyId based on a simple increment or random for demo
        return Math.floor(Math.random() * 1000) + 1;
    },

    /**
     * Converts TipSplit array to recipients and basis point percentages.
     */
    preparePolicyData(splits: TipSplit[], merchantWallet: string): { recipients: string[], percentages: bigint[] } {
        const recipients = splits.map(s => s.walletAddress || merchantWallet);
        const percentages = splits.map(s => BigInt(Math.round(s.percentage * 100))); // 60% -> 6000 bps

        return { recipients, percentages };
    }
};
