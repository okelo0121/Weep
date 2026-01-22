import { Router } from "express";
import { ApiResponse, PreparePaymentResponse, SettlePaymentResponse, VerifyPaymentResponse } from "../types";
import {
    generatePaymentUrl,
    getExplorerUrl,
    getPaymentStatus,
    preparePayment,
    settlePayment,
    simulatePayment,
    verifyPayment
} from "../services";
import { getFacilitator } from "../config/thirdweb";
import { getChainConfig } from "../config/chains";

const router = Router();

// ... existing routes ...
// (I will target the end of file to append route, and top of file to fix imports)




/**
 * @swagger
 * /api/payments/prepare:
 *   post:
 *     summary: Prepare payment for a session
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *             properties:
 *               sessionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment prepared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     session: { $ref: '#/components/schemas/TipSession' }
 *                     merchant: { $ref: '#/components/schemas/Merchant' }
 *                     paymentRequirements:
 *                       type: object
 *                       properties:
 *                         x402Version: { type: number }
 *                         scheme: { type: string }
 *                         network: { type: string }
 *                         maxAmountRequired: { type: string }
 *                         resource: { type: string }
 *                         payTo: { type: string }
 *                         asset: { type: string }
 */
/**
 * @route POST /api/payments/prepare
 * @desc Prepare payment for a session
 * @access Public
 * @body {string} sessionId - The unique identifier of the payment session
 * @returns {ApiResponse<PreparePaymentResponse>}
 *
 * @example
 * // Sample Request
 * fetch('/api/payments/prepare', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ sessionId: 'sess_123' })
 * })
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.post("/prepare", async (request, response) => {
    try {
        const { sessionId } = request.body;

        if (!sessionId) {
            return response.status(400).json({
                success: false,
                error: "sessionId is required",
            } as ApiResponse<null>);
        }

        const result = await preparePayment(sessionId);

        return response.json({
            success: true,
            data: result,
        } as ApiResponse<PreparePaymentResponse>);
    } catch (error) {
        console.error("Error preparing payment:", error);
        return response.status(400).json({
            success: false,
            error:
                error instanceof Error ? error.message : "Failed to prepare payment",
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/payments/verify:
 *   post:
 *     summary: Verify payment payload
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *               - paymentPayload
 *             properties:
 *               sessionId:
 *                 type: string
 *               paymentPayload:
 *                 type: object
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     isValid: { type: boolean }
 *                     invalidReason: { type: string, nullable: true }
 */
/**
 * @route POST /api/payments/verify
 * @desc Verify payment payload
 * @access Public
 * @body {string} sessionId - The unique identifier of the payment session
 * @body {any} paymentPayload - The payment payload to verify
 * @returns {ApiResponse<VerifyPaymentResponse>}
 *
 * @example
 * // Sample Request
 * fetch('/api/payments/verify', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     sessionId: 'sess_123',
 *     paymentPayload: { ... }
 *   })
 * })
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.post("/verify", async (request, response) => {
    try {
        const { sessionId, paymentPayload } = request.body;

        if (!sessionId || !paymentPayload) {
            return response.status(400).json({
                success: false,
                error: "sessionId and paymentPayload are required",
            } as ApiResponse<null>);
        }

        const result = await verifyPayment(sessionId, paymentPayload);

        return response.json({
            success: true,
            data: result,
        } as ApiResponse<VerifyPaymentResponse>);
    } catch (error) {
        console.error("Error verifying payment:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to verify payment",
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/payments/settle:
 *   post:
 *     summary: Settle payment on-chain
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *               - paymentPayload
 *               - payerAddress
 *             properties:
 *               sessionId:
 *                 type: string
 *               paymentPayload:
 *                 type: object
 *               payerAddress:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment settled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     success: { type: boolean }
 *                     txHash: { type: string, nullable: true }
 *                     networkId: { type: string, nullable: true }
 *                     error: { type: string, nullable: true }
 *       400:
 *         description: Settlement failed
 */
/**
 * @route POST /api/payments/settle
 * @desc Settle payment on-chain
 * @access Public
 * @body {string} sessionId - The unique identifier of the payment session
 * @body {any} paymentPayload - The payment payload
 * @body {string} payerAddress - The wallet address of the payer
 * @returns {ApiResponse<SettlePaymentResponse>}
 *
 * @example
 * // Sample Request
 * fetch('/api/payments/settle', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     sessionId: 'sess_123',
 *     paymentPayload: { ... },
 *     payerAddress: '0x123...'
 *   })
 * })
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.post("/settle", async (request, response) => {
    try {
        const { sessionId, paymentPayload, payerAddress } = request.body;

        if (!sessionId || !paymentPayload || !payerAddress) {
            return response.status(400).json({
                success: false,
                error: "sessionId, paymentPayload, and payerAddress are required",
            } as ApiResponse<null>);
        }

        const result = await settlePayment(sessionId, paymentPayload, payerAddress);

        if (result.success) {
            return response.json({
                success: true,
                data: result,
                message: "Payment settled successfully",
            } as ApiResponse<SettlePaymentResponse>);
        } else {
            return response.status(400).json({
                success: false,
                error: result.error || "Settlement failed",
            } as ApiResponse<null>);
        }
    } catch (error) {
        console.error("Error settling payment:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to settle payment",
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/payments/status/{sessionId}:
 *   get:
 *     summary: Get payment status and transaction details
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the payment session
 *     responses:
 *       200:
 *         description: Payment status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     session: { $ref: '#/components/schemas/TipSession' }
 *                     transaction: { $ref: '#/components/schemas/Transaction', nullable: true }
 *                     explorerUrl: { type: string, nullable: true }
 *       404:
 *         description: Session not found
 */
