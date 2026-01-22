import { Router } from 'express';
import { getBlockchainStatus } from '../services/blockchain';

const router = Router();

/**
 * @swagger
 * /api/blockchain/status:
 *   get:
 *     summary: Get blockchain connection status
 *     tags: [Blockchain]
 *     responses:
 *       200:
 *         description: Connection status
 */
router.get('/status', async (req, res) => {
    const status = await getBlockchainStatus();
    res.json(status);
});

export const blockchainRouter = router;
