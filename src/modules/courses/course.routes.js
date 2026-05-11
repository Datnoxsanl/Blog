import { Router } from 'express';
import courseController from './course.controller.js';

const router = Router();

router.get('/:slug', courseController.show);

export default router;
