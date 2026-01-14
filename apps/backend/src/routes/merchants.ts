import {ApiResponse, Merchant, MerchantStats, RecentTip, TipSplitConfig} from "../types";
import {MerchantRepository, TipSplitRepository, TransactionRepository} from "../db/models";
import {Router} from "express";

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
 *               $ref: '#/components/schemas/ApiResponse'
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
        const {id} = request.params;

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
 *               $ref: '#/components/schemas/ApiResponse'
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
        const {id} = request.params;

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
 *               $ref: '#/components/schemas/ApiResponse'
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
        const {id} = request.params;
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
        const {id} = request.params;
        const {startDate, endDate} = request.query;

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
            `attachment; filename="tips-${merchant.slug}-${
                new Date().toISOString().split("T")[0]
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
 *               $ref: '#/components/schemas/ApiResponse'
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
        const {id} = request.params;

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
 *               $ref: '#/components/schemas/ApiResponse'
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
router.put("/:id/split-config", (request, response) => {
    try {
        const {id} = request.params;
        const {splits} = request.body;

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

        return response.json({
            success: true,
            data: updatedConfig,
            message: "Split configuration updated successfully",
        } as ApiResponse<TipSplitConfig>);
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
 *               $ref: '#/components/schemas/ApiResponse'
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
        const {name, slug, walletAddress, avatar} = request.body;

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
            {name: "Front Of House", percentage: 60},
            {name: "Back Of House", percentage: 30},
            {name: "Bar", percentage: 10},
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

export default router;
