import {Router} from "express";
import {ApiResponse, CreateDisputeRequest, Dispute, DisputeReason} from "../types";
import {DisputeRepository, MerchantRepository, SessionRepository} from "../db/models";

const router = Router();

// Valid dispute reasons
const VALID_REASONS: DisputeReason[] = [
    "incorrect_amount",
    "unauthorized_transaction",
    "service_not_received",
    "duplicate_charge",
    "other",
];

/**
 * @swagger
 * /api/disputes:
 *   post:
 *     summary: Create a new dispute for a payment session
 *     tags: [Disputes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *               - reason
 *               - details
 *               - submittedBy
 *             properties:
 *               sessionId:
 *                 type: string
 *               reason:
 *                 type: string
 *                 enum: [incorrect_amount, unauthorized_transaction, service_not_received, duplicate_charge, other]
 *               details:
 *                 type: string
 *               submittedBy:
 *                 type: string
 *     responses:
 *       200:
 *         description: Dispute submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/Dispute' }
 */
/**
 * @route POST /api/disputes
 * @desc Create a new dispute for a payment session
 * @access Public
 * @body {string} sessionId - The ID of the session being disputed
 * @body {string} reason - The reason for the dispute (from valid reasons)
 * @body {string} details - Additional details about the dispute
 * @body {string} submittedBy - The identifier of the person submitting the dispute
 * @returns {ApiResponse<Dispute>}
 *
 * @example
 * // Sample Request
 * fetch('/api/disputes', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     sessionId: 'sess_123',
 *     reason: 'incorrect_amount',
 *     details: 'The amount charged was higher than agreed',
 *     submittedBy: 'user@example.com'
 *   })
 * })
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.post("/", (request, response) => {
    try {
        const {sessionId, reason, details, submittedBy} = request.body as CreateDisputeRequest;

        // validate required fields
        if (!sessionId || !reason || !submittedBy || !details) {
            return response.status(400).json({
                success: false,
                error: "sessionId, reason, details, and submittedBy are required",
            } as ApiResponse<null>);
        }

        // validate reason
        if (!VALID_REASONS.includes(reason)) {
            return response.status(400).json({
                success: false,
                error: `Invalid reason. Must be one of: ${VALID_REASONS.join(", ")}`,
            } as ApiResponse<null>);
        }

        const session = SessionRepository.findById(sessionId);
        if (!session) {
            return response.status(404).json({
                success: false,
                error: "Session not found",
            } as ApiResponse<null>);
        }

        // create dispute
        const dispute = DisputeRepository.create({
            sessionId,
            merchantId: session.merchantId,
            reason,
            details,
            submittedBy,
        });

        return response.json({
            success: true,
            data: dispute,
            message: "Dispute submitted successfully",
        });

    } catch (error) {
        console.error("Error creating dispute:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to create dispute."
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/disputes/{id}:
 *   get:
 *     summary: Get dispute details by its ID
 *     tags: [Disputes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the dispute
 *     responses:
 *       200:
 *         description: Dispute details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/Dispute' }
 *       404:
 *         description: Dispute not found
 */
/**
 * @route GET /api/disputes/:id
 * @desc Get dispute details by its ID
 * @access Public
 * @param {string} id - The unique identifier of the dispute
 * @returns {ApiResponse<Dispute>}
 *
 * @example
 * // Sample Request
 * fetch('/api/disputes/disp_123')
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.get("/:id", (request, response) => {
    try {
        const {id} = request.params;

        const dispute = DisputeRepository.findById(id);

        if (!dispute) {
            return response.status(404).json({
                success: false,
                error: "Dispute not found",
            } as ApiResponse<null>);
        }

        return response.json({
            success: true,
            data: dispute,
        } as ApiResponse<Dispute>);
    } catch (error) {
        console.error("Error fetching dispute:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to fetch dispute",
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/disputes/merchant/{merchantId}:
 *   get:
 *     summary: Get all disputes associated with a specific merchant
 *     tags: [Disputes]
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID or slug of the merchant
 *     responses:
 *       200:
 *         description: Disputes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Dispute' }
 *       404:
 *         description: Merchant not found
 */
