import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

let db: Database.Database | null = null;

/**
 * Retrieves the singleton instance of the database.
 * If the database has not been initialized, it seeds and initializes the database.
 *
 * @return {Database.Database} The initialized database instance.
 */
export function getDatabase(): Database.Database {
    if (!db) {
        db = seedDatabase();
    }
    return db;
}

/**
 * Seeds the database by initializing it, creating tables, indexes, and populating with data if necessary.
 * Ensures the database directory exists and creates it if it doesn't.
 * Configures the database with appropriate settings such as Write-Ahead Logging (WAL).
 *
 * @return {Database.Database} A reference to the initialized and seeded database instance.
 */
function seedDatabase(): Database.Database {
    const dbPath = process.env.DATABASE_PATH || "./data/weep.db";
    const dbDirectory = path.dirname(dbPath);

    // checking if the directory exists
    if (!fs.existsSync(dbDirectory)) {
        fs.mkdirSync(dbDirectory, { recursive: true });
    }

    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");

    // initialize the tables
    initializeTables(db);
    migrateSchema(db);
    createIndexes(db);
    seedData(db);

    return db;
}

/**
 * Initializes the necessary tables in the given database by creating
 * merchant, tip split, session, transaction, and dispute tables.
 *
 * @param {Database.Database} db - The database instance where tables will be created.
 * @return {void} No return value.
 */
function initializeTables(db: Database.Database): void {
    createMerchantTable(db);
    createEmployeeTable(db);
    createTipSplitTable(db);
    createSessionTable(db);
    createTransactionTable(db);
    createTipAllocationTable(db);
    createDisputeTable(db);
}

/**
 * Creates necessary indexes on various database tables to improve query performance.
 *
 * @param {Database.Database} db - The database instance on which the indexes will be created.
 * @return {void} This function does not return anything.
 */
function createIndexes(db: Database.Database): void {
    db.exec(`
        CREATE INDEX IF NOT EXISTS idx_sessions_merchant ON sessions (merchant_id);
        CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions (status);
        CREATE INDEX IF NOT EXISTS idx_transactions_merchant ON transactions (merchant_id);
        CREATE INDEX IF NOT EXISTS idx_transactions_session ON transactions (session_id);
        CREATE INDEX IF NOT EXISTS idx_employees_merchant ON employees (merchant_id);
        CREATE INDEX IF NOT EXISTS idx_tip_allocations_transaction ON tip_allocations (transaction_id);
        CREATE INDEX IF NOT EXISTS idx_tip_allocations_merchant ON tip_allocations (merchant_id);
        CREATE INDEX IF NOT EXISTS idx_disputes_merchant ON disputes (merchant_id);
        CREATE INDEX IF NOT EXISTS idx_disputes_session ON disputes (session_id);
    `);
}

/**
 * Seeds initial demo data into the provided database. This includes inserting a demo merchant,
 * associated tip splits, and sample transactions for visualization or testing purposes. The method
 * checks if the demo merchant already exists before inserting data to avoid duplication.
 *
 * @param {Database.Database} db - The database instance to seed data into.
 * @return {void} This method does not return any value.
 */
