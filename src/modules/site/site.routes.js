import { Router } from 'express';
import siteController from './site.controller.js';

const router = Router();

router.get('/search', siteController.search);
router.get('/', siteController.index);

export default router;
