// ============================================
// RECEIPT ROUTES
// ============================================

import {Router} from "express";
import {
    MerchantRepository,
    SessionRepository,
    TipAllocationRepository,
    TransactionRepository
} from "../db/models";
import {
    ApiResponse,
    TipAllocation
} from "../types";
import {getChainConfig} from "../config/chains";
import {getExplorerUrl} from "../services";

const router = Router();

/**
 * @swagger
 * /api/receipts/{sessionId}:
 *   get:
 *     summary: Get receipt details for a specific session
 *     tags: [Receipts]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the payment session
 *     responses:
 *       200:
 *         description: Receipt details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     session:
 *                       type: object
 *                       properties:
 *                         id: { type: string }
 *                         memo: { type: string }
 *                         billAmount: { type: number }
 *                         tipAmount: { type: number }
 *                         totalAmount: { type: number }
 *                         currency: { type: string }
 *                         status: { type: string }
 *                         createdAt: { type: string, format: 'date-time' }
 *                     merchant:
 *                       type: object
 *                       properties:
 *                         id: { type: string }
 *                         name: { type: string }
 *                         slug: { type: string }
 *                         walletAddress: { type: string }
 *                     transaction: { $ref: '#/components/schemas/Transaction', nullable: true }
 *                     network:
 *                       type: object
 *                       properties:
 *                         name: { type: string }
 *                         chainId: { type: number }
 *                         currency: { type: string }
 *                     payer:
 *                       type: object
 *                       properties:
 *                         address: { type: string, nullable: true }
 *                     allocations:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/TipAllocation' }
 *       404:
 *         description: Session or Merchant not found
 */
/**
 * @route GET /api/receipts/:sessionId
 * @desc Get receipt details for a specific session
 * @access Public
 * @param {string} sessionId - The unique identifier of the payment session
 * @returns {ApiResponse<ReceiptData>}
 *
 * @example
 * // Sample Request
 * fetch('/api/receipts/sess_123')
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.get("/:sessionId", (request, response) => {
    try {
        const {sessionId} = request.params;

        // Find session
        const session = SessionRepository.findById(sessionId);

        if (!session) {
            return response.status(404).json({
                success: false,
                error: "Session not found",
            } as ApiResponse<null>);
        }

        // Find merchant
        const merchant = MerchantRepository.findById(session.merchantId);

        if (!merchant) {
            return response.status(404).json({
                success: false,
                error: "Merchant not found",
            } as ApiResponse<null>);
        }

        // Find transaction
        const transaction = TransactionRepository.findBySessionId(sessionId);

        // Get tip allocations
        const allocations = transaction ? TipAllocationRepository.getByTransactionId(transaction.id) : [];

        // Get chain config
        const chainConfig = getChainConfig();

        // Build receipt response
        const receipt: ReceiptData = {
            session: {
                id: session.id,
                memo: session.memo,
                billAmount: session.billAmount,
                tipAmount: session.tipAmount || 0,
                totalAmount: session.totalAmount || session.billAmount,
                currency: session.currency,
                status: session.status,
                createdAt: session.createdAt,
            },
            merchant: {
                id: merchant.id,
                name: merchant.name,
                slug: merchant.slug,
                walletAddress: merchant.walletAddress,
            },
            transaction: transaction
                ? {
                    id: transaction.id,
                    txHash: transaction.txHash,
                    networkId: transaction.networkId,
                    status: transaction.status,
                    confirmedAt: transaction.confirmedAt || null,
                    explorerUrl: getExplorerUrl(transaction.txHash),
                }
                : null,
            network: {
                name: chainConfig.networkString,
                chainId: chainConfig.chainId,
                currency: "USDC",
            },
            payer: {
                address: session.payerAddress || null,
            },
            allocations: allocations,
        };

        return response.json({
            success: true,
            data: receipt,
        } as ApiResponse<ReceiptData>);
    } catch (error) {
        console.error("Error fetching receipt:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to fetch receipt",
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/receipts/{sessionId}/share:
 *   get:
 *     summary: Get a shareable receipt URL for a specific session
 *     tags: [Receipts]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the payment session
 *     responses:
 *       200:
 *         description: Shareable URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     shareUrl: { type: string }
 *                     sessionId: { type: string }
 *       404:
 *         description: Session not found
 */
