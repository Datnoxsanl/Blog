/**
 * @fileoverview Courses Routes
 * @description Define all routes related to course operations
 */

import express from 'express';
import coursesController from '../app/controllers/CoursesController.js';
import { requireAuth, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * Course Management Routes
 * Follows RESTful conventions where possible
 */

// Display course creation form — requires admin
// Route: GET /courses/create
router.get('/create', requireAuth, authorize('admin'), coursesController.create);

// Store newly created course — requires admin
// Route: POST /courses/store
router.post('/store', requireAuth, authorize('admin'), coursesController.store);

// Handle bulk actions (delete, restore, etc.) — requires admin
// Route: POST /courses/handle-form-actions
router.post('/handle-form-actions', requireAuth, authorize('admin'), coursesController.handleFormActions);

// Update course — requires admin
// Route: PUT /courses/:id
router.put('/:id', requireAuth, authorize('admin'), coursesController.update);

// Soft delete course — requires admin
// Route: DELETE /courses/:id
router.delete('/:id', requireAuth, authorize('admin'), coursesController.delete);

// Permanently delete course — requires admin
// Route: DELETE /courses/:id/force
router.delete('/:id/force', requireAuth, authorize('admin'), coursesController.forceDelete);

// Restore soft-deleted course — requires admin
// Route: PATCH /courses/:id/restore
router.patch('/:id/restore', requireAuth, authorize('admin'), coursesController.restore);

// Display course edit form — requires admin
// Route: GET /courses/:id/edit
router.get('/:id/edit', requireAuth, authorize('admin'), coursesController.edit);

// Display course details by slug — public
// Route: GET /courses/:slug
// Note: Should be last as it's a catch-all for any slug
router.get('/:slug', coursesController.show);

export default router;
