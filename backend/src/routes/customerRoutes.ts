import { Router } from 'express';
import { getCustomers, getCustomerById, createCustomer, updateCustomer, addNote } from '../controllers/customerController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.post('/:id/notes', addNote);

export default router;
