/**
 * @fileoverview Courses Routes
 * @description Define all routes related to course operations
 */

import express from 'express';
import coursesController from '../app/controllers/CoursesController.js';

const router = express.Router();

/**
 * Course Management Routes
 * Follows RESTful conventions where possible
 */

// Display course creation form
// Route: GET /courses/create
router.get('/create', coursesController.create);

// Store newly created course
// Route: POST /courses/store
router.post('/store', coursesController.store);

// Handle bulk actions (delete, restore, etc.)
// Route: POST /courses/handle-form-actions
router.post('/handle-form-actions', coursesController.handleFormActions);

// Update course
// Route: PUT /courses/:id
router.put('/:id', coursesController.update);

// Soft delete course (move to trash)
// Route: DELETE /courses/:id
router.delete('/:id', coursesController.delete);

// Permanently delete course (cannot restore)
// Route: DELETE /courses/:id/force
router.delete('/:id/force', coursesController.forceDelete);

// Restore soft-deleted course from trash
// Route: PATCH /courses/:id/restore
router.patch('/:id/restore', coursesController.restore);

// Display course edit form
// Route: GET /courses/:id/edit
router.get('/:id/edit', coursesController.edit);

// Display course details by slug
// Route: GET /courses/:slug
// Note: Should be last as it's a catch-all for any slug
router.get('/:slug', coursesController.show);

export default router;
