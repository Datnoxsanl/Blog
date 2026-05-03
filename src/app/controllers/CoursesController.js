/**
 * @fileoverview Courses Controller
 * @description Handle HTTP requests related to courses
 * Contains request handling and response logic (thin layer)
 */

import CourseService from '../../services/CourseService.js';
import { mongooseToObject, mongooseArrayToObject } from '../../utils/mongoose.js';
import logger from '../../utils/logger.js';

/**
 * CoursesController Class
 * Handles all HTTP requests related to course operations
 */
class CoursesController {
  /**
   * [GET] /courses/:slug
   * Display course details by slug
   */
  async show(req, res, next) {
    try {
      const { slug } = req.params;

      logger.debug('Getting course by slug', { slug });

      const course = await CourseService.getCourseBySlug(slug);

      res.render('courses/show', mongooseToObject(course));
    } catch (error) {
      next(error);
    }
  }

  /**
   * [GET] /courses/create
   * Display course creation form
   */
  create(req, res) {
    res.render('courses/create');
  }

  /**
   * [POST] /courses/store
   * Store newly created course to database
   */
  async store(req, res, next) {
    try {
      logger.debug('Creating new course', { data: req.body });

      await CourseService.createCourse(req.body);

      // Redirect to stored courses page
      res.redirect('/me/stored/courses');
    } catch (error) {
      next(error);
    }
  }

  /**
   * [GET] /courses/:id/edit
   * Display course edit form
   */
  async edit(req, res, next) {
    try {
      const { id } = req.params;

      logger.debug('Getting course for edit', { id });

      const course = await CourseService.getCourseById(id);

      res.render('courses/edit', {
        course: mongooseToObject(course),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * [PUT] /courses/:id
   * Update course information
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;

      logger.debug('Updating course', { id, data: req.body });

      await CourseService.updateCourse(id, req.body);

      // Redirect to stored courses page
      res.redirect('/me/stored/courses');
    } catch (error) {
      next(error);
    }
  }

  /**
   * [DELETE] /courses/:id
   * Soft delete course (move to trash)
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;

      logger.debug('Deleting course (soft delete)', { id });

      await CourseService.deleteCourse(id);

      // Redirect to stored courses page
      res.redirect('/me/stored/courses');
    } catch (error) {
      next(error);
    }
  }

  /**
   * [PATCH] /courses/:id/restore
   * Restore soft deleted course from trash
   */
  async restore(req, res, next) {
    try {
      const { id } = req.params;

      logger.debug('Restoring course', { id });

      await CourseService.restoreCourse(id);

      // Redirect to trash page
      res.redirect('/me/trash/courses');
    } catch (error) {
      next(error);
    }
  }

  /**
   * [DELETE] /courses/:id/force
   * Permanently delete course (cannot be restored)
   */
  async forceDelete(req, res, next) {
    try {
      const { id } = req.params;

      logger.debug('Force deleting course', { id });

      await CourseService.forceDeleteCourse(id);

      // Redirect to trash page
      res.redirect('/me/trash/courses');
    } catch (error) {
      next(error);
    }
  }

  /**
   * [POST] /courses/handle-form-actions
   * Handle bulk actions on courses (delete, restore, etc.)
   */
  async handleFormActions(req, res, next) {
    try {
      const { action, coursesIds } = req.body;

      logger.debug('Handling form action', { action, courseCount: coursesIds.length });

      // Handle different actions
      switch (action) {
        case 'delete':
          await CourseService.bulkDeleteCourses(coursesIds);
          res.redirect('/me/stored/courses');
          break;

        default:
          // If action is invalid, let error handler catch it
          throw new Error(`Invalid action: ${action}`);
      }
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export default new CoursesController();