/**
 * @route GET /api/disputes/merchant/:merchantId
 * @desc Get all disputes associated with a specific merchant
 * @access Public
 * @param {string} merchantId - The ID or slug of the merchant
 * @returns {ApiResponse<Dispute[]>}
 *
 * @example
 * // Sample Request
 * fetch('/api/disputes/merchant/merchant-slug')
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.get("/merchant/:merchantId", (request, response) => {
    try {
        const {merchantId} = request.params;

        // Find merchant
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

        const disputes = DisputeRepository.getByMerchant(merchant.id);

        return response.json({
            success: true,
            data: disputes,
        } as ApiResponse<Dispute[]>);
    } catch (error) {
        console.error("Error fetching disputes:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to fetch disputes",
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/disputes/{id}/status:
 *   patch:
 *     summary: Update the status of a dispute
 *     tags: [Disputes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the dispute to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, under_review, resolved, rejected]
 *               resolution:
 *                 type: string
 *     responses:
 *       200:
 *         description: Dispute status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/Dispute' }
 *       404:
 *         description: Dispute not found
 */
/**
 * @route PATCH /api/disputes/:id/status
 * @desc Update the status of a dispute
 * @access Public
 * @param {string} id - The ID of the dispute to update
 * @body {string} status - New status (pending, under_review, resolved, rejected)
 * @body {string} [resolution] - Resolution details or notes
 * @returns {ApiResponse<Dispute>}
 *
 * @example
 * // Sample Request
 * fetch('/api/disputes/disp_123/status', {
 *   method: 'PATCH',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     status: 'resolved',
 *     resolution: 'Refund processed'
 *   })
 * })
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.patch("/:id/status", (request, response) => {
    try {
        const {id} = request.params;
        const {status, resolution} = request.body;

        if (!status) {
            return response.status(400).json({
                success: false,
                error: "status is required",
            } as ApiResponse<null>);
        }

        const validStatuses = ["pending", "under_review", "resolved", "rejected"];
        if (!validStatuses.includes(status)) {
            return response.status(400).json({
                success: false,
                error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
            } as ApiResponse<null>);
        }

        const dispute = DisputeRepository.findById(id);
        if (!dispute) {
            return response.status(404).json({
                success: false,
                error: "Dispute not found",
            } as ApiResponse<null>);
        }

        const updatedDispute = DisputeRepository.updateStatus(id, status, resolution);

        return response.json({
            success: true,
            data: updatedDispute,
            message: "Dispute status updated successfully",
        } as ApiResponse<Dispute>);
    } catch (error) {
        console.error("Error updating dispute:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to update dispute",
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/disputes/meta/reasons:
 *   get:
 *     summary: Get the list of valid dispute reasons and their labels
 *     tags: [Disputes]
 *     responses:
 *       200:
 *         description: List of valid dispute reasons retrieved successfully
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
 *                       value: { type: string }
 *                       label: { type: string }
 */
/**
 * @route GET /api/disputes/meta/reasons
 * @desc Get the list of valid dispute reasons and their labels
 * @access Public
 * @returns {ApiResponse<Array<{value: string, label: string}>>}
 *
 * @example
 * // Sample Request
 * fetch('/api/disputes/meta/reasons')
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.get("/meta/reasons", (_req, res) => {
    const reasons = [
        {value: "incorrect_amount", label: "Incorrect Amount"},
        {value: "unauthorized_transaction", label: "Unauthorized Transaction"},
        {value: "service_not_received", label: "Service Not Received"},
        {value: "duplicate_charge", label: "Duplicate Charge"},
        {value: "other", label: "Other"},
    ];

    return res.json({
        success: true,
        data: reasons,
    });
});

export default router;