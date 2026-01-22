import {Router} from "express";
import {ApiResponse, CreateSessionResponse} from "../types";
import {MerchantRepository, SessionRepository} from "../db/models";

const router = Router();

/**
 * @swagger
 * /api/sessions:
 *   post:
 *     summary: Create a new tip session
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - merchantId
 *               - billAmount
 *             properties:
 *               merchantId:
 *                 type: string
 *               billAmount:
 *                 type: number
 *               currency:
 *                 type: string
 *                 default: USDC
 *     responses:
 *       201:
 *         description: Tip session created successfully
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
 */
/**
 * @route POST /api/sessions
 * @desc Create a new tip session
 * @access Public
 * @body {string} merchantId - Merchant ID or slug
 * @body {number} billAmount - The initial bill amount
 * @body {string} [currency="USDC"] - Currency for the transaction
 * @returns {ApiResponse<CreateSessionResponse>}
 *
 * @example
 * // Sample Request
 * fetch('/api/sessions', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     merchantId: 'merchant-slug',
 *     billAmount: 50,
 *     currency: 'USDC'
 *   })
 * })
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.post("/", (request, response) => {
    try {
        const {merchantId, billAmount, currency} = request.body;

        if (!merchantId || billAmount === undefined) {
            return response.status(400).json({
                success: false,
                error: "merchantId and billAmount are required",
            } as ApiResponse<null>);
        }

        if (billAmount <= 0) {
            return response.status(400).json({
                success: false,
                error: "billAmount must be greater than 0",
            } as ApiResponse<null>);
        }

        // Find merchant by ID or slug
        let merchant = MerchantRepository.findById(merchantId);
        if (!merchant) {
            merchant = MerchantRepository.findBySlug(merchantId);
        }

        if (!merchant) {
            return response.status(404).json({
                success: false,
                error: "Merchant not found",
            } as ApiResponse<null>);
        }

        const session = SessionRepository.create({
            merchantId: merchant.id,
            billAmount,
            currency: currency || "USDC",
        });

        return response.status(201).json({
            success: true,
            data: {
                session,
                merchant,
            },
        } as ApiResponse<CreateSessionResponse>);
    } catch (error) {
        console.error("Error creating session:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to create session",
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/sessions/{id}:
 *   get:
 *     summary: Get session details by its ID
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the session
 *     responses:
 *       200:
 *         description: Session details retrieved successfully
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
 *       404:
 *         description: Session not found
 */
/**
 * @route GET /api/sessions/:id
 * @desc Get session details by its ID
 * @access Public
 * @param {string} id - The unique identifier of the session
 * @returns {ApiResponse<CreateSessionResponse>}
 *
 * @example
 * // Sample Request
 * fetch('/api/sessions/sess_123')
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.get("/:id", (request, response) => {
    try {
        const {id} = request.params;

        const session = SessionRepository.findById(id);

        if (!session) {
            return response.status(404).json({
                success: false,
                error: "Session not found",
            } as ApiResponse<null>);
        }

        // Check if expired
        if (
            new Date(session.expiresAt) < new Date() &&
            session.status === "pending"
        ) {
            SessionRepository.updateStatus(id, "expired");
            session.status = "expired";
        }

        const merchant = MerchantRepository.findById(session.merchantId);

        return response.json({
            success: true,
            data: {
                session,
                merchant,
            },
        } as ApiResponse<CreateSessionResponse>);
    } catch (error) {
        console.error("Error fetching session:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to fetch session",
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/sessions/{id}/tip:
 *   patch:
 *     summary: Update tip selection for a session
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipAmount:
 *                 type: number
 *               tipPercentage:
 *                 type: number
 *     responses:
 *       200:
 *         description: Tip updated successfully
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
 *       400:
 *         description: Invalid tip selection or session status
 *       404:
 *         description: Session not found
 */
/**
 * @route PATCH /api/sessions/:id/tip
 * @desc Update tip selection for a session
 * @access Public
 * @param {string} id - The unique identifier of the session
 * @body {number} [tipAmount] - Specific tip amount
 * @body {number} [tipPercentage] - Tip percentage relative to bill amount
 * @returns {ApiResponse<CreateSessionResponse>}
 *
 * @example
 * // Sample Request
 * fetch('/api/sessions/sess_123/tip', {
 *   method: 'PATCH',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     tipPercentage: 15
 *   })
 * })
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.patch("/:id/tip", (request, response) => {
    try {
        const {id} = request.params;
        const {tipAmount, tipPercentage} = request.body;

        const session = SessionRepository.findById(id);

        if (!session) {
            return response.status(404).json({
                success: false,
                error: "Session not found",
            } as ApiResponse<null>);
        }

        if (session.status === "expired") {
            return response.status(400).json({
                success: false,
                error: "Session has expired",
            } as ApiResponse<null>);
        }

        if (session.status === "confirmed") {
            return response.status(400).json({
                success: false,
                error: "Payment already completed",
            } as ApiResponse<null>);
        }

        // Calculate tip amount if percentage provided
        let finalTipAmount = tipAmount;
        let finalTipPercentage = tipPercentage;

        if (tipPercentage !== undefined && tipAmount === undefined) {
            finalTipAmount =
                Math.round(session.billAmount * (tipPercentage / 100) * 100) / 100;
        } else if (tipAmount !== undefined && tipPercentage === undefined) {
            finalTipPercentage =
                Math.round((tipAmount / session.billAmount) * 100 * 10) / 10;
        }

        if (finalTipAmount === undefined || finalTipAmount < 0) {
            return response.status(400).json({
                success: false,
                error: "Valid tipAmount or tipPercentage is required",
            } as ApiResponse<null>);
        }

        const updatedSession = SessionRepository.updateTip(
            id,
            finalTipAmount,
            finalTipPercentage || 0
        );
        const merchant = MerchantRepository.findById(updatedSession.merchantId);

        return response.json({
            success: true,
            data: {
                session: updatedSession,
                merchant,
            },
            message: "Tip updated successfully",
        } as ApiResponse<CreateSessionResponse>);
    } catch (error) {
        console.error("Error updating tip:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to update tip",
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/sessions/{id}/cancel:
 *   post:
 *     summary: Cancel an active payment session
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the session to cancel
 *     responses:
 *       200:
 *         description: Session cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Session already confirmed or expired
 *       404:
 *         description: Session not found
 */
/**
 * @route POST /api/sessions/:id/cancel
 * @desc Cancel a session
 * @access Public
 * @param {string} id - The unique identifier of the session to cancel
 * @returns {ApiResponse<null>}
 *
 * @example
 * // Sample Request
 * fetch('/api/sessions/sess_123/cancel', {
 *   method: 'POST'
 * })
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.post("/:id/cancel", (request, response) => {
    try {
        const {id} = request.params;

        const session = SessionRepository.findById(id);

        if (!session) {
            return response.status(404).json({
                success: false,
                error: "Session not found",
            } as ApiResponse<null>);
        }

        if (session.status === "confirmed") {
            return response.status(400).json({
                success: false,
                error: "Cannot cancel completed payment",
            } as ApiResponse<null>);
        }

        SessionRepository.updateStatus(id, "expired");

        return response.json({
            success: true,
            message: "Session cancelled successfully",
        } as ApiResponse<null>);
    } catch (error) {
        console.error("Error cancelling session:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to cancel session",
        } as ApiResponse<null>);
    }
});

export default router;