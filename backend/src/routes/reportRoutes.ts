import { Router } from 'express';
import { getUptimeReport } from '../controllers/reportController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);
router.get('/uptime', getUptimeReport);

export default router;
