import { Router } from 'express';
import authController from './auth.controller.js';

const router = Router();

router.get('/login', authController.showLogin);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/register', authController.showRegister);
router.post('/register', authController.register);

export default router;
