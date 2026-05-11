import CourseService from '../courses/course.service.js';
import logger from '../../shared/logger.js';

class SiteController {
  async index(req, res, next) {
    try {
      logger.debug('Loading home page');
      const courses = await CourseService.getFilteredCourses({});
      res.render('home', { courses });
    } catch (error) {
      logger.error('Error loading home page', { error: error.message });
      next(error);
    }
  }

  search(req, res) {
    res.render('search');
  }
}

export default new SiteController();
