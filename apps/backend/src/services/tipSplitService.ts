import {TipAllocationRepository, TipSplitRepository, MerchantRepository} from "../db/models";
import {TipSplit} from "../types";

/**
 * Represents the calculation details for a split operation, including
 * the name of the entity, the percentage split, the calculated amount,
 * and an optional wallet address.
 *
 * @interface SplitCalculation
 * @property {string} name - The name of the entity involved in the split.
 * @property {number} percentage - The percentage allocated to the entity.
 * @property {number} amount - The calculated amount based on the percentage split.
 * @property {string} [walletAddress] - An optional wallet address associated with the entity.
 * @property {string} [employeeId] - An optional employee ID associated with the entity.
 */
export interface SplitCalculation {
    name: string;
    percentage: number;
    amount: number;
    walletAddress?: string;
    employeeId?: string;
}

/**
 * Splits a total tip amount among multiple recipients based on specified percentages.
 *
 * @param {number} tipAmount - The total amount of tip to be distributed.
 * @param {TipSplit[]} splits - An array of objects representing the recipients and their respective split percentages.
 * @return {SplitCalculation[]} An array of objects containing the calculated individual amounts and recipient details.
 */
export function calculateTipSplit(
    tipAmount: number,
    splits: TipSplit[]
): SplitCalculation[] {
    if (!splits || splits.length === 0) return [];

    const tipInCents = Math.round(tipAmount * 100);
    let distributedCents = 0;

    return splits.map((split, index) => {
        let amountCents: number;

        if (index === splits.length - 1) {
            // Last split gets the remainder to ensure total matches exactly
            amountCents = Math.max(0, tipInCents - distributedCents);
        } else {
            amountCents = Math.round(tipInCents * (split.percentage / 100));
            distributedCents += amountCents;
        }

        return {
            name: split.name,
            percentage: split.percentage,
            amount: amountCents / 100,
            walletAddress: split.walletAddress,
            employeeId: split.employeeId,
        };
    });
}

/**
 * Records the tip allocations for a confirmed transaction.
 *
 * @param {string} transactionId - The ID of the transaction.
 * @param {string} merchantId - The ID of the merchant.
 * @param {number} tipAmount - The total tip amount.
 */
export function recordTipAllocations(
    transactionId: string,
    merchantId: string,
    tipAmount: number
): void {
    const merchant = MerchantRepository.findById(merchantId);
    const splitConfig = TipSplitRepository.getByMerchantId(merchantId);
    const calculations = calculateTipSplit(tipAmount, splitConfig.splits);

    const allocations = calculations.map(calc => ({
        transactionId,
        merchantId,
        employeeId: calc.employeeId,
        recipientName: calc.name,
        recipientWallet: calc.walletAddress || merchant?.walletAddress || '0x0000000000000000000000000000000000000000',
        amount: calc.amount,
        percentage: calc.percentage,
        status: 'pending' as const
    }));

    TipAllocationRepository.createMany(allocations);
}

/**
 * Retrieves the tip split configuration for a given merchant and calculates the distribution
 * of the specified tip amount based on the merchant's split configuration.
 *
 * @param {string} merchantIdOrSlug - The unique identifier or slug of the merchant.
 * @param {number} tipAmount - The amount of the tip to be distributed according to the merchant's configuration.
 * @return {{ splits: SplitCalculation[], total: number } | null} An object containing the calculated splits and the total distributed amount, or null if the merchant is not found.
 */
export function getMerchantTipSplit(
    merchantIdOrSlug: string,
    tipAmount: number
): { splits: SplitCalculation[]; total: number } | null {

    // finding by id first
    let merchant = MerchantRepository.findById(merchantIdOrSlug);

    if (!merchant) {
        // finding by slug if id wasn't found
        merchant = MerchantRepository.findBySlug(merchantIdOrSlug);
    }

    if (!merchant) {
        return null;
    }

    const splitConfig = TipSplitRepository.getByMerchantId(merchant.id);

    const splits = calculateTipSplit(tipAmount, splitConfig.splits);
    const total = splits.reduce((sum, split) => sum + split.amount, 0);

    return {splits, total};
}

/**
 * Validates the configuration of tip splits to ensure all required properties are correctly provided.
 *
 * @param {TipSplit[]} splits - An array of tip split configurations, each containing a name and percentage.
 * @return {{ valid: boolean, error?: string }} An object indicating if the configuration is valid. If invalid, the error property will specify the reason.
 */
export function validateSplitConfiguration(splits: TipSplit[]): {
    valid: boolean,
    error?: string
} {
    if (!splits || splits.length === 0) {
        return {valid: false, error: "Tip split config must contain at least one split"};
    }

    for (const split of splits) {
        if (!split.name || split.name.trim().length === 0) {
            return {valid: false, error: "Each split must have a name"};
        }

        if (split.percentage < 0 || split.percentage > 100) {
            return {valid: false, error: "Split percentage must be between 0 and 100"};
        }
    }

    return {valid: true};

}

/**
 * Retrieves the default split configuration for tips distribution.
 *
 * The configuration defines how tips are allocated among various categories,
 * specifying the percentage share for each category.
 *
 * @return {TipSplit[]} An array of objects representing the default tip split configuration,
 * each containing a name and percentage field.
 */
export function getDefaultSplitConfiguration(): TipSplit[] {
    return [
        {name: "Front Of House", percentage: 60},
        {name: "Back Of House", percentage: 30},
        {name: "Bar", percentage: 10},
    ];
}

/**
 * Formats a string that displays the tip amount and its split among multiple parties.
 *
 * @param {number} tipAmount - The total tip amount to be split.
 * @param {SplitCalculation[]} splits - An array of split calculations containing the name,
 * amount, and percentage for each split.
 * @return {string} A formatted string showing the tip amount and its breakdown by splits.
 */
export function formatSplitDisplay(
    tipAmount: number,
    splits: SplitCalculation[]
): string {
    const lines = splits.map(
        (s) => `${s.name}: $${s.amount.toFixed(2)} (${s.percentage}%)`
    );
    return `$${tipAmount.toFixed(2)} tip split:\n${lines.join("\n")}`;
}