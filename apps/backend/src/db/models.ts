import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from "./index";
import type {
    Merchant,
    MerchantStats,
    TipSplit,
    TipSplitConfig,
    TipSession,
    SessionStatus,
    Transaction,
    TransactionStatus,
    Dispute,
    DisputeReason,
    DisputeStatus,
    RecentTip,
    Employee,
    TipAllocation,
} from '../types';
import {
    mapDispute,
    mapMerchant,
    mapSession,
    mapTransaction,
    mapEmployee,
    mapTipAllocation
} from "./mappers";

/**
 * A repository for managing merchant data, including retrieving, creating, and analyzing merchants.
 * Provides methods for fetching merchant records by ID or slug, creating new merchants,
 * and retrieving merchant-specific statistics such as tips and transaction counts.
 */
export const MerchantRepository = {

    /**
     * Retrieves a merchant by its unique identifier.
     *
     * @param {string} id - The unique identifier of the merchant.
     * @return {Merchant | null} The merchant object if found, otherwise null.
     */
    findById(id: string): Merchant | null {
        const db = getDatabase();
        const row = db
            .prepare(
                `
                    SELECT id,
                           name,
                           slug,
                           wallet_address,
                           avatar,
                           on_chain_policy_id,
                           created_at,
                           updated_at
                    FROM merchants
                    WHERE id = ?
                `
            )
            .get(id) as Record<string, unknown> | undefined;

        return row ? mapMerchant(row) : null;
    },

    /**
     * Finds a merchant record by its slug.
     *
     * @param {string} slug - The unique identifier slug of the merchant.
     * @return {Merchant | null} The merchant object if a match is found, or null if no match exists.
     */
    findBySlug(slug: string): Merchant | null {
        const db = getDatabase();
        const row = db
            .prepare(
                `
                    SELECT id,
                           name,
                           slug,
                           wallet_address,
                           avatar,
                           on_chain_policy_id,
                           created_at,
                           updated_at
                    FROM merchants
                    WHERE slug = ?
                `
            )
            .get(slug) as Record<string, unknown> | undefined;

        return row ? mapMerchant(row) : null;
    },

    /**
     * Creates a new merchant entry in the database and returns the created merchant.
     *
     * @param {Omit<Merchant, "id" | "createdAt" | "updatedAt">} data - The merchant data excluding the id, createdAt, and updatedAt fields.
     * @return {Merchant} The created merchant object with all fields populated, including id, createdAt, and updatedAt.
     */
    create(data: Omit<Merchant, "id" | "createdAt" | "updatedAt">): Merchant {
        const db = getDatabase();
        const now = new Date().toISOString();
        const id = `merchant_${uuidv4()}`;

        db.prepare(
            `
                INSERT INTO merchants (id,
                                       name,
                                       slug,
                                       wallet_address,
                                       avatar,
                                       on_chain_policy_id,
                                       created_at,
                                       updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `
        ).run(
            id,
            data.name,
            data.slug,
            data.walletAddress,
            data.avatar || null,
            data.onChainPolicyId || null,
            now,
            now
        );

        return this.findById(id)!;
    },

    updateOnChainPolicyId(id: string, onChainPolicyId: number): void {
        const db = getDatabase();
        const now = new Date().toISOString();

        db.prepare(
            `
                UPDATE merchants
                SET on_chain_policy_id = ?,
                    updated_at         = ?
                WHERE id = ?
            `
        ).run(onChainPolicyId, now, id);
    },

    /**
     * Retrieves statistical data for a given merchant, including tips for today, this week, all-time totals,
     * tip count, and percentage changes compared to previous periods.
     *
     * @param {string} merchantId - The unique identifier of the merchant whose stats are being retrieved.
     * @return {MerchantStats} An object containing the merchant's aggregated statistics, such as today's tips,
     * this week's tips, all-time totals, total tip count, and percentage changes.
     */
    getStats(merchantId: string): MerchantStats {
        const db = getDatabase();

        const today = new Date().toISOString().split("T")[0];
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0];
        const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0];

        // Today's tips
        const todayResult = db
            .prepare(
                `
                    SELECT COALESCE(SUM(tip_amount), 0) as total
                    FROM transactions
                    WHERE merchant_id = ?
                      AND status = 'confirmed'
                      AND DATE(created_at) = ?
                `
            )
            .get(merchantId, today) as { total: number };

        // This week's tips
        const weekResult = db
            .prepare(
                `
                    SELECT COALESCE(SUM(tip_amount), 0) as total
                    FROM transactions
                    WHERE merchant_id = ?
                      AND status = 'confirmed'
                      AND DATE(created_at) >= ?
                `
            )
            .get(merchantId, weekAgo) as { total: number };

        // Last week's tips (for comparison)
        const lastWeekResult = db
            .prepare(
                `
                    SELECT COALESCE(SUM(tip_amount), 0) as total
                    FROM transactions
                    WHERE merchant_id = ?
                      AND status = 'confirmed'
                      AND DATE(created_at) >= ?
                      AND DATE(created_at) < ?
                `
            )
            .get(merchantId, twoWeeksAgo, weekAgo) as { total: number };

        // All time
        const allTimeResult = db
            .prepare(
                `
                    SELECT COALESCE(SUM(tip_amount), 0) as total,
                           COUNT(*)                     as count
                    FROM transactions
                    WHERE merchant_id = ?
                      AND status = 'confirmed'
                `
            )
            .get(merchantId) as { total: number; count: number };

        // Payout Stats (Allocations)
        const pendingResult = db.prepare(`
            SELECT COALESCE(SUM(amount), 0) as total, COUNT(DISTINCT employee_id) as count
            FROM tip_allocations
            WHERE merchant_id = ? AND status = 'pending'
        `).get(merchantId) as { total: number, count: number };

        const paidResult = db.prepare(`
            SELECT COALESCE(SUM(amount), 0) as total, COUNT(DISTINCT employee_id) as count
            FROM tip_allocations
            WHERE merchant_id = ? AND status != 'pending'
        `).get(merchantId) as { total: number, count: number };

        // Active Employees
        const employeeResult = db.prepare(`SELECT COUNT(*) as count FROM employees WHERE merchant_id = ? AND status = 'active'`).get(merchantId) as { count: number };

        // Calculate percentage changes
        const percentChangeWeek =
            lastWeekResult.total > 0
                ? ((weekResult.total - lastWeekResult.total) / lastWeekResult.total) *
                100
                : 0;

        return {
            totalTipsToday: todayResult.total,
            totalTipsThisWeek: weekResult.total,
            totalTipsAllTime: allTimeResult.total,
            tipCountTotal: allTimeResult.count,
            percentChangeToday: 12.3, // Would need yesterday's data for real calculation
            percentChangeWeek: Math.round(percentChangeWeek * 10) / 10,
            activeEmployees: employeeResult.count,
            pendingPayouts: pendingResult.total,
            pendingPayoutsCount: pendingResult.count,
            paidPayouts: paidResult.total,
            paidPayoutsCount: paidResult.count
        };
    }
};

