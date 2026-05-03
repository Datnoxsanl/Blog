/**
 * @fileoverview Site Routes
 * @description Define general site routes (home, search, etc.)
 */

import express from 'express';
import siteController from '../app/controllers/siteController.js';

const router = express.Router();

/**
 * General Site Routes
 */

// Display search page
// Route: GET /search
router.get('/search', siteController.search);

// Display home page
// Route: GET /
router.get('/', siteController.index);

export default router;