/**
 * @route GET /api/payments/status/:sessionId
 * @desc Get payment status and transaction details
 * @access Public
 * @param {string} sessionId - The unique identifier of the payment session
 * @returns {ApiResponse<{session: object, transaction: object, explorerUrl: string|null}>}
 *
 * @example
 * // Sample Request
 * fetch('/api/payments/status/sess_123')
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.get("/status/:sessionId", (request, response) => {
    try {
        const { sessionId } = request.params;

        const result = getPaymentStatus(sessionId);

        if (!result.session) {
            return response.status(404).json({
                success: false,
                error: "Session not found",
            } as ApiResponse<null>);
        }

        return response.json({
            success: true,
            data: {
                session: result.session,
                transaction: result.transaction,
                explorerUrl: result.transaction
                    ? getExplorerUrl(result.transaction.txHash)
                    : null,
            },
        });
    } catch (error) {
        console.error("Error fetching payment status:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to fetch payment status",
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/payments/url:
 *   post:
 *     summary: Generate a payment URL for a given session
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *             properties:
 *               sessionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     paymentUrl: { type: string }
 */
/**
 * @route POST /api/payments/url
 * @desc Generate a payment URL for a given session
 * @access Public
 * @body {string} sessionId - The unique identifier of the payment session
 * @returns {ApiResponse<{paymentUrl: string}>}
 *
 * @example
 * // Sample Request
 * fetch('/api/payments/url', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ sessionId: 'sess_123' })
 * })
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.post("/url", (request, response) => {
    try {
        const { sessionId } = request.body;
        const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";

        if (!sessionId) {
            return response.status(400).json({
                success: false,
                error: "sessionId is required",
            } as ApiResponse<null>);
        }

        const paymentUrl = generatePaymentUrl(sessionId, baseUrl);

        return response.json({
            success: true,
            data: { paymentUrl },
        });
    } catch (error) {
        console.error("Error generating payment URL:", error);
        return response.status(400).json({
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to generate payment URL",
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/payments/supported:
 *   get:
 *     summary: Get supported payment methods
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: List of supported payment methods retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     schemes:
 *                       type: array
 *                       items: { type: string }
 *                     networks:
 *                       type: array
 *                       items: { type: string }
 *                     tokens:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           address: { type: string }
 *                           symbol: { type: string }
 *                           decimals: { type: number }
 *                           chainId: { type: number }
 *                     chainId: { type: number }
 *                     network: { type: string }
 *                     explorer: { type: string }
 */
/**
 * @route GET /api/payments/supported
 * @desc Get supported payment methods and network configuration
 * @access Public
 * @returns {ApiResponse<{methods: string[], chainId: number, network: string, explorer: string}>}
 *
 * @example
 * // Sample Request
 * fetch('/api/payments/supported')
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.get("/supported", async (_request, response) => {
    try {
        const facilitator = getFacilitator();
        const supported = await facilitator.supported();
        const chainConfig = getChainConfig();

        return response.json({
            success: true,
            data: {
                ...supported,
                chainId: chainConfig.chainId,
                network: chainConfig.networkString,
                explorer: chainConfig.explorer,
            },
        });
    } catch (error) {
        console.error("Error fetching supported methods:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to fetch supported payment methods",
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/payments/config:
 *   get:
 *     summary: Get payment configuration and network details
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Payment configuration retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     chainId: { type: number }
 *                     network: { type: string }
 *                     usdcAddress: { type: string }
 *                     explorer: { type: string }
 *                     currency: { type: string }
 *                     decimals: { type: number }
 */
/**
 * @route GET /api/payments/config
 * @desc Get payment configuration and network details
 * @access Public
 * @returns {ApiResponse<{chainId: number, network: string, usdcAddress: string, explorer: string, currency: string, decimals: number}>}
 *
 * @example
 * // Sample Request
 * fetch('/api/payments/config')
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.get("/config", (_request, response) => {
    try {
        const chainConfig = getChainConfig();

        return response.json({
            success: true,
            data: {
                chainId: chainConfig.chainId,
                network: chainConfig.networkString,
                usdcAddress: chainConfig.usdc,
                explorer: chainConfig.explorer,
                currency: "USDC",
                decimals: 6,
            },
        });
    } catch (error) {
        console.error("Error fetching payment config:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to fetch payment configuration",
        } as ApiResponse<null>);
    }
});

router.post("/simulate", async (request, response) => {
    try {
        const { sessionId, payerAddress } = request.body;
        if (!sessionId) {
            return response.status(400).json({
                success: false,
                error: "sessionId is required",
            } as ApiResponse<null>);
        }

        const result = await simulatePayment(sessionId, payerAddress);

        return response.json({
            success: true,
            data: result,
        } as ApiResponse<SettlePaymentResponse>);
    } catch (error) {
        console.error("Error simulating payment:", error);
        return response.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Simulation failed",
        } as ApiResponse<null>);
    }
});

export default router;
