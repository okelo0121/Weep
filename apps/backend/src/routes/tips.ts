import {Router} from "express";
import {AISuggestion, ApiResponse, TipCalculation} from "../types";
import {calculateTipOptions, getAISuggestion, getMerchantTipSplit} from "../services";

const router = Router();

/**
 * @swagger
 * /api/tips/calculate:
 *   post:
 *     summary: Calculate standard tip options for a given bill amount
 *     tags: [Tips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - billAmount
 *             properties:
 *               billAmount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Tip options calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/TipCalculation' }
 */
/**
 * @route POST /api/tips/calculate
 * @desc Calculate standard tip options for a given bill amount
 * @access Public
 * @body {number} billAmount - The total bill amount to calculate tips for
 * @returns {ApiResponse<TipCalculation>}
 *
 * @example
 * // Sample Request
 * fetch('/api/tips/calculate', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ billAmount: 85.50 })
 * })
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.post("/calculate", (request, response) => {
    try {
        const {billAmount} = request.body;

        if (!billAmount || billAmount <= 0) {
            return response.status(400).json({
                success: false,
                error: "Valid billAmount is required",
            } as ApiResponse<null>);
        }

        const result = calculateTipOptions(billAmount);

        return response.json({
            success: true,
            data: {
                billAmount,
                options: result.options,
                roundUp: result.roundUp,
            },
        } as ApiResponse<TipCalculation>);
    } catch (error) {
        console.error("Error calculating tips:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to calculate tips",
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/tips/ai-suggestion:
 *   post:
 *     summary: Get an AI-powered personalized tip suggestion
 *     tags: [Tips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - billAmount
 *             properties:
 *               billAmount:
 *                 type: number
 *               merchantId:
 *                 type: string
 *               context:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI suggestion retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/AISuggestion' }
 */
/**
 * @route POST /api/tips/ai-suggestion
 * @desc Get an AI-powered personalized tip suggestion
 * @access Public
 * @body {number} billAmount - The total bill amount
 * @body {string} [merchantId] - Optional merchant ID for context
 * @body {string} [context] - Optional additional context (e.g., "excellent service")
 * @returns {ApiResponse<AISuggestion>}
 *
 * @example
 * // Sample Request
 * fetch('/api/tips/ai-suggestion', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     billAmount: 120,
 *     context: 'Great service and food'
 *   })
 * })
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.post("/ai-suggestion", async (request, response) => {
    try {
        const {billAmount, merchantId, context} = request.body;

        if (!billAmount || billAmount <= 0) {
            return response.status(400).json({
                success: false,
                error: "Valid billAmount is required",
            } as ApiResponse<null>);
        }

        const suggestion = await getAISuggestion({
            billAmount,
            merchantId,
            context,
        });

        return response.json({
            success: true,
            data: suggestion,
        } as ApiResponse<AISuggestion>);
    } catch (error) {
        console.error("Error getting AI suggestion:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to get AI suggestion",
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/tips/split:
 *   post:
 *     summary: Calculate how a tip amount should be split
 *     tags: [Tips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - merchantId
 *               - tipAmount
 *             properties:
 *               merchantId:
 *                 type: string
 *               tipAmount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Tip split calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     tipAmount: { type: number }
 *                     splits:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name: { type: string }
 *                           percentage: { type: number }
 *                           amount: { type: number }
 *                           walletAddress: { type: string }
 *                           employeeId: { type: string }
 *                     total: { type: number }
 */
/**
 * @route POST /api/tips/split
 * @desc Calculate how a tip amount should be split based on merchant configuration
 * @access Public
 * @body {string} merchantId - The ID of the merchant
 * @body {number} tipAmount - The total tip amount to split
 * @returns {ApiResponse<{tipAmount: number, splits: Array, total: number}>}
 *
 * @example
 * // Sample Request
 * fetch('/api/tips/split', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     merchantId: 'merch_123',
 *     tipAmount: 15.50
 *   })
 * })
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.post("/split", (request, response) => {
    try {
        const {merchantId, tipAmount} = request.body;

        if (!merchantId) {
            return response.status(400).json({
                success: false,
                error: "merchantId is required",
            } as ApiResponse<null>);
        }

        if (!tipAmount || tipAmount <= 0) {
            return response.status(400).json({
                success: false,
                error: "Valid tipAmount is required",
            } as ApiResponse<null>);
        }

        const result = getMerchantTipSplit(merchantId, tipAmount);

        if (!result) {
            return response.status(404).json({
                success: false,
                error: "Merchant not found",
            } as ApiResponse<null>);
        }

        return response.json({
            success: true,
            data: {
                tipAmount,
                splits: result.splits,
                total: result.total,
            },
        } as ApiResponse<{
            tipAmount: number;
            splits: Array<{ name: string; percentage: number; amount: number }>;
            total: number;
        }>);
    } catch (error) {
        console.error("Error calculating tip split:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to calculate tip split",
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/tips/percentages:
 *   get:
 *     summary: Get standard tip percentages and labels
 *     tags: [Tips]
 *     responses:
 *       200:
 *         description: Tip percentages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       value: { type: number }
 *                       label: { type: string }
 */
/**
 * @route GET /api/tips/percentages
 * @desc Get the list of standard tip percentages and labels
 * @access Public
 * @returns {ApiResponse<Array<{value: number, label: string}>>}
 *
 * @example
 * // Sample Request
 * fetch('/api/tips/percentages')
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.get("/percentages", (_request, response) => {
    const percentages = [
        {value: 10, label: "10%"},
        {value: 15, label: "15%"},
        {value: 18, label: "18%"},
        {value: 20, label: "20%"},
        {value: 25, label: "25%"},
    ];

    return response.json({
        success: true,
        data: percentages,
    });
});

export default router;
