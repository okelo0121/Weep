
import { getContract, prepareContractCall } from "thirdweb";
import { useReadContract, useSendTransaction } from "thirdweb/react";
import { parseEther } from "viem"; // Or keep using viem for parsing
import { client, chain } from "@/lib/thirdweb";
import DistributionPolicyRegistryABI from '../abis/DistributionPolicyRegistry.json';
import TipDistributorABI from '../abis/TipDistributor.json';

// Get these from env
const REGISTRY_ADDRESS = import.meta.env.VITE_REGISTRY_ADDRESS || "0x0000000000000000000000000000000000000000"; // Fallback to prevent crash if env missing
const DISTRIBUTOR_ADDRESS = import.meta.env.VITE_DISTRIBUTOR_ADDRESS || "0x0000000000000000000000000000000000000000";

const distributorContract = getContract({
    client,
    chain,
    address: DISTRIBUTOR_ADDRESS,
    abi: TipDistributorABI.abi as any
});

export function useTipCount() {
    return useReadContract({
        contract: distributorContract,
        method: "tipCount",
        params: []
    });
}

export function useCreateTip() {
    const { mutate: sendTx, isPending, data: hash, error } = useSendTransaction();

    const createTip = (policyId: string, amount: string) => {
        const transaction = prepareContractCall({
            contract: distributorContract,
            method: "createTip",
            params: [BigInt(policyId)],
            value: BigInt(parseEther(amount).toString())
        });
        sendTx(transaction);
    };

    return { createTip, isPending, hash, error };
}

export function useClaim() {
    const { mutate: sendTx, isPending, data: hash, error } = useSendTransaction();

    const claim = () => {
        const transaction = prepareContractCall({
            contract: distributorContract,
            method: "claim",
            params: []
        });
        sendTx(transaction);
    }

    return { claim, isPending, hash, error };
}
