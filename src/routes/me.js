/**
 * @fileoverview Me (User) Routes
 * @description Define all routes for user-specific pages (My Courses)
 */

import express from 'express';
import meController from '../app/controllers/meController.js';

const router = express.Router();

/**
 * User-specific Course Management Routes
 */

// Display all stored (not deleted) courses
// Route: GET /me/stored/courses
router.get('/stored/courses', meController.storedCourses);

// Display all soft-deleted (trashed) courses
// Route: GET /me/trash/courses
router.get('/trash/courses', meController.trashCourses);

export default router;
