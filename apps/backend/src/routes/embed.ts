import {Router} from "express";
import {ApiResponse, EmbedConfig, WidgetSession} from "../types";
import {MerchantRepository, SessionRepository} from "../db/models";
import {getChainConfig} from "../config/chains";

const router = Router();


/**
 * @swagger
 * /api/embed/config:
 *   get:
 *     summary: Get configuration for the payment widget embed
 *     tags: [Embed]
 *     parameters:
 *       - in: query
 *         name: merchant
 *         required: true
 *         schema:
 *           type: string
 *         description: Merchant ID or slug
 *     responses:
 *       200:
 *         description: Configuration retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     merchant:
 *                       type: object
 *                       properties:
 *                         id: { type: string }
 *                         name: { type: string }
 *                         slug: { type: string }
 *                         avatar: { type: string, nullable: true }
 *                     network:
 *                       type: object
 *                       properties:
 *                         chainId: { type: number }
 *                         name: { type: string }
 *                         currency: { type: string }
 *                         explorer: { type: string }
 *                     features:
 *                       type: object
 *                       properties:
 *                         aiSuggestions: { type: boolean }
 *                         customTip: { type: boolean }
 *                         roundUp: { type: boolean }
 */
/**
 * @route GET /api/embed/config
 * @desc Get configuration for the payment widget embed
 * @access Public
 * @param {string} merchant - Merchant ID or slug (query parameter)
 * @returns {ApiResponse<{merchant: object, network: object, features: object}>}
 *
 * @example
 * // Sample Request
 * fetch('/api/embed/config?merchant=merchant-slug')
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.get("/config", (request, response) => {
    try {
        const {merchant} = request.query;

        if (!merchant) {
            return response.status(400).json({
                success: false,
                error: "merchant parameter is required",
            } as ApiResponse<null>);
        }

        // Find merchant
        let merchantData = MerchantRepository.findById(merchant as string);
        if (!merchantData) {
            merchantData = MerchantRepository.findBySlug(merchant as string);
        }

        if (!merchantData) {
            return response.status(404).json({
                success: false,
                error: "Merchant not found",
            } as ApiResponse<null>);
        }

        const chainConfig = getChainConfig();

        return response.json({
            success: true,
            data: {
                merchant: {
                    id: merchantData.id,
                    name: merchantData.name,
                    slug: merchantData.slug,
                    avatar: merchantData.avatar,
                },
                network: {
                    chainId: chainConfig.chainId,
                    name: chainConfig.networkString,
                    currency: "USDC",
                    explorer: chainConfig.explorer,
                },
                features: {
                    aiSuggestions: true,
                    customTip: true,
                    roundUp: true,
                },
            },
        });
    } catch (error) {
        console.error("Error fetching embed config:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to fetch embed configuration",
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/embed/session:
 *   post:
 *     summary: Create a new widget session for payment
 *     tags: [Embed]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - merchantId
 *             properties:
 *               merchantId:
 *                 type: string
 *               billAmount:
 *                 type: number
 *               theme:
 *                 type: string
 *               customColor:
 *                 type: string
 *               aiSuggestions:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Widget session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     embedUrl: { type: string }
 *                     sessionId: { type: string, nullable: true }
 *                     expiresAt: { type: string, format: 'date-time' }
 *                     merchant:
 *                       type: object
 *                       properties:
 *                         id: { type: string }
 *                         name: { type: string }
 *                         slug: { type: string }
 */
/**
 * @route POST /api/embed/session
 * @desc Create a new widget session for payment
 * @access Public
 * @body {string} merchantId - Merchant ID or slug
 * @body {number} [billAmount] - Initial bill amount
 * @body {string} [theme] - UI theme (light/dark)
 * @body {string} [customColor] - Primary accent color hex
 * @body {boolean} [aiSuggestions] - Enable/disable AI tip suggestions
 * @returns {ApiResponse<{embedUrl: string, sessionId: string|null, expiresAt: string, merchant: object}>}
 *
 * @example
 * // Sample Request
 * fetch('/api/embed/session', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     merchantId: 'merchant-slug',
 *     billAmount: 100,
 *     theme: 'dark'
 *   })
 * })
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.post("/session", (request, response) => {
    try {
        const {merchantId, billAmount, theme, customColor, aiSuggestions} =
            request.body as EmbedConfig & { billAmount?: number };

        if (!merchantId) {
            return response.status(400).json({
                success: false,
                error: "merchantId is required",
            } as ApiResponse<null>);
        }

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

        // Create session if bill amount provided
        let session = null;
        if (billAmount && billAmount > 0) {
            session = SessionRepository.create({
                merchantId: merchant.id,
                billAmount,
                currency: "USDC",
            });
        }

        const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        const embedParams = new URLSearchParams({
            merchant: merchant.slug,
            ...(billAmount && {bill: billAmount.toString()}),
            ...(theme && {theme}),
            ...(customColor && {color: customColor}),
            ...(aiSuggestions !== undefined && {ai: aiSuggestions.toString()}),
            ...(session && {session: session.id}),
        });

        const embedUrl = `${baseUrl}/embed?${embedParams.toString()}`;
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 min

        return response.status(201).json({
            success: true,
            data: {
                embedUrl,
                sessionId: session?.id || null,
                expiresAt,
                merchant: {
                    id: merchant.id,
                    name: merchant.name,
                    slug: merchant.slug,
                },
            },
        } as ApiResponse<WidgetSession & { merchant: object }>);
    } catch (error) {
        console.error("Error creating widget session:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to create widget session",
        } as ApiResponse<null>);
    }
});

/**
 * @swagger
 * /api/embed/merchants/{slug}:
 *   get:
 *     summary: Get merchant information for embed widget
 *     tags: [Embed]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Merchant slug
 *     responses:
 *       200:
 *         description: Merchant information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: string }
 *                     name: { type: string }
 *                     slug: { type: string }
 *                     avatar: { type: string, nullable: true }
 *                     walletAddress: { type: string }
 */
/**
 * @route GET /api/embed/merchants/:slug
 * @desc Get basic merchant information for the embed widget
 * @access Public
 * @param {string} slug - Merchant slug (URL parameter)
 * @returns {ApiResponse<{id: string, name: string, slug: string, avatar: string, walletAddress: string}>}
 *
 * @example
 * // Sample Request
 * fetch('/api/embed/merchants/my-shop')
 *   .then(response => response.json())
 *   .then(data => console.log(data));
 */
router.get("/merchants/:slug", (request, response) => {
    try {
        const {slug} = request.params;

        const merchant = MerchantRepository.findBySlug(slug);

        if (!merchant) {
            return response.status(404).json({
                success: false,
                error: "Merchant not found",
            } as ApiResponse<null>);
        }

        // Return limited merchant info for embed
        return response.json({
            success: true,
            data: {
                id: merchant.id,
                name: merchant.name,
                slug: merchant.slug,
                avatar: merchant.avatar,
                walletAddress: merchant.walletAddress,
            },
        });
    } catch (error) {
        console.error("Error fetching merchant for embed:", error);
        return response.status(500).json({
            success: false,
            error: "Failed to fetch merchant",
        } as ApiResponse<null>);
    }
});

export default router;