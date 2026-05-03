/**
 * @fileoverview Me Controller
 * @description Handle HTTP requests for user-specific pages (My Courses)
 */

import Courses from '../models/Courses.js';
import { mongooseArrayToObject } from '../../utils/mongoose.js';
import logger from '../../utils/logger.js';

/**
 * MeController Class
 * Handles user-specific course management pages
 */
class MeController {
  /**
   * [GET] /me/stored/courses
   * Display all stored (not deleted) courses created by user
   */
  async storedCourses(req, res, next) {
    try {
      logger.debug('Loading stored courses page');

      // Fetch stored courses and count of deleted courses in parallel
      const [courses, deletedCount] = await Promise.all([
        Courses.find({}).sortable(req), // Apply sorting from request parameters
        Courses.countDocumentsDeleted(),
      ]);

      res.render('me/stored-courses', {
        courses: mongooseArrayToObject(courses),
        deletedCount,
      });
    } catch (error) {
      logger.error('Error loading stored courses', { error: error.message });
      next(error);
    }
  }

  /**
   * [GET] /me/trash/courses
   * Display all soft-deleted (trashed) courses
   */
  async trashCourses(req, res, next) {
    try {
      logger.debug('Loading trash courses page');

      // Fetch all deleted courses
      const deletedCourses = await Courses.findDeleted({});

      res.render('me/trash-courses', {
        courses: mongooseArrayToObject(deletedCourses),
        deleted: req.query.deleted,
      });
    } catch (error) {
      logger.error('Error loading trash courses', { error: error.message });
      next(error);
    }
  }
}

// Export singleton instance
export default new MeController();
