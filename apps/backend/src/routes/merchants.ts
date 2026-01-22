import {
    ApiResponse,
    Employee,
    Merchant,
    MerchantStats,
    RecentTip,
    TipAllocation,
    TipSplitConfig
} from "../types";
import {
    EmployeeRepository,
    MerchantRepository,
    TipAllocationRepository,
    TipSplitRepository,
    TransactionRepository
} from "../db/models";
import { Router } from "express";
import { ContractService } from "../services";

const router = Router();

/**
 * @swagger
 * /api/merchants/{id}:
 *   get:
 *     summary: Get merchant details by ID or slug
 *     tags: [Merchants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier or slug of the merchant
 *     responses:
 *       200:
 *         description: Merchant details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/Merchant' }
 *       404:
 *         description: Merchant not found
 */
/**
 * @route GET /api/merchants/:id
 * @desc Get merchant details by ID or slug
 * @access Public
 * @param {string} id - The unique identifier or slug of the merchant
 * @returns {ApiResponse<Merchant>}
 *
 * @example
 * // Sample Request
 * fetch('/api/merchants/merchant-slug')
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.get("/:id", (request, response) => {
    try {
        const { id } = request.params;

        // Try finding by ID first, then by slug
        let merchant = MerchantRepository.findById(id);

        if (!merchant) {
            merchant = MerchantRepository.findBySlug(id);
        }

        if (!merchant) {
            return response.status(404).json({
                success: false,
                error: "Merchant not found",
            } as ApiResponse<null>);
        }

        return response.json({
            success: true,
            data: merchant,
        } as ApiResponse<Merchant>);
    } catch (error) {
        console.error("Error fetching merchant:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to fetch merchant",
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/merchants/{id}/stats:
 *   get:
 *     summary: Get merchant dashboard statistics
 *     tags: [Merchants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier or slug of the merchant
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/MerchantStats' }
 *       404:
 *         description: Merchant not found
 */
/**
 * @route GET /api/merchants/:id/stats
 * @desc Get merchant dashboard statistics
 * @access Public
 * @param {string} id - The unique identifier or slug of the merchant
 * @returns {ApiResponse<MerchantStats>}
 *
 * @example
 * // Sample Request
 * fetch('/api/merchants/merchant-slug/stats')
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.get("/:id/stats", (request, response) => {
    try {
        const { id } = request.params;

        let merchant = MerchantRepository.findById(id);
        if (!merchant) {
            merchant = MerchantRepository.findBySlug(id);
        }

        if (!merchant) {
            return response.status(404).json({
                success: false,
                error: "Merchant not found",
            } as ApiResponse<null>);
        }

        const stats = MerchantRepository.getStats(merchant.id);

        return response.json({
            success: true,
            data: stats,
        } as ApiResponse<MerchantStats>);
    } catch (error) {
        console.error("Error fetching merchant stats:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to fetch stats",
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/merchants/{id}/tips:
 *   get:
 *     summary: Get recent tips for a merchant
 *     tags: [Merchants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier or slug of the merchant
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of tips to retrieve
 *     responses:
 *       200:
 *         description: Recent tips retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/RecentTip' }
 *       404:
 *         description: Merchant not found
 */
/**
 * @route GET /api/merchants/:id/tips
 * @desc Get recent tips for a merchant
 * @access Public
 * @param {string} id - The unique identifier or slug of the merchant
 * @param {number} [limit=10] - Number of tips to retrieve (query parameter)
 * @returns {ApiResponse<RecentTip[]>}
 *
 * @example
 * // Sample Request
 * fetch('/api/merchants/merchant-slug/tips?limit=5')
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.get("/:id/tips", (request, response) => {
    try {
        const { id } = request.params;
        const limit = parseInt(request.query.limit as string) || 10;

        let merchant = MerchantRepository.findById(id);
        if (!merchant) {
            merchant = MerchantRepository.findBySlug(id);
        }

        if (!merchant) {
            return response.status(404).json({
                success: false,
                error: "Merchant not found",
            } as ApiResponse<null>);
        }

        const tips = TransactionRepository.getRecentByMerchant(merchant.id, limit);

        return response.json({
            success: true,
            data: tips,
        } as ApiResponse<RecentTip[]>);
    } catch (error) {
        console.error("Error fetching tips:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to fetch tips",
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/merchants/{id}/tips/export:
 *   get:
 *     summary: Export merchant tips as a CSV file
 *     tags: [Merchants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier or slug of the merchant
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for filter (ISO string)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for filter (ISO string)
 *     responses:
 *       200:
 *         description: CSV file content
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *       404:
 *         description: Merchant not found
 */
