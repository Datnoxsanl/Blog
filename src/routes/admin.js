import { Router } from 'express';
import AdminDashboardController from '../app/controllers/AdminDashboardController.js';
import { requireAuth, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/dashboard', requireAuth, authorize('admin'), AdminDashboardController.index);

export default router;
