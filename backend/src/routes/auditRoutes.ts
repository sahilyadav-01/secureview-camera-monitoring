import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditController';
import { authenticateToken, requireRoles } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);
router.get('/', requireRoles('SUPER_ADMIN', 'IT_ADMIN', 'SECURITY_OPERATOR'), getAuditLogs);

export default router;
