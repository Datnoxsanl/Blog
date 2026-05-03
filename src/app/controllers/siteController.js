/**
 * @fileoverview Site Controller
 * @description Handle HTTP requests for main site pages
 */

import Courses from '../models/Courses.js';
import { mongooseArrayToObject } from '../../utils/mongoose.js';
import logger from '../../utils/logger.js';

/**
 * SiteController Class
 * Handles general site pages and navigation
 */
class SiteController {
  /**
   * [GET] /
   * Display home page with all available courses
   */
  async index(req, res, next) {
    try {
      logger.debug('Loading home page');

      // Fetch all courses from database
      const courses = await Courses.find({});

      res.render('home', {
        courses: mongooseArrayToObject(courses),
      });
    } catch (error) {
      logger.error('Error loading home page', { error: error.message });
      next(error);
    }
  }

  /**
   * [GET] /search
   * Display search page
   */
  search(req, res) {
    res.render('search');
  }
}

// Export singleton instance
export default new SiteController();
