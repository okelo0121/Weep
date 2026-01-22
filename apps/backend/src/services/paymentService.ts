import {
    PaymentRequirements,
    PreparePaymentResponse,
    SettlePaymentResponse,
    TipSession,
    VerifyPaymentResponse
} from "../types";
import { MerchantRepository, SessionRepository, TransactionRepository } from "../db/models";
import { getDatabase } from "../db";
import { createPaymentRequirements, getFacilitator } from "../config/thirdweb";
import { getChainConfig } from "../config/chains";
import { recordTipAllocations } from "./tipSplitService";

/**
 * Prepares a payment by validating the session, merchant, and total amount,
 * and generates the necessary payment requirements.
 *
 * @param {string} sessionId - The unique identifier of the session for which the payment is to be prepared.
 * @return {Promise<PreparePaymentResponse>} A promise resolving to a response object containing the session details, merchant information, and payment requirements.
 * @throws {Error} Throws an error if the session is not found, has expired, is already confirmed, or does not have a selected total amount. Also throws an error if the associated merchant is not found.
 */
export async function preparePayment(
    sessionId: string
): Promise<PreparePaymentResponse> {
    const session = SessionRepository.findById(sessionId);

    if (!session) {
        throw new Error("Session not found");
    }

    if (session.status === 'expired') {
        throw new Error("Session has expired");
    }

    if (session.status === 'confirmed') {
        throw new Error("Payment already confirmed");
    }

    if (!session.totalAmount) {
        throw new Error("Tip not selected yet");
    }

    const merchant = MerchantRepository.findById(session.merchantId);

    if (!merchant) {
        throw new Error("Merchant not found");
    }

    // create x402 payment requirements
    const paymentRequirements = createPaymentRequirements(
        sessionId,
        session.totalAmount,
        merchant.walletAddress,
        `Tip payment to ${merchant.name}`
    );

    // update the session status
    SessionRepository.updateStatus(sessionId, 'payment_pending');

    return {
        session,
        merchant,
        paymentRequirements: paymentRequirements as PaymentRequirements,
    };

}

// verifying the payment

/**
 * Verifies the validity of a payment associated with a session.
 *
 * @param {string} sessionId - The unique identifier of the payment session.
 * @param {string} paymentPayload - The payment data or payload that needs to be verified.
 * @return {Promise<VerifyPaymentResponse>} A promise that resolves to an object containing the results of the payment verification process.
 */
export async function verifyPayment(
    sessionId: string,
    paymentPayload: string
): Promise<VerifyPaymentResponse> {
    const session = SessionRepository.findById(sessionId);

    if (!session) {
        return { isValid: false, invalidReason: "Session not found" };
    }

    if (session.status === 'confirmed') {
        return { isValid: false, invalidReason: "Payment already confirmed" };
    }

    if (session.status === 'expired') {
        return { isValid: false, invalidReason: "Session has expired" };
    }

    const merchant = MerchantRepository.findById(session.merchantId);

    if (!merchant) {
        return { isValid: false, invalidReason: "Merchant not found" };
    }

    try {
        const facilitator = getFacilitator();
        const paymentRequirements = createPaymentRequirements(
            sessionId,
            session.totalAmount!,
            merchant.walletAddress
        );

        return await facilitator.verify(
            paymentPayload,
            paymentRequirements
        );
    } catch (error) {
        return {
            isValid: false,
            invalidReason: error instanceof Error ? error.message : "Verification failed"
        };
    }
}

// settling the payment
/**
 * Processes and settles a payment session by updating its status and interacting with the payment facilitator.
 *
 * @param {string} sessionId - The unique identifier of the payment session.
 * @param {string} paymentPayload - The serialized payment data required by the payment facilitator.
 * @param {string} payerAddress - The address of the payer initiating the payment.
 * @return {Promise<SettlePaymentResponse>} A promise containing an object with the settlement result, including success status, transaction hash,
 * network ID, or an error message if the settlement fails.
 */
export async function settlePayment(
    sessionId: string,
    paymentPayload: string,
    payerAddress: string
): Promise<SettlePaymentResponse> {
    const session = SessionRepository.findById(sessionId);

    if (!session) {
        return { success: false, error: "Session not found" };
    }

    if (session.status === "confirmed") {
        return { success: false, error: "Payment already confirmed" };
    }

    const merchant = MerchantRepository.findById(session.merchantId);

    if (!merchant) {
        return { success: false, error: "Merchant not found" };
    }

    try {
        SessionRepository.updateStatus(sessionId, 'payment_processing', payerAddress);

        const facilitator = getFacilitator();
        const paymentRequirements = createPaymentRequirements(
            sessionId,
            session.totalAmount!,
            merchant.walletAddress
        );

        const result = await facilitator.settle(
            paymentPayload,
            paymentRequirements
        );

        if (result.success && result.txHash) {
            const txHash = result.txHash;
            const networkId = result.networkId || getChainConfig().networkString;

            getDatabase().transaction(() => {
                // create the transaction record
                const transaction = TransactionRepository.create({
                    sessionId,
                    merchantId: session.merchantId,
                    payerAddress,
                    recipientAddress: merchant.walletAddress,
                    billAmount: session.billAmount,
                    tipAmount: session.tipAmount ?? 0,
                    totalAmount: session.totalAmount ?? session.billAmount,
                    currency: session.currency,
                    txHash,
                    networkId,
                    onChainPolicyId: merchant.onChainPolicyId,
                });

                // confirm the transaction
                TransactionRepository.confirm(transaction.id);

                // record the tip allocations for verifiable records
                if (transaction.tipAmount > 0) {
                    recordTipAllocations(transaction.id, transaction.merchantId, transaction.tipAmount);
                }

                // update the session status
                SessionRepository.updateStatus(sessionId, 'confirmed');
            })();

            return {
                success: true,
                txHash: result.txHash,
                networkId: result.networkId,
            }
        } else {
            // payment failed
            return {
                success: false,
                error: result.error || "Settlement failed"
            };
        }
    } catch (error) {
        SessionRepository.updateStatus(sessionId, "failed");

        return {
            success: false,
            error: error instanceof Error ? error.message : "Settlement failed"
        };
    }
}