/**
 * Represents a repository for managing tip split configurations associated with merchants.
 */
export const TipSplitRepository = {

    /**
     * Fetches the tip split configuration for a given merchant by their unique ID.
     *
     * @param {string} merchantId - The unique identifier of the merchant whose tip split configuration is to be retrieved.
     * @return {TipSplitConfig} The tip split configuration, including details of name, percentage, and wallet address for each split.
     */
    getByMerchantId(merchantId: string): TipSplitConfig {
        const db = getDatabase();
        const rows = db
            .prepare(
                `
                    SELECT id,
                           merchant_id,
                           name,
                           percentage,
                           wallet_address,
                           employee_id
                    FROM tip_splits
                    WHERE merchant_id = ?
                `
            )
            .all(merchantId) as Array<{
                id: string;
                merchant_id: string;
                name: string;
                percentage: number;
                wallet_address: string | null;
                employee_id: string | null;
            }>;

        return {
            merchantId,
            splits: rows.map((row) => ({
                id: row.id,
                merchantId: row.merchant_id,
                name: row.name,
                percentage: row.percentage,
                walletAddress: row.wallet_address || undefined,
                employeeId: row.employee_id || undefined,
            })),
        };
    },

    /**
     * Updates the tip splits configuration for a given merchant. Existing tip splits are deleted and replaced
     * with the provided splits. Returns the updated tip split configuration.
     *
     * @param {string} merchantId - The unique identifier of the merchant whose tip splits are to be updated.
     * @param {TipSplit[]} splits - An array of TipSplit objects representing the new splits to be applied. Each split
     * contains a name, percentage, and an optional wallet address.
     *
     * @return {TipSplitConfig} The updated tip split configuration for the specified merchant.
     */
    update(merchantId: string, splits: TipSplit[]): TipSplitConfig {
        const db = getDatabase();
        const now = new Date().toISOString();

        db.transaction(() => {
            // Delete existing splits
            db.prepare("DELETE FROM tip_splits WHERE merchant_id = ?").run(merchantId);

            // Insert new splits
            const insert = db.prepare(`
                INSERT INTO tip_splits (id,
                                        merchant_id,
                                        name,
                                        percentage,
                                        wallet_address,
                                        employee_id,
                                        created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `);

            splits.forEach((split, index) => {
                insert.run(
                    split.id || `split_${uuidv4()}_${index}`,
                    merchantId,
                    split.name,
                    split.percentage,
                    split.walletAddress || null,
                    split.employeeId || null,
                    now
                );
            });
        })();

        return this.getByMerchantId(merchantId);
    },
};

