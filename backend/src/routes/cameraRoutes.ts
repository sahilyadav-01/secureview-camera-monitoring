import { Router } from 'express';
import {
  getCameras,
  getCameraById,
  createCamera,
  updateCamera,
  deleteCamera,
  testConnection,
} from '../controllers/cameraController';
import { authenticateToken, requireRoles } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getCameras);
router.get('/:id', getCameraById);
router.post('/', requireRoles('SUPER_ADMIN', 'IT_ADMIN'), createCamera);
router.put('/:id', requireRoles('SUPER_ADMIN', 'IT_ADMIN'), updateCamera);
router.delete('/:id', requireRoles('SUPER_ADMIN'), deleteCamera);
router.post('/:id/test-connection', testConnection);

export default router;
