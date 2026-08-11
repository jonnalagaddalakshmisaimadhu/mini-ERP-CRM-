import { Router } from 'express';
import { getChallans, getChallanById, createChallan, confirmChallan } from '../controllers/challanController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getChallans);
router.get('/:id', getChallanById);
router.post('/', createChallan);
router.post('/:id/confirm', confirmChallan);

export default router;
