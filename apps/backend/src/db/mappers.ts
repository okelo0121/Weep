import {
    Dispute,
    DisputeReason,
    DisputeStatus,
    Merchant,
    SessionStatus,
    TipSession,
    Transaction,
    TransactionStatus
} from "../types";

/**
 * Maps a database row to a Merchant object.
 *
 * @param {Record<string, unknown>} row - The database row representing merchant data.
 * @return {Merchant} The mapped Merchant object.
 */
export function mapMerchant(row: Record<string, unknown>): Merchant {
    return {
        id: row.id as string,
        name: row.name as string,
        slug: row.slug as string,
        walletAddress: row.wallet_address as string,
        avatar: row.avatar as string | undefined,
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
    };
}

/**
 * Maps a database session record to a TipSession object.
 *
 * @param {Record<string, unknown>} row - The database record containing session information.
 * @return {TipSession} A TipSession object constructed from the given database record.
 */
export function mapSession(row: Record<string, unknown>): TipSession {
    return {
        id: row.id as string,
        merchantId: row.merchant_id as string,
        billAmount: row.bill_amount as number,
        tipAmount: row.tip_amount as number | undefined,
        tipPercentage: row.tip_percentage as number | undefined,
        totalAmount: row.total_amount as number | undefined,
        currency: row.currency as string,
        status: row.status as SessionStatus,
        memo: row.memo as string,
        payerAddress: row.payer_address as string | undefined,
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
        expiresAt: row.expires_at as string,
    };
}

/**
 * Transforms a database row object into a Transaction object.
 *
 * @param {Record<string, unknown>} row - The database row containing transaction data.
 * @return {Transaction} The mapped Transaction object.
 */
export function mapTransaction(row: Record<string, unknown>): Transaction {
    return {
        id: row.id as string,
        sessionId: row.session_id as string,
        merchantId: row.merchant_id as string,
        payerAddress: row.payer_address as string,
        recipientAddress: row.recipient_address as string,
        billAmount: row.bill_amount as number,
        tipAmount: row.tip_amount as number,
        totalAmount: row.total_amount as number,
        currency: row.currency as string,
        txHash: row.tx_hash as string,
        networkId: row.network_id as string,
        status: row.status as TransactionStatus,
        createdAt: row.created_at as string,
        confirmedAt: row.confirmed_at as string | undefined,
    };
}

/**
 * Maps a database row to a Dispute object with proper type casting.
 *
 * @param {Record<string, unknown>} row - The database row containing dispute fields.
 * @return {Dispute} The mapped Dispute object.
 */
export function mapDispute(row: Record<string, unknown>): Dispute {
    return {
        id: row.id as string,
        sessionId: row.session_id as string,
        merchantId: row.merchant_id as string,
        reason: row.reason as DisputeReason,
        details: row.details as string,
        status: row.status as DisputeStatus,
        submittedBy: row.submitted_by as string,
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
        resolvedAt: row.resolved_at as string | undefined,
        resolution: row.resolution as string | undefined,
    };
}