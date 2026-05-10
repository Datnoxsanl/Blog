/**
 * @fileoverview Me (User) Routes
 * @description Define all routes for user-specific pages (My Courses)
 */

import express from 'express';
import meController from '../app/controllers/meController.js';
import { requireAuth, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * User-specific Course Management Routes
 * All routes require authentication
 */

// Display all stored (not deleted) courses — requires admin
// Route: GET /me/stored/courses
router.get('/stored/courses', requireAuth, authorize('admin'), meController.storedCourses);

// Display all soft-deleted (trashed) courses — requires admin
// Route: GET /me/trash/courses
router.get('/trash/courses', requireAuth, authorize('admin'), meController.trashCourses);

export default router;
