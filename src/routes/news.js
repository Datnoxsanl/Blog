/**
 * @fileoverview News Routes
 * @description Define all routes related to news pages
 */

import express from 'express';
import newsController from '../app/controllers/NewsController.js';

const router = express.Router();

/**
 * News Routes
 */

// Display news detail by slug
// Route: GET /news/:slug
router.get('/:slug', newsController.show);

// Display news listing page
// Route: GET /news
router.get('/', newsController.index);

export default router;
