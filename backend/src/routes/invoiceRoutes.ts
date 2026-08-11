import { Router } from 'express';
import { getInvoices, createInvoice, payInvoice } from '../controllers/invoiceController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', authorize(['ADMIN', 'ACCOUNTS']), getInvoices);
router.post('/', authorize(['ADMIN', 'ACCOUNTS']), createInvoice);
router.put('/:id/pay', authorize(['ADMIN', 'ACCOUNTS']), payInvoice);

export default router;
