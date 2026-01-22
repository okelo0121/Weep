import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from "express-rate-limit";

import merchantRoutes from './routes/merchants';
import webhookRoutes from './routes/webhooks';
import sessionRoutes from './routes/sessions';
import tipsRoutes from './routes/tips';
import disputeRoutes from './routes/disputes';
import receiptRoutes from './routes/receipts';
import embedRoutes from './routes/embed';
import paymentRoutes from './routes/payments';
import { blockchainRouter } from './routes/blockchain';
import { getChainConfig } from "./config/chains";
import { swaggerUi, specs } from "./swagger";

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(
    cors({
        origin: [
            process.env.FRONTEND_URL || "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:8080",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:8080"
        ],
        credentials: true,
    })
);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // limit each IP to 100 requests per windowMs
    message: { error: "Too many requests, please try again later" },
});
app.use("/api/", limiter);

app.use(express.json());

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check API health status
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 timestamp: { type: string, format: 'date-time' }
 *                 version: { type: string }
 */
app.get("/health", (_req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});

app.use("/api/merchants", merchantRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/tips", tipsRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/disputes", disputeRoutes);
app.use("/api/receipts", receiptRoutes);
app.use("/api/embed", embedRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/blockchain", blockchainRouter);


// Root endpoint
app.get("/", (_req, res) => {
    res.json({
        name: "Weep Protocol API",
        version: "1.0.0",
        description:
            "AI-native micro-tipping backend with x402 + Thirdweb on Cronos",
        endpoints: {
            health: "/health",
            merchants: "/api/merchants",
            sessions: "/api/sessions",
            tips: "/api/tips",
            payments: "/api/payments",
            receipts: "/api/receipts",
            disputes: "/api/disputes",
            webhooks: "/api/webhooks",
            embed: "/api/embed",
        },
    });
});

// API info endpoint
/**
 * @swagger
 * /api:
 *   get:
 *     summary: Get API information and documentation link
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name: { type: string }
 *                 version: { type: string }
 *                 documentation: { type: string }
 */
app.get("/api", (_req, res) => {
    res.json({
        name: "Weep Protocol API",
        version: "1.0.0",
        documentation: "/api/docs",
    });
});

// 404 handler
app.use((_req, res) => {
    res.status(404).json({ error: "Endpoint not found" });
});

// Error handler
app.use(
    (
        err: Error,
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction
    ) => {
        console.error("Error:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
);

// Start server
const chainConfig = getChainConfig();

app.listen(PORT, () => {
    console.log(`
🟢 Server:      http://localhost:${PORT}
📡 API:         http://localhost:${PORT}/api
💚 Health:      http://localhost:${PORT}/health
🔗 Network:     ${chainConfig.name}
💰 USDC:        ${chainConfig.usdc}
  `);
});

export default app;
