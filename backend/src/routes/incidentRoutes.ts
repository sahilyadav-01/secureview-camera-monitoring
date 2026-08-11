import { Router } from 'express';
import { getIncidents, createIncident, updateIncident } from '../controllers/incidentController';
import { authenticateToken, requireRoles } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getIncidents);
router.post('/', requireRoles('SUPER_ADMIN', 'IT_ADMIN'), createIncident);
router.put('/:id', requireRoles('SUPER_ADMIN', 'IT_ADMIN'), updateIncident);

export default router;