/**
 * Retrieves the payment status associated with a given session ID.
 *
 * @param {string} sessionId - The unique identifier of the session for which the payment status is being retrieved.
 * @return {{session: TipSession | null, transaction: ReturnType<typeof TransactionRepository.findBySessionId>}}
 * An object containing the session information and the transaction details. The session will be `null` if it is not found.
 */
export function getPaymentStatus(sessionId: string): {
    session: TipSession | null,
    transaction: ReturnType<typeof TransactionRepository.findBySessionId>
} {
    const session = SessionRepository.findById(sessionId);
    const transaction = TransactionRepository.findBySessionId(sessionId);

    return { session, transaction };
}

/**
 * Generates a payment URL based on the session details and base URL provided.
 *
 * @param {string} sessionId - The unique identifier of the session for which the payment URL is to be generated.
 * @param {string} baseUrl - The base URL used as the starting point for constructing the payment URL.
 * @return {string} The generated payment URL containing session, merchant, and billing details.
 * @throws {Error} If the session is not found.
 * @throws {Error} If the merchant associated with the session is not found.
 */
export function generatePaymentUrl(sessionId: string, baseUrl: string): string {
    const session = SessionRepository.findById(sessionId);

    if (!session) {
        throw new Error("Session not found");
    }

    const merchant = MerchantRepository.findById(session.merchantId);

    if (!merchant) {
        throw new Error("Merchant not found");
    }

    const params = new URLSearchParams({
        merchant: merchant.slug,
        bill: session.billAmount.toString(),
        tip: (session.tipAmount || 0).toString(),
        total: (session.totalAmount || session.billAmount).toString(),
        session: sessionId,
        payTo: merchant.walletAddress,
    });

    return `${baseUrl}/pay?${params.toString()}`;
}

/**
 * Constructs a URL for viewing transaction details on the blockchain explorer.
 *
 * @param {string} txHash - The transaction hash used to locate the transaction in the explorer.
 * @return {string} The full URL to the transaction details page on the blockchain explorer.
 */


/**
 * Simulates a payment settlement for demo purposes.
 * 
 * @param {string} sessionId 
 * @param {string} payerAddress 
 */
export async function simulatePayment(
    sessionId: string,
    payerAddress: string = "0x000000000000000000000000000000000000dEaD"
): Promise<SettlePaymentResponse> {
    const session = SessionRepository.findById(sessionId);

    if (!session) {
        return { success: false, error: "Session not found" };
    }

    if (session.status === "confirmed") {
        return { success: true, txHash: "0xsimulated" }; // Idempotent
    }

    const merchant = MerchantRepository.findById(session.merchantId);
    if (!merchant) {
        return { success: false, error: "Merchant not found" };
    }

    // Simulate Tx Hash
    const txHash = `0xsimulated${Date.now()}`;
    const networkId = getChainConfig().networkString;

    getDatabase().transaction(() => {
        // create the transaction record
        const transaction = TransactionRepository.create({
            sessionId,
            merchantId: session.merchantId,
            payerAddress,
            recipientAddress: merchant.walletAddress,
            billAmount: session.billAmount,
            tipAmount: session.tipAmount ?? 0,
            totalAmount: session.totalAmount ?? session.billAmount,
            currency: session.currency,
            txHash,
            networkId,
            onChainPolicyId: merchant.onChainPolicyId,
        });

        // confirm the transaction
        TransactionRepository.confirm(transaction.id);

        // record the tip allocations for verifiable records
        if (transaction.tipAmount > 0) {
            recordTipAllocations(transaction.id, transaction.merchantId, transaction.tipAmount);
        }

        // update the session status
        SessionRepository.updateStatus(sessionId, 'confirmed');
    })();

    return {
        success: true,
        txHash,
        networkId
    };
}

/**
 * Constructs a URL for viewing transaction details on the blockchain explorer.
 *
 * @param {string} txHash - The transaction hash used to locate the transaction in the explorer.
 * @return {string} The full URL to the transaction details page on the blockchain explorer.
 */
export function getExplorerUrl(txHash: string): string {
    const chainConfig = getChainConfig();
    return `${chainConfig.explorer}/tx/${txHash}`;
}

