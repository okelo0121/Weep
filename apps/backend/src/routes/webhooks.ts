import {Router} from "express";
import crypto from "crypto";
import {ApiResponse, WebhookPayload} from "../types";
import {SessionRepository, TransactionRepository} from "../db/models";

const router = Router();


/**
 * Verifies the webhook signature by comparing the provided signature with
 * the HMAC-SHA256 hash of the payload, generated using the given secret.
 *
 * @param {string} payload - The raw payload data received from the webhook.
 * @param {string} signature - The signature received from the webhook headers for authentication.
 * @param {string} secret - The shared secret used to create the HMAC hash for verification.
 * @return {boolean} Returns true if the provided signature matches the computed signature, otherwise false.
 */
function verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
): boolean {
    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(payload)
        .digest("hex");

    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

/**
 * @swagger
 * /api/webhooks/payment:
 *   post:
 *     summary: Webhook endpoint for processing payment events
 *     tags: [Webhooks]
 *     parameters:
 *       - in: header
 *         name: x-weep-signature
 *         schema:
 *           type: string
 *         description: Signature for payload verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event
 *               - data
 *             properties:
 *               event:
 *                 type: string
 *                 enum: [payment.confirmed, payment.failed]
 *               data:
 *                 type: object
 *                 properties:
 *                   sessionId:
 *                     type: string
 *                   payerAddress:
 *                     type: string
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 */
/**
 * @route POST /api/webhooks/payment
 * @desc Webhook endpoint for processing payment events (confirmed, failed)
 * @access Public
 * @header {string} [x-weep-signature] - Signature for payload verification
 * @body {string} event - The type of event (e.g., 'payment.confirmed', 'payment.failed')
 * @body {object} data - Event-specific data payload
 * @body {string} data.sessionId - The ID of the affected session
 * @body {string} [data.payerAddress] - The wallet address of the payer (for confirmed payments)
 * @returns {ApiResponse<null>}
 *
 * @example
 * // Sample Request
 * fetch('/api/webhooks/payment', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'x-weep-signature': '...'
 *   },
 *   body: JSON.stringify({
 *     event: 'payment.confirmed',
 *     data: {
 *       sessionId: 'sess_123',
 *       payerAddress: '0x123...'
 *     }
 *   })
 * })
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.post("/payment", (request, response) => {
    try {
        const signature = request.headers["x-weep-signature"] as string;
        const webhookSecret = process.env.WEBHOOK_SECRET;

        // Verify signature if secret is configured
        if (webhookSecret && signature) {
            const isValid = verifyWebhookSignature(
                JSON.stringify(request.body),
                signature,
                webhookSecret
            );

            if (!isValid) {
                return response.status(401).json({
                    success: false,
                    error: "Invalid webhook signature",
                } as ApiResponse<null>);
            }
        }

        const {event, data} = request.body as WebhookPayload;

        console.log(`📥 Webhook received: ${event}`, data);

        switch (event) {
            case "payment.confirmed": {
                const {sessionId, payerAddress} = data;

                // Update session status
                const session = SessionRepository.findById(sessionId);
                if (session && session.status !== "confirmed") {
                    SessionRepository.updateStatus(sessionId, "confirmed", payerAddress);

                    // Confirm transaction
                    const transaction = TransactionRepository.findBySessionId(sessionId);
                    if (transaction) {
                        TransactionRepository.confirm(transaction.id);
                    }
                }
                break;
            }

            case "payment.failed": {
                const {sessionId} = data;

                const session = SessionRepository.findById(sessionId);
                if (session && session.status !== "confirmed") {
                    SessionRepository.updateStatus(sessionId, "failed");
                }
                break;
            }

            default:
                console.log(`Unknown webhook event: ${event}`);
        }

        return response.json({
            success: true,
            message: "Webhook processed",
        });
    } catch (error) {
        console.error("Error processing webhook:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to process webhook",
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/webhooks/test:
 *   post:
 *     summary: Test webhook endpoint to verify integration
 *     tags: [Webhooks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Test webhook received
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 received: { type: object }
 */
/**
 * @route POST /api/webhooks/test
 * @desc Test webhook endpoint to verify integration
 * @access Public
 * @body {any} payload - Any data to be echoed back
 * @returns {ApiResponse<{received: object}>}
 *
 * @example
 * // Sample Request
 * fetch('/api/webhooks/test', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ test: true, message: 'Hello' })
 * })
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.post("/test", (request, response) => {
    console.log("🧪 Test webhook received:", request.body);

    return response.json({
        success: true,
        message: "Test webhook received",
        received: request.body,
    });
});

/**
 * Generates a HMAC-SHA256 signature for the given payload using the provided secret.
 *
 * @param {object} payload - The data to be signed.
 * @param {string} secret - The shared secret key used to generate the signature.
 * @return {string} The generated HMAC-SHA256 signature in hexadecimal format.
 */
export function generateWebhookSignature(
    payload: object,
    secret: string
): string {
    return crypto
        .createHmac("sha256", secret)
        .update(JSON.stringify(payload))
        .digest("hex");
}

/**
 * Sends a webhook to the specified URL with the provided event name and data payload.
 * Optionally signs the payload if a secret is provided.
 *
 * @param {string} url - The endpoint URL to which the webhook is sent.
 * @param {string} event - The name of the event being sent in the webhook.
 * @param {object} data - The data payload to include in the webhook.
 * @param {string} [secret] - An optional secret to sign the webhook payload for authentication.
 * @return {Promise<boolean>} - A promise that resolves to `true` if the webhook is sent successfully, `false` otherwise.
 */
export async function sendWebhook(
    url: string,
    event: string,
    data: object,
    secret?: string
): Promise<boolean> {
    try {
        const payload = {event, data, timestamp: new Date().toISOString()};
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (secret) {
            headers["x-weep-signature"] = generateWebhookSignature(payload, secret);
        }

        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        return response.ok;
    } catch (error) {
        console.error("Failed to send webhook:", error);
        return false;
    }
}

export default router;
