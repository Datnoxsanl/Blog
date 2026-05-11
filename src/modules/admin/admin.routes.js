import { Router } from 'express';
import dashboardController from './dashboard/dashboard.controller.js';
import adminCoursesController from './courses/admin-courses.controller.js';
import { requireAuth, authorize } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth, authorize('admin'));

router.get('/dashboard', dashboardController.index);

router.get('/courses', adminCoursesController.index);
router.get('/courses/create', adminCoursesController.create);
router.post('/courses/store', adminCoursesController.store);
router.post('/courses/handle-form-actions', adminCoursesController.handleFormActions);
router.get('/courses/trash', adminCoursesController.trash);
router.get('/courses/:id/edit', adminCoursesController.edit);
router.put('/courses/:id', adminCoursesController.update);
router.delete('/courses/:id', adminCoursesController.delete);
router.patch('/courses/:id/restore', adminCoursesController.restore);
router.delete('/courses/:id/force', adminCoursesController.forceDelete);

export default router;
