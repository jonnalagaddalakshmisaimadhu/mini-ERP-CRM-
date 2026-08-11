import { Router } from 'express';
import { getPOs, createPO, receivePO } from '../controllers/purchaseOrderController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', authorize(['ADMIN', 'WAREHOUSE']), getPOs);
router.post('/', authorize(['ADMIN', 'WAREHOUSE']), createPO);
router.post('/:id/receive', authorize(['ADMIN', 'WAREHOUSE']), receivePO);

export default router;
