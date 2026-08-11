import { Router } from 'express';
import { getAlerts, updateAlertStatus } from '../controllers/alertController';
import { authenticateToken, requireRoles } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getAlerts);
router.patch('/:id/status', requireRoles('SUPER_ADMIN', 'IT_ADMIN', 'SECURITY_OPERATOR'), updateAlertStatus);

export default router;
