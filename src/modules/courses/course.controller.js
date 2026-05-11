import CourseService from './course.service.js';
import { mongooseToObject } from '../../shared/mongoose.utils.js';
import logger from '../../shared/logger.js';

class CourseController {
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
}

export default new CourseController();