/**
 * @route GET /api/receipts/:sessionId/share
 * @desc Get a shareable receipt URL for a specific session
 * @access Public
 * @param {string} sessionId - The unique identifier of the payment session
 * @returns {ApiResponse<{shareUrl: string, sessionId: string}>}
 *
 * @example
 * // Sample Request
 * fetch('/api/receipts/sess_123/share')
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.get("/:sessionId/share", (request, response) => {
    try {
        const {sessionId} = request.params;
        const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";

        const session = SessionRepository.findById(sessionId);

        if (!session) {
            return response.status(404).json({
                success: false,
                error: "Session not found",
            } as ApiResponse<null>);
        }

        const shareUrl = `${baseUrl}/receipt?session=${sessionId}`;

        return response.json({
            success: true,
            data: {
                shareUrl,
                sessionId,
            },
        });
    } catch (error) {
        console.error("Error generating share URL:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to generate share URL",
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/receipts/{sessionId}/download:
 *   get:
 *     summary: Download receipt data as a JSON file
 *     tags: [Receipts]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the payment session
 *     responses:
 *       200:
 *         description: JSON file content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Session not found
 */
/**
 * @route GET /api/receipts/:sessionId/download
 * @desc Download receipt data as a JSON file
 * @access Public
 * @param {string} sessionId - The unique identifier of the payment session
 * @returns {object} JSON file content
 *
 * @example
 * // Sample Request
 * window.location.href = '/api/receipts/sess_123/download';
 */
router.get("/:sessionId/download", (request, response) => {
    try {
        const {sessionId} = request.params;

        const session = SessionRepository.findById(sessionId);

        if (!session) {
            return response.status(404).json({
                success: false,
                error: "Session not found",
            } as ApiResponse<null>);
        }

        const merchant = MerchantRepository.findById(session.merchantId);
        const transaction = TransactionRepository.findBySessionId(sessionId);
        const allocations = transaction ? TipAllocationRepository.getByTransactionId(transaction.id) : [];
        const chainConfig = getChainConfig();

        const receiptData = {
            receiptId: session.memo,
            date: session.createdAt,
            merchant: merchant?.name || "Unknown",
            billAmount: session.billAmount,
            tipAmount: session.tipAmount || 0,
            totalAmount: session.totalAmount || session.billAmount,
            currency: session.currency,
            network: chainConfig.networkString,
            transactionHash: transaction?.txHash || null,
            status: session.status,
            allocations: allocations,
        };

        response.setHeader("Content-Type", "application/json");
        response.setHeader(
            "Content-Disposition",
            `attachment; filename="receipt-${session.memo}.json"`
        );

        return response.send(JSON.stringify(receiptData, null, 2));
    } catch (error) {
        console.error("Error downloading receipt:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to download receipt",
        } as ApiResponse<null>);
    }
});

export default router;

/**
 * Represents the data structure for a receipt, including session details, merchant information,
 * transaction details, network attributes, and payer information.
 */
interface ReceiptData {
    session: {
        id: string;
        memo: string;
        billAmount: number;
        tipAmount: number;
        totalAmount: number;
        currency: string;
        status: string;
        createdAt: string;
    };
    merchant: {
        id: string;
        name: string;
        slug: string;
        walletAddress: string;
    };
    transaction: {
        id: string;
        txHash: string;
        networkId: string;
        status: string;
        confirmedAt: string | null;
        explorerUrl: string;
    } | null;
    network: {
        name: string;
        chainId: number;
        currency: string;
    };
    payer: {
        address: string | null;
    };
    allocations: TipAllocation[];
}
