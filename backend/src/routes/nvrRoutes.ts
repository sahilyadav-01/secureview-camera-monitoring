import { Router } from 'express';
import { getNvrs, createNvr, getStorageAnalytics } from '../controllers/nvrController';
import { authenticateToken, requireRoles } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getNvrs);
router.post('/', requireRoles('SUPER_ADMIN', 'IT_ADMIN'), createNvr);
router.get('/storage-analytics', getStorageAnalytics);

export default router;