function seedData(db: Database.Database): void {
    const existingMerchant = db
        .prepare("SELECT id FROM merchants WHERE slug = ?")
        .get("demo-cafe");

    if (!existingMerchant) {
        const now = new Date().toISOString();

        // Insert demo merchant
        db.prepare(
            `
                INSERT INTO merchants (id,
                                       name,
                                       slug,
                                       wallet_address,
                                       avatar,
                                       created_at,
                                       updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `
        ).run(
            "merchant_demo_cafe",
            "Demo Cafe",
            "demo-cafe",
            "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", // Example address
            null,
            now,
            now
        );

        // Insert default tip splits
        const splits = [
            { name: "Front Of House", percentage: 60 },
            { name: "Back Of House", percentage: 30 },
            { name: "Bar", percentage: 10 },
        ];

        const insertSplit = db.prepare(`
            INSERT INTO tip_splits (id,
                                    merchant_id,
                                    name,
                                    percentage,
                                    wallet_address,
                                    created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        splits.forEach((split, index) => {
            insertSplit.run(
                `split_demo_${index}`,
                "merchant_demo_cafe",
                split.name,
                split.percentage,
                null,
                now
            );
        });

        // Insert some sample transactions for dashboard demo
        const sampleTxs = [
            { amount: 2.5, date: "2025-12-07" },
            { amount: 5.0, date: "2025-12-06" },
        ];

        const insertTx = db.prepare(`
            INSERT INTO transactions (id,
                                      session_id,
                                      merchant_id,
                                      payer_address,
                                      recipient_address,
                                      bill_amount,
                                      tip_amount,
                                      total_amount,
                                      currency,
                                      tx_hash,
                                      network_id,
                                      status,
                                      created_at,
                                      confirmed_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        sampleTxs.forEach((tx, index) => {
            const sessionId = `session_sample_${index}`;

            // Create session first
            db.prepare(
                `
                    INSERT INTO sessions (id,
                                          merchant_id,
                                          bill_amount,
                                          tip_amount,
                                          total_amount,
                                          currency,
                                          status,
                                          memo,
                                          payer_address,
                                          created_at,
                                          updated_at,
                                          expires_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `
            ).run(
                sessionId,
                "merchant_demo_cafe",
                10.0,
                tx.amount,
                10.0 + tx.amount,
                "USDC",
                "confirmed",
                `Tink-${100000 + index}`,
                "0x742d35Cc6634C0532925a3b844Bc9e7595f",
                tx.date + "T12:00:00Z",
                tx.date + "T12:00:00Z",
                tx.date + "T12:30:00Z"
            );

            insertTx.run(
                `tx_sample_${index}`,
                sessionId,
                "merchant_demo_cafe",
                "0x742d35Cc6634C0532925a3b844Bc9e7595f",
                "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
                10.0,
                tx.amount,
                10.0 + tx.amount,
                "USDC",
                `0x123${index}...abc`,
                "avalanche-fuji",
                "confirmed",
                tx.date + "T12:00:00Z",
                tx.date + "T12:01:00Z"
            );
        });

        console.log("✅ Demo data seeded successfully");

        // Seed some demo employees
        const demoEmployees = [
            { name: "Alice Johnson", role: "Front Of House", wallet: "0x1111111111111111111111111111111111111111" },
            { name: "Bob Smith", role: "Back Of House", wallet: "0x2222222222222222222222222222222222222222" },
            { name: "Charlie Davis", role: "Bar", wallet: "0x3333333333333333333333333333333333333333" },
        ];

        const insertEmployee = db.prepare(`
            INSERT INTO employees (id, merchant_id, name, wallet_address, role, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        demoEmployees.forEach((emp, index) => {
            insertEmployee.run(
                `employee_demo_${index}`,
                "merchant_demo_cafe",
                emp.name,
                emp.wallet,
                emp.role,
                "active",
                now,
                now
            );
        });

        // Update tip splits to use these employees
        db.prepare("UPDATE tip_splits SET employee_id = ?, wallet_address = ? WHERE merchant_id = ? AND name = ?")
            .run("employee_demo_0", demoEmployees[0].wallet, "merchant_demo_cafe", "Front Of House");
        db.prepare("UPDATE tip_splits SET employee_id = ?, wallet_address = ? WHERE merchant_id = ? AND name = ?")
            .run("employee_demo_1", demoEmployees[1].wallet, "merchant_demo_cafe", "Back Of House");
        db.prepare("UPDATE tip_splits SET employee_id = ?, wallet_address = ? WHERE merchant_id = ? AND name = ?")
            .run("employee_demo_2", demoEmployees[2].wallet, "merchant_demo_cafe", "Bar");
    }
}

/**
 * Creates the `merchants` table in the provided database if it does not already exist.
 *
 * @param {Database.Database} db - The database instance where the table will be created.
 * @return {void} Does not return any value.
 */
function createMerchantTable(db: Database.Database): void {
    db.exec(`
        CREATE TABLE IF NOT EXISTS merchants
        (
            id                 TEXT PRIMARY KEY,
            name               TEXT        NOT NULL,
            slug               TEXT UNIQUE NOT NULL,
            wallet_address     TEXT        NOT NULL,
            avatar             TEXT,
            on_chain_policy_id INTEGER,
            created_at         TEXT        NOT NULL,
            updated_at         TEXT        NOT NULL
        )
    `);
}

/**
 * Creates the `tip_splits` table in the database if it does not already exist.
 *
 * @param {Database.Database} db - The database connection object used to execute the table creation command.
 * @return {void} Does not return a value.
 */
function createTipSplitTable(db: Database.Database): void {
    db.exec(`
        CREATE TABLE IF NOT EXISTS tip_splits
        (
            id             TEXT PRIMARY KEY,
            merchant_id    TEXT NOT NULL,
            name           TEXT NOT NULL,
            percentage     REAL NOT NULL,
            wallet_address TEXT,
            employee_id    TEXT,
            created_at     TEXT NOT NULL,
            FOREIGN KEY (merchant_id) REFERENCES merchants (id),
            FOREIGN KEY (employee_id) REFERENCES employees (id)
        )
    `);
}

/**
 * Creates the `sessions` table in the database if it does not already exist.
 * The table is used to store session information for transactions, including
 * details such as merchant ID, amounts, status, and timestamps.
 *
 * @param {Database.Database} db - The database connection object used to execute the SQL statement.
 * @return {void} This function does not return a value.
 */
function createSessionTable(db: Database.Database): void {
    db.exec(`
        CREATE TABLE IF NOT EXISTS sessions
        (
            id             TEXT PRIMARY KEY,
            merchant_id    TEXT NOT NULL,
            bill_amount    REAL NOT NULL,
            tip_amount     REAL,
            tip_percentage REAL,
            total_amount   REAL,
            currency       TEXT NOT NULL DEFAULT 'USDC',
            status         TEXT NOT NULL DEFAULT 'pending',
            memo           TEXT NOT NULL,
            payer_address  TEXT,
            created_at     TEXT NOT NULL,
            updated_at     TEXT NOT NULL,
            expires_at     TEXT NOT NULL,
            FOREIGN KEY (merchant_id) REFERENCES merchants (id)
        )
    `);
}

/**
 * Creates the `transactions` table in the database if it does not already exist.
 * The table includes details about financial transactions, such as amounts, currency, and status.
 *
 * @param {Database.Database} db - The database connection used to execute the SQL statement.
 * @return {void} This method does not return any value.
 */
function createTransactionTable(db: Database.Database): void {
    db.exec(`
        CREATE TABLE IF NOT EXISTS transactions
        (
            id                TEXT PRIMARY KEY,
            session_id        TEXT NOT NULL,
            merchant_id       TEXT NOT NULL,
            payer_address     TEXT NOT NULL,
            recipient_address TEXT NOT NULL,
            bill_amount       REAL NOT NULL,
            tip_amount        REAL NOT NULL,
            total_amount      REAL NOT NULL,
            currency          TEXT NOT NULL DEFAULT 'USDC',
            tx_hash           TEXT NOT NULL,
            network_id        TEXT NOT NULL,
            on_chain_policy_id INTEGER,
            status            TEXT NOT NULL DEFAULT 'pending',
            created_at        TEXT NOT NULL,
            confirmed_at      TEXT,
            FOREIGN KEY (session_id) REFERENCES sessions (id),
            FOREIGN KEY (merchant_id) REFERENCES merchants (id)
        )
    `);
}

/**
 * Creates the `disputes` table in the database if it does not already exist.
 *
 * The table contains the following columns:
 * - `id`: The primary key for the dispute (unique identifier).
 * - `session_id`: The ID of the associated session (foreign key reference).
 * - `merchant_id`: The ID of the associated merchant (foreign key reference).
 * - `reason`: The reason for the dispute.
 * - `details`: Detailed information about the dispute.
 * - `status`: The current status of the dispute (default is 'pending').
 * - `submitted_by`: The identifier of the user who submitted the dispute.
 * - `created_at`: The timestamp when the dispute was created.
 * - `updated_at`: The timestamp when the dispute was last updated.
 * - `resolved_at`: The timestamp when the dispute was resolved (nullable).
 * - `resolution`: The resolution details of the dispute (nullable).
 *
 * @param {Database.Database} db - The database connection used to create the table.
 * @return {void}
 */
function createDisputeTable(db: Database.Database): void {
    db.exec(`
        CREATE TABLE IF NOT EXISTS disputes
        (
            id           TEXT PRIMARY KEY,
            session_id   TEXT NOT NULL,
            merchant_id  TEXT NOT NULL,
            reason       TEXT NOT NULL,
            details      TEXT NOT NULL,
            status       TEXT NOT NULL DEFAULT 'pending',
            submitted_by TEXT NOT NULL,
            created_at   TEXT NOT NULL,
            updated_at   TEXT NOT NULL,
            resolved_at  TEXT,
            resolution   TEXT,
            FOREIGN KEY (session_id) REFERENCES sessions (id),
            FOREIGN KEY (merchant_id) REFERENCES merchants (id)
        )
    `);
}

/**
 * Creates the `employees` table in the database if it does not already exist.
 *
 * @param {Database.Database} db - The database instance where the table will be created.
 * @return {void}
 */
function createEmployeeTable(db: Database.Database): void {
    db.exec(`
        CREATE TABLE IF NOT EXISTS employees
        (
            id             TEXT PRIMARY KEY,
            merchant_id    TEXT NOT NULL,
            name           TEXT NOT NULL,
            wallet_address TEXT NOT NULL,
            role           TEXT NOT NULL,
            status         TEXT NOT NULL DEFAULT 'active',
            created_at     TEXT NOT NULL,
            updated_at     TEXT NOT NULL,
            FOREIGN KEY (merchant_id) REFERENCES merchants (id)
        )
    `);
}

/**
 * Creates the `tip_allocations` table in the database if it does not already exist.
 * This table stores verifiable records of how tips were allocated to employees/categories.
 *
 * @param {Database.Database} db - The database instance where the table will be created.
 * @return {void}
 */
function createTipAllocationTable(db: Database.Database): void {
    db.exec(`
        CREATE TABLE IF NOT EXISTS tip_allocations
        (
            id               TEXT PRIMARY KEY,
            transaction_id   TEXT NOT NULL,
            merchant_id      TEXT NOT NULL,
            employee_id      TEXT,
            recipient_name   TEXT NOT NULL,
            recipient_wallet TEXT NOT NULL,
            amount           REAL NOT NULL,
            percentage       REAL NOT NULL,
            status           TEXT NOT NULL DEFAULT 'pending',
            created_at       TEXT NOT NULL,
            FOREIGN KEY (transaction_id) REFERENCES transactions (id),
            FOREIGN KEY (merchant_id) REFERENCES merchants (id),
            FOREIGN KEY (employee_id) REFERENCES employees (id)
        )
    `);
}

/**
 * Migrates the database schema to ensure all expected columns exist.
 * This handles cases where the database file exists but the schema has evolved.
 */
function migrateSchema(db: Database.Database): void {
    try {
        // Check merchants table
        const merchantColumns = db.prepare("PRAGMA table_info(merchants)").all() as any[];
        const hasPolicyId = merchantColumns.some(c => c.name === 'on_chain_policy_id');
        if (!hasPolicyId) {
            console.log("Migrating schema: Adding on_chain_policy_id to merchants");
            db.prepare("ALTER TABLE merchants ADD COLUMN on_chain_policy_id INTEGER").run();
        }

        // Check transactions table
        const txColumns = db.prepare("PRAGMA table_info(transactions)").all() as any[];
        const hasTxPolicyId = txColumns.some(c => c.name === 'on_chain_policy_id');
        if (!hasTxPolicyId) {
            console.log("Migrating schema: Adding on_chain_policy_id to transactions");
            db.prepare("ALTER TABLE transactions ADD COLUMN on_chain_policy_id INTEGER").run();
        }

        // Check tip_splits table
        const splitColumns = db.prepare("PRAGMA table_info(tip_splits)").all() as any[];
        const hasEmployeeId = splitColumns.some(c => c.name === 'employee_id');
        if (!hasEmployeeId) {
            console.log("Migrating schema: Adding employee_id to tip_splits");
            db.prepare("ALTER TABLE tip_splits ADD COLUMN employee_id TEXT").run();
        }
    } catch (error) {
        console.error("Schema migration failed:", error);
    }
}