/**
 * @route GET /api/merchants/:id/tips/export
 * @desc Export merchant tips as a CSV file
 * @access Public
 * @param {string} id - The unique identifier or slug of the merchant
 * @param {string} [startDate] - Start date for filter (ISO string, query parameter)
 * @param {string} [endDate] - End date for filter (ISO string, query parameter)
 * @returns {string} CSV file content
 *
 * @example
 * // Sample Request
 * window.location.href = '/api/merchants/merchant-slug/tips/export?startDate=2024-01-01';
 */
router.get("/:id/tips/export", (request, response) => {
    try {
        const { id } = request.params;
        const { startDate, endDate } = request.query;

        let merchant = MerchantRepository.findById(id);
        if (!merchant) {
            merchant = MerchantRepository.findBySlug(id);
        }

        if (!merchant) {
            return response.status(404).json({
                success: false,
                error: "Merchant not found",
            } as ApiResponse<null>);
        }

        const transactions = TransactionRepository.getForExport(
            merchant.id,
            startDate as string | undefined,
            endDate as string | undefined
        );

        // Generate CSV
        const headers = [
            "Date",
            "Bill Amount",
            "Tip Amount",
            "Total",
            "Tx Hash",
            "Status",
        ];
        const rows = transactions.map((tx) => [
            tx.createdAt,
            tx.billAmount.toFixed(2),
            tx.tipAmount.toFixed(2),
            tx.totalAmount.toFixed(2),
            tx.txHash,
            tx.status,
        ]);

        const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
            "\n"
        );

        response.setHeader("Content-Type", "text/csv");
        response.setHeader(
            "Content-Disposition",
            `attachment; filename="tips-${merchant.slug}-${new Date().toISOString().split("T")[0]
            }.csv"`
        );

        return response.send(csv);
    } catch (error) {
        console.error("Error exporting tips:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to export tips",
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/merchants/{id}/split-config:
 *   get:
 *     summary: Get the tip split configuration for a merchant
 *     tags: [Merchants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier or slug of the merchant
 *     responses:
 *       200:
 *         description: Tip split configuration retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/TipSplitConfig' }
 *       404:
 *         description: Merchant not found
 */
/**
 * @route GET /api/merchants/:id/split-config
 * @desc Get the tip split configuration for a merchant
 * @access Public
 * @param {string} id - The unique identifier or slug of the merchant
 * @returns {ApiResponse<TipSplitConfig>}
 *
 * @example
 * // Sample Request
 * fetch('/api/merchants/merchant-slug/split-config')
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.get("/:id/split-config", (request, response) => {
    try {
        const { id } = request.params;

        let merchant = MerchantRepository.findById(id);
        if (!merchant) {
            merchant = MerchantRepository.findBySlug(id);
        }

        if (!merchant) {
            return response.status(404).json({
                success: false,
                error: "Merchant not found",
            } as ApiResponse<null>);
        }

        const splitConfig = TipSplitRepository.getByMerchantId(merchant.id);

        return response.json({
            success: true,
            data: splitConfig,
        } as ApiResponse<TipSplitConfig>);
    } catch (error) {
        console.error("Error fetching split config:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to fetch split configuration",
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/merchants/{id}/split-config:
 *   put:
 *     summary: Update the tip split configuration for a merchant
 *     tags: [Merchants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier or slug of the merchant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - splits
 *             properties:
 *               splits:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     percentage:
 *                       type: number
 *     responses:
 *       200:
 *         description: Tip split configuration updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/TipSplitConfig' }
 *       400:
 *         description: Invalid split configuration
 *       404:
 *         description: Merchant not found
 */
/**
 * @route PUT /api/merchants/:id/split-config
 * @desc Update the tip split configuration for a merchant
 * @access Public
 * @param {string} id - The unique identifier or slug of the merchant
 * @body {Array<{name: string, percentage: number}>} splits - Array of split configurations (must sum to 100%)
 * @returns {ApiResponse<TipSplitConfig>}
 *
 * @example
 * // Sample Request
 * fetch('/api/merchants/merchant-slug/split-config', {
 *   method: 'PUT',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     splits: [
 *       { name: "Staff", percentage: 80 },
 *       { name: "Charity", percentage: 20 }
 *     ]
 *   })
 * })
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.put("/:id/split-config", async (request, response) => {
    try {
        const { id } = request.params;
        const { splits } = request.body;

        let merchant = MerchantRepository.findById(id);
        if (!merchant) {
            merchant = MerchantRepository.findBySlug(id);
        }

        if (!merchant) {
            return response.status(404).json({
                success: false,
                error: "Merchant not found",
            } as ApiResponse<null>);
        }

        // Validate splits sum to 100%
        const totalPercentage = splits.reduce(
            (sum: number, split: { percentage: number }) => sum + split.percentage,
            0
        );

        if (Math.abs(totalPercentage - 100) > 0.01) {
            return response.status(400).json({
                success: false,
                error: "Split percentages must sum to 100%",
            } as ApiResponse<null>);
        }

        const updatedConfig = TipSplitRepository.update(merchant.id, splits);

        // Sync with Web3 if possible
        try {
            const { recipients, percentages } = ContractService.preparePolicyData(
                updatedConfig.splits,
                merchant.walletAddress
            );

            // This invokes the Web3 contract to create/update the distribution policy
            const onChainPolicyId = await ContractService.syncPolicyOnChain(recipients, percentages);

            // Store the on-chain reference
            MerchantRepository.updateOnChainPolicyId(merchant.id, onChainPolicyId);

            return response.json({
                success: true,
                data: {
                    ...updatedConfig,
                    onChainPolicyId
                },
                message: "Split configuration updated and synced on-chain",
            } as ApiResponse<TipSplitConfig & { onChainPolicyId: number }>);
        } catch (web3Error) {
            console.warn("Failed to sync policy on-chain, but off-chain update succeeded:", web3Error);

            return response.json({
                success: true,
                data: updatedConfig,
                message: "Split configuration updated successfully (on-chain sync skipped/failed)",
            } as ApiResponse<TipSplitConfig>);
        }
    } catch (error) {
        console.error("Error updating split config:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to update split configuration",
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/merchants:
 *   post:
 *     summary: Create a new merchant
 *     tags: [Merchants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *               - walletAddress
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               walletAddress:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       201:
 *         description: Merchant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/Merchant' }
 *       400:
 *         description: Slug already taken or invalid data
 */
/**
 * @route POST /api/merchants
 * @desc Create a new merchant
 * @access Public
 * @body {string} name - The merchant's display name
 * @body {string} slug - Unique URL-friendly identifier for the merchant
 * @body {string} walletAddress - Blockchain wallet address for receiving payments
 * @body {string} [avatar] - URL to the merchant's avatar image
 * @returns {ApiResponse<Merchant>}
 *
 * @example
 * // Sample Request
 * fetch('/api/merchants', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     name: 'New Merchant',
 *     slug: 'new-merchant',
 *     walletAddress: '0x123...',
 *     avatar: 'https://example.com/avatar.png'
 *   })
 * })
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.post("/", (request, response) => {
    try {
        const { name, slug, walletAddress, avatar } = request.body;

        if (!name || !slug || !walletAddress) {
            return response.status(400).json({
                success: false,
                error: "Name, slug, and walletAddress are required",
            } as ApiResponse<null>);
        }

        // Check if slug already exists
        const existing = MerchantRepository.findBySlug(slug);
        if (existing) {
            return response.status(409).json({
                success: false,
                error: "Merchant with this slug already exists",
            } as ApiResponse<null>);
        }

        const merchant = MerchantRepository.create({
            name,
            slug,
            walletAddress,
            avatar,
        });

        // Create default tip splits
        TipSplitRepository.update(merchant.id, [
            { name: "Front Of House", percentage: 60 },
            { name: "Back Of House", percentage: 30 },
            { name: "Bar", percentage: 10 },
        ]);

        return response.status(201).json({
            success: true,
            data: merchant,
            message: "Merchant created successfully",
        } as ApiResponse<Merchant>);
    } catch (error) {
        console.error("Error creating merchant:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to create merchant",
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/merchants/{id}/employees:
 *   get:
 *     summary: Get all employees for a merchant
 *     tags: [Merchants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier or slug of the merchant
 *     responses:
 *       200:
 *         description: Employees retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Employee' }
 */
/**
 * @route GET /api/merchants/:id/employees
 * @desc Get all employees for a merchant
 * @access Public
 */
router.get("/:id/employees", (request, response) => {
    try {
        const { id } = request.params;

        let merchant = MerchantRepository.findById(id);
        if (!merchant) {
            merchant = MerchantRepository.findBySlug(id);
        }

        if (!merchant) {
            return response.status(404).json({
                success: false,
                error: "Merchant not found",
            } as ApiResponse<null>);
        }

        const employees = EmployeeRepository.getByMerchantId(merchant.id);

        return response.json({
            success: true,
            data: employees,
        } as ApiResponse<Employee[]>);
    } catch (error) {
        return response.status(500).json({
            success: false,
            error: "Failed to fetch employees",
        } as ApiResponse<null>);
    }
});

/**
 * @route GET /api/merchants/:id/staff-stats
 * @desc Get employees with their earnings statistics
 */
router.get("/:id/staff-stats", (request, response) => {
    try {
        const { id } = request.params;
        let merchant = MerchantRepository.findById(id);
        if (!merchant) merchant = MerchantRepository.findBySlug(id);

        if (!merchant) {
            return response.status(404).json({ success: false, error: "Merchant not found" });
        }

        const staff = EmployeeRepository.getWithStats(merchant.id);
        return response.json({ success: true, data: staff });
    } catch (error) {
        console.error("Error fetching staff stats:", error);
        return response.status(500).json({ success: false, error: "Failed to fetch staff stats" });
    }
});

/**
 * @route POST /api/merchants/:id/payout
 * @desc Trigger a payout for a specific employee
 */
import { payoutEmployee } from "../services/blockchain";

router.post("/:id/payout", async (request, response) => {
    try {
        const { id } = request.params;
        const { employeeId, amount } = request.body;

        let merchant = MerchantRepository.findById(id);
        if (!merchant) merchant = MerchantRepository.findBySlug(id);
        if (!merchant) return response.status(404).json({ success: false, error: "Merchant not found" });

        const employee = EmployeeRepository.findById(employeeId);
        if (!employee) return response.status(404).json({ success: false, error: "Employee not found" });

        // Trigger Blockchain Payout
        const result = await payoutEmployee(employee.walletAddress, amount);

        if (result.success) {
            // Update DB Records
            TipAllocationRepository.markDistributed(employee.id);

            return response.json({
                success: true,
                data: {
                    txHash: result.txHash,
                    amount: result.amount,
                    status: 'confirmed'
                }
            });
        } else {
            return response.status(500).json({ success: false, error: "Blockchain transaction failed" });
        }

    } catch (error) {
        console.error("Payout error:", error);
        return response.status(500).json({ success: false, error: "Payout failed" });
    }
});

// ... (previous routes)

/**
 * @route GET /api/merchants/:id/employees/:employeeId/payouts
 * @desc Get payout history for a specific employee
 */
router.get("/:id/employees/:employeeId/payouts", (request, response) => {
    try {
        const { id, employeeId } = request.params;
        const limit = parseInt(request.query.limit as string) || 20;

        let merchant = MerchantRepository.findById(id);
        if (!merchant) merchant = MerchantRepository.findBySlug(id);
        if (!merchant) return response.status(404).json({ success: false, error: "Merchant not found" });

        const payouts = TipAllocationRepository.getByEmployeeId(employeeId, limit);

        return response.json({
            success: true,
            data: payouts,
        });
    } catch (error) {
        console.error("Error fetching employee payouts:", error);
        return response.status(500).json({ success: false, error: "Failed to fetch payouts" });
    }
});

/**
 * @swagger
 * /api/merchants/{id}/employees:
 *   post:
 *     summary: Add a new employee to a merchant
 *     tags: [Merchants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier or slug of the merchant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - walletAddress
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               walletAddress:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Employee added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/Employee' }
 */
/**
 * @route POST /api/merchants/:id/employees
 * @desc Add a new employee to a merchant
 * @access Public
 */
router.post("/:id/employees", (request, response) => {
    try {
        const { id } = request.params;
        const { name, walletAddress, role } = request.body;

        if (!name || !walletAddress || !role) {
            return response.status(400).json({
                success: false,
                error: "Name, walletAddress, and role are required",
            } as ApiResponse<null>);
        }

        let merchant = MerchantRepository.findById(id);
        if (!merchant) {
            merchant = MerchantRepository.findBySlug(id);
        }

        if (!merchant) {
            return response.status(404).json({
                success: false,
                error: "Merchant not found",
            } as ApiResponse<null>);
        }

        const employee = EmployeeRepository.create({
            merchantId: merchant.id,
            name,
            walletAddress,
            role,
            status: 'active'
        });

        return response.status(201).json({
            success: true,
            data: employee,
            message: "Employee added successfully",
        } as ApiResponse<Employee>);
    } catch (error) {
        return response.status(500).json({
            success: false,
            error: "Failed to add employee",
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/merchants/{id}/allocations:
 *   get:
 *     summary: Get verifiable tip allocation records for a merchant
 *     tags: [Merchants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier or slug of the merchant
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of allocations to retrieve
 *     responses:
 *       200:
 *         description: Allocations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/TipAllocation' }
 */
/**
 * @route GET /api/merchants/:id/allocations
 * @desc Get verifiable tip allocation records for a merchant
 * @access Public
 */
router.get("/:id/allocations", (request, response) => {
    try {
        const { id } = request.params;
        const limit = request.query.limit ? parseInt(request.query.limit as string) : 50;

        let merchant = MerchantRepository.findById(id);
        if (!merchant) {
            merchant = MerchantRepository.findBySlug(id);
        }

        if (!merchant) {
            return response.status(404).json({
                success: false,
                error: "Merchant not found",
            } as ApiResponse<null>);
        }

        const allocations = TipAllocationRepository.getByMerchantId(merchant.id, limit);

        return response.json({
            success: true,
            data: allocations,
        } as ApiResponse<TipAllocation[]>);
    } catch (error) {
        return response.status(500).json({
            success: false,
            error: "Failed to fetch allocations",
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/merchants/employees/{id}/allocations:
 *   get:
 *     summary: Get verifiable tip allocation records for a specific employee
 *     tags: [Merchants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the employee
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of allocations to retrieve
 *     responses:
 *       200:
 *         description: Employee allocations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/TipAllocation' }
 */
/**
 * @route GET /api/merchants/employees/:id/allocations
 * @desc Get verifiable tip allocation records for a specific employee
 * @access Public
 */
router.get("/employees/:id/allocations", (request, response) => {
    try {
        const { id } = request.params;
        const limit = request.query.limit ? parseInt(request.query.limit as string) : 50;

        const allocations = TipAllocationRepository.getByEmployeeId(id, limit);

        return response.json({
            success: true,
            data: allocations,
        } as ApiResponse<TipAllocation[]>);
    } catch (error) {
        return response.status(500).json({
            success: false,
            error: "Failed to fetch employee allocations",
        } as ApiResponse<null>);
    }
});

export default router;