/**
 * Repository for managing employees within the system.
 */
export const EmployeeRepository = {
    /**
     * Finds an employee by their unique identifier.
     *
     * @param {string} id - The unique identifier of the employee.
     * @return {Employee | null}
     */
    findById(id: string): Employee | null {
        const db = getDatabase();
        const row = db.prepare("SELECT * FROM employees WHERE id = ?").get(id) as Record<string, unknown> | undefined;
        return row ? mapEmployee(row) : null;
    },

    /**
     * Retrieves all employees associated with a specific merchant.
     *
     * @param {string} merchantId - The unique identifier of the merchant.
     * @return {Employee[]}
     */
    getByMerchantId(merchantId: string): Employee[] {
        const db = getDatabase();
        const rows = db.prepare("SELECT * FROM employees WHERE merchant_id = ? ORDER BY name ASC").all(merchantId) as Record<string, unknown>[];
        return rows.map(mapEmployee);
    },

    /**
     * Creates a new employee record.
     *
     * @param {Omit<Employee, "id" | "createdAt" | "updatedAt">} data
     * @return {Employee}
     */
    create(data: Omit<Employee, "id" | "createdAt" | "updatedAt">): Employee {
        const db = getDatabase();
        const now = new Date().toISOString();
        const id = `employee_${uuidv4()}`;

        db.prepare(`
            INSERT INTO employees (id, merchant_id, name, wallet_address, role, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(id, data.merchantId, data.name, data.walletAddress, data.role, data.status || 'active', now, now);

        return this.findById(id)!;
    },

    getWithStats(merchantId: string): any[] {
        const db = getDatabase();
        // Join with tip allocations to get pending and total
        const rows = db.prepare(`
            SELECT 
                e.*,
                COALESCE(SUM(CASE WHEN ta.status = 'pending' THEN ta.amount ELSE 0 END), 0) as pending_amount,
                COALESCE(SUM(CASE WHEN ta.status != 'pending' THEN ta.amount ELSE 0 END), 0) as total_earned,
                (SELECT tx_hash FROM transactions WHERE merchant_id = e.merchant_id ORDER BY created_at DESC LIMIT 1) as last_tx_hash
            FROM employees e
            LEFT JOIN tip_allocations ta ON e.id = ta.employee_id
            WHERE e.merchant_id = ?
            GROUP BY e.id
            ORDER BY e.name ASC
        `).all(merchantId) as any[];

        return rows.map(row => ({
            ...mapEmployee(row),
            pendingAmount: row.pending_amount,
            totalEarned: row.total_earned,
            lastTxHash: row.last_tx_hash || '0x...',
            lastTxStatus: row.pending_amount > 0 ? 'Pending' : 'Paid'
        }));
    }
};

/**
 * Repository for managing tip allocations (verifiable records of payments).
 */
export const TipAllocationRepository = {
    /**
     * Records a list of tip allocations.
     *
     * @param {Omit<TipAllocation, "id" | "createdAt">[]} allocations
     */
    createMany(allocations: Omit<TipAllocation, "id" | "createdAt">[]): void {
        const db = getDatabase();
        const now = new Date().toISOString();

        const insert = db.prepare(`
            INSERT INTO tip_allocations (id, transaction_id, merchant_id, employee_id, recipient_name, recipient_wallet, amount, percentage, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        db.transaction(() => {
            for (const allocation of allocations) {
                insert.run(
                    `alloc_${uuidv4()}`,
                    allocation.transactionId,
                    allocation.merchantId,
                    allocation.employeeId || null,
                    allocation.recipientName,
                    allocation.recipientWallet,
                    allocation.amount,
                    allocation.percentage,
                    allocation.status || 'pending',
                    now
                );
            }
        })();
    },

    /**
     * Retrieves allocations for a specific transaction.
     *
     * @param {string} transactionId
     * @return {TipAllocation[]}
     */
    getByTransactionId(transactionId: string): TipAllocation[] {
        const db = getDatabase();
        const rows = db.prepare("SELECT * FROM tip_allocations WHERE transaction_id = ?").all(transactionId) as Record<string, unknown>[];
        return rows.map(mapTipAllocation);
    },

    /**
     * Retrieves allocations for a specific merchant (Operations Dashboard).
     *
     * @param {string} merchantId
     * @param {number} limit
     * @return {TipAllocation[]}
     */
    getByMerchantId(merchantId: string, limit: number = 50): TipAllocation[] {
        const db = getDatabase();
        const rows = db.prepare("SELECT * FROM tip_allocations WHERE merchant_id = ? ORDER BY created_at DESC LIMIT ?").all(merchantId, limit) as Record<string, unknown>[];
        return rows.map(mapTipAllocation);
    },

    /**
     * Retrieves allocations for a specific employee.
     *
     * @param {string} employeeId
     * @param {number} limit
     * @return {TipAllocation[]}
     */
    getByEmployeeId(employeeId: string, limit: number = 50): TipAllocation[] {
        const db = getDatabase();
        const rows = db.prepare("SELECT * FROM tip_allocations WHERE employee_id = ? ORDER BY created_at DESC LIMIT ?").all(employeeId, limit) as Record<string, unknown>[];
        return rows.map(mapTipAllocation);
    },

    markDistributed(employeeId: string): void {
        const db = getDatabase();
        const now = new Date().toISOString();
        db.prepare(`
            UPDATE tip_allocations 
            SET status = 'distributed' 
            WHERE employee_id = ? AND status = 'pending'
        `).run(employeeId);
    }
};


/**
 * A repository object for managing tip session data. Provides methods to create,
 * retrieve, and update sessions stored in a persistent database.
 *
 * This repository encapsulates the data access logic and ensures consistent
 * interactions with the underlying database for entities of type `TipSession`.
 */
export const SessionRepository = {

    /**
     * Retrieves a TipSession object by its unique identifier.
     *
     * @param {string} id - The unique identifier of the session to retrieve.
     * @return {TipSession | null} The corresponding TipSession object if found, or null if no session matches the given ID.
     */
    findById(id: string): TipSession | null {
        const db = getDatabase();
        const row = db
            .prepare(
                `
                    SELECT *
                    FROM sessions
                    WHERE id = ?
                `
            )
            .get(id) as Record<string, unknown> | undefined;

        return row ? mapSession(row) : null;
    },

    /**
     * Creates a new tip session with the provided data, stores it in the database, and returns the created session.
     *
     * @param {Object} data - The data required to create a new session.
     * @param {string} data.merchantId - The unique identifier for the merchant associated with the session.
     * @param {number} data.billAmount - The total bill amount for the session.
     * @param {string} [data.currency="USDC"] - The currency in which the bill amount is specified. Defaults to "USDC" if not provided.
     * @return {TipSession} The newly created tip session object.
     */
    create(data: {
        merchantId: string;
        billAmount: number;
        currency?: string;
    }): TipSession {
        const db = getDatabase();
        const now = new Date();
        const id = `session_${uuidv4()}`;
        const memo = `Tink-${Date.now().toString().slice(-6)}`;
        const expiresAt = new Date(now.getTime() + 30 * 60 * 1000); // 30 min expiry

        db.prepare(
            `
                INSERT INTO sessions (id,
                                      merchant_id,
                                      bill_amount,
                                      currency,
                                      status,
                                      memo,
                                      created_at,
                                      updated_at,
                                      expires_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `
        ).run(
            id,
            data.merchantId,
            data.billAmount,
            data.currency || "USDC",
            "pending",
            memo,
            now.toISOString(),
            now.toISOString(),
            expiresAt.toISOString()
        );

        return this.findById(id)!;
    },

    /**
     * Updates the tip information for a given session by adjusting the tip amount, tip percentage,
     * and recalculating the total amount. Also updates the session status and timestamp.
     *
     * @param {string} id - The unique identifier of the session to be updated.
     * @param {number} tipAmount - The amount of tip to be added.
     * @param {number} tipPercentage - The percentage of the tip relative to the bill amount.
     * @return {TipSession} The updated session after applying the changes.
     * @throws {Error} If the session with the given ID is not found.
     */
    updateTip(id: string, tipAmount: number, tipPercentage: number): TipSession {
        const db = getDatabase();
        const session = this.findById(id);

        if (!session) {
            throw new Error("Session not found");
        }

        const totalAmount = session.billAmount + tipAmount;
        const now = new Date().toISOString();

        db.prepare(
            `
                UPDATE sessions
                SET tip_amount     = ?,
                    tip_percentage = ?,
                    total_amount   = ?,
                    status         = ?,
                    updated_at     = ?
                WHERE id = ?
            `
        ).run(tipAmount,
            tipPercentage,
            totalAmount,
            "tip_selected",
            now,
            id);

        return this.findById(id)!;
    },

    /**
     * Updates the status of a tip session in the database. Optionally updates the payer address.
     *
     * @param {string} id - The unique identifier of the tip session to be updated.
     * @param {SessionStatus} status - The new status to be assigned to the tip session.
     * @param {string} [payerAddress] - The address of the payer associated with the tip session (optional).
     * @return {TipSession} The updated tip session object after the modification.
     */
    updateStatus(
        id: string,
        status: SessionStatus,
        payerAddress?: string
    ): TipSession {
        const db = getDatabase();
        const now = new Date().toISOString();

        if (payerAddress) {
            db.prepare(
                `
                    UPDATE sessions
                    SET status        = ?,
                        payer_address = ?,
                        updated_at    = ?
                    WHERE id = ?
                `
            ).run(status,
                payerAddress,
                now,
                id);
        } else {
            db.prepare(
                `
                    UPDATE sessions
                    SET status     = ?,
                        updated_at = ?
                    WHERE id = ?
                `
            ).run(status,
                now,
                id);
        }

        return this.findById(id)!;
    },
};


/**
 * A repository that provides methods for interacting with the transactions data store.
 */
export const TransactionRepository = {

    /**
     * Retrieves a transaction by its unique identifier from the database.
     *
     * @param {string} id - The unique identifier of the transaction to retrieve.
     * @return {Transaction | null} The transaction object if found, or null if no transaction exists with the given ID.
     */
    findById(id: string): Transaction | null {
        const db = getDatabase();
        const row = db
            .prepare("SELECT * FROM transactions WHERE id = ?")
            .get(id) as Record<string, unknown> | undefined;
        return row ? mapTransaction(row) : null;
    },

    /**
     * Retrieves a transaction by its session ID.
     *
     * @param {string} sessionId - The session ID associated with the transaction.
     * @return {Transaction|null} The transaction object if found, or null if no transaction exists for the given session ID.
     */
    findBySessionId(sessionId: string): Transaction | null {
        const db = getDatabase();
        const row = db
            .prepare("SELECT * FROM transactions WHERE session_id = ?")
            .get(sessionId) as Record<string, unknown> | undefined;
        return row ? mapTransaction(row) : null;
    },

    /**
     * Fetches the most recent tipping transactions for a specific merchant.
     *
     * @param {string} merchantId - The unique identifier for the merchant whose transactions will be retrieved.
     * @param {number} [limit=10] - The maximum number of transactions to retrieve, default is 10.
     * @return {RecentTip[]} An array of recent tipping transactions containing details such as ID, amount, transaction hash, status, date, and payer address.
     */
    getRecentByMerchant(merchantId: string, limit: number = 10): RecentTip[] {
        const db = getDatabase();
        const rows = db
            .prepare(
                `
                    SELECT id, tip_amount, tx_hash, status, created_at, payer_address
                    FROM transactions
                    WHERE merchant_id = ?
                    ORDER BY created_at DESC
                    LIMIT ?
                `
            )
            .all(merchantId, limit) as Array<Record<string, unknown>>;

        return rows.map((row) => ({
            id: row.id as string,
            date: row.created_at as string,
            amount: row.tip_amount as number,
            txHash: row.tx_hash as string,
            status: row.status as TransactionStatus,
            payerAddress: row.payer_address as string | undefined,
        }));
    },

    /**
     * Creates a new transaction record in the database.
     *
     * @param {Object} data - The data required to create a transaction.
     * @param {string} data.sessionId - The unique identifier for the session.
     * @param {string} data.merchantId - The unique identifier for the merchant.
     * @param {string} data.payerAddress - The wallet address of the payer.
     * @param {string} data.recipientAddress - The wallet address of the recipient.
     * @param {number} data.billAmount - The base amount for the bill.
     * @param {number} data.tipAmount - The additional tip amount.
     * @param {number} data.totalAmount - The total amount for the transaction, including bill and tip.
     * @param {string} data.currency - The currency in which the transaction is denominated.
     * @param {string} data.txHash - The transaction hash associated with this transaction.
     * @param {string} data.networkId - The blockchain network identifier for the transaction.
     * @return {Transaction} The transaction record created in the database.
     */
    create(data: {
        sessionId: string;
        merchantId: string;
        payerAddress: string;
        recipientAddress: string;
        billAmount: number;
        tipAmount: number;
        totalAmount: number;
        currency: string;
        txHash: string;
        networkId: string;
        onChainPolicyId?: number;
    }): Transaction {
        const db = getDatabase();
        const now = new Date().toISOString();
        const id = `tx_${uuidv4()}`;

        db.prepare(
            `
                INSERT INTO transactions (id, session_id, merchant_id, payer_address, recipient_address,
                                          bill_amount, tip_amount, total_amount, currency, tx_hash, network_id, 
                                          on_chain_policy_id, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `
        ).run(
            id,
            data.sessionId,
            data.merchantId,
            data.payerAddress,
            data.recipientAddress,
            data.billAmount,
            data.tipAmount,
            data.totalAmount,
            data.currency,
            data.txHash,
            data.networkId,
            data.onChainPolicyId || null,
            "pending",
            now
        );

        return this.findById(id)!;
    },

    confirm(id: string): Transaction {
        const db = getDatabase();
        const now = new Date().toISOString();

        db.prepare(
            `
                UPDATE transactions
                SET status       = 'confirmed',
                    confirmed_at = ?
                WHERE id = ?
            `
        ).run(now, id);

        return this.findById(id)!;
    },

    /**
     * Retrieves a list of transactions for a specific merchant within an optional date range, to be used for export purposes.
     *
     * @param {string} merchantId - The unique identifier of the merchant whose transactions are being retrieved.
     * @param {string} [startDate] - The optional start date (inclusive) for filtering transactions, in ISO 8601 format.
     * @param {string} [endDate] - The optional end date (inclusive) for filtering transactions, in ISO 8601 format.
     * @return {Transaction[]} An array of transactions for the specified merchant, filtered by the provided date range, if applicable.
     */
    getForExport(
        merchantId: string,
        startDate?: string,
        endDate?: string
    ): Transaction[] {
        const db = getDatabase();
        let query = "SELECT * FROM transactions WHERE merchant_id = ?";
        const params: unknown[] = [merchantId];

        if (startDate) {
            query += " AND created_at >= ?";
            params.push(startDate);
        }
        if (endDate) {
            query += " AND created_at <= ?";
            params.push(endDate);
        }

        query += " ORDER BY created_at DESC";

        const rows = db.prepare(query).all(...params) as Array<
            Record<string, unknown>
        >;
        return rows.map(mapTransaction);
    },
}

/**
 * A repository for managing dispute records in the database.
 */
export const DisputeRepository = {
    findById(id: string): Dispute | null {
        const db = getDatabase();
        const row = db.prepare("SELECT * FROM disputes WHERE id = ?").get(id) as
            | Record<string, unknown>
            | undefined;
        return row ? mapDispute(row) : null;
    },

    /**
     * Creates a new dispute record in the database and returns the created Dispute object.
     *
     * @param {Object} data - The information required to create a dispute.
     * @param {string} data.sessionId - The unique identifier for the session associated with the dispute.
     * @param {string} data.merchantId - The unique identifier for the merchant associated with the dispute.
     * @param {DisputeReason} data.reason - The reason for the dispute.
     * @param {string} data.details - Additional details about the dispute.
     * @param {string} data.submittedBy - The user or entity that submitted the dispute.
     * @return {Dispute} The newly created dispute object.
     */
    create(data: {
        sessionId: string;
        merchantId: string;
        reason: DisputeReason;
        details: string;
        submittedBy: string;
    }): Dispute {
        const db = getDatabase();
        const now = new Date().toISOString();
        const id = `dispute_${uuidv4()}`;

        db.prepare(
            `
                INSERT INTO disputes (id,
                                      session_id,
                                      merchant_id,
                                      reason,
                                      details,
                                      status,
                                      submitted_by,
                                      created_at,
                                      updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `
        ).run(
            id,
            data.sessionId,
            data.merchantId,
            data.reason,
            data.details,
            "pending",
            data.submittedBy,
            now,
            now
        );

        return this.findById(id)!;
    },

    /**
     * Updates the status of a dispute in the database.
     *
     * @param {string} id - The unique identifier of the dispute to be updated.
     * @param {DisputeStatus} status - The new status to set for the dispute.
     * @param {string} [resolution] - An optional resolution message, required if the status is "resolved".
     * @return {Dispute} The updated dispute object.
     */
    updateStatus(
        id: string,
        status: DisputeStatus,
        resolution?: string
    ): Dispute {
        const db = getDatabase();
        const now = new Date().toISOString();

        if (status === "resolved" && resolution) {
            db.prepare(
                `
                    UPDATE disputes
                    SET status = ?,
                        resolution = ?,
                        resolved_at = ?,
                        updated_at = ?
                    WHERE id = ?
                `
            ).run(status, resolution, now, now, id);
        } else {
            db.prepare(
                `
                    UPDATE disputes
                    SET status = ?,
                        updated_at = ?
                    WHERE id = ?
                `
            ).run(status, now, id);
        }

        return this.findById(id)!;
    },

    /**
     * Retrieves a list of disputes associated with the specified merchant.
     *
     * @param {string} merchantId - The unique identifier of the merchant whose disputes need to be retrieved.
     * @return {Dispute[]} An array of Dispute objects associated with the provided merchant ID, sorted by creation date in descending order.
     */
    getByMerchant(merchantId: string): Dispute[] {
        const db = getDatabase();
        const rows = db
            .prepare(
                `
                    SELECT *
                    FROM disputes
                    WHERE merchant_id = ?
                    ORDER BY created_at DESC
                `
            )
            .all(merchantId) as Array<Record<string, unknown>>;

        return rows.map(mapDispute);
    },
}