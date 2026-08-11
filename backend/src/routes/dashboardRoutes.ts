import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticate, getDashboardStats);

export default router;
