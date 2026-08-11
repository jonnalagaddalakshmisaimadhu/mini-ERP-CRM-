import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, addStock } from '../controllers/productController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.post('/:id/stock', addStock);

export default router;
