import Course from '../../models/course.model.js';
import ApiError from '../../shared/api-error.js';
import { HTTP_STATUS, MESSAGES } from '../../config/constants.js';
import logger from '../../shared/logger.js';

class CourseService {
  async createCourse(courseData) {
    const course = new Course(courseData);
    const saved = await course.save();
    logger.info('Course created successfully', { courseId: saved._id });
    return saved;
  }

  async getCourseBySlug(slug) {
    const course = await Course.findOne({ slug });
    if (!course) throw new ApiError(MESSAGES.COURSE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return course;
  }

  async getCourseById(id) {
    const course = await Course.findById(id);
    if (!course) throw new ApiError(MESSAGES.COURSE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return course;
  }

  async getAllCourses(req) {
    return Course.find({}).sortable(req);
  }

  async updateCourse(id, updateData) {
    const course = await Course.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!course) throw new ApiError(MESSAGES.COURSE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    logger.info('Course updated successfully', { courseId: id });
    return course;
  }

  async deleteCourse(id) {
    const course = await Course.delete({ _id: id });
    if (!course) throw new ApiError(MESSAGES.COURSE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    logger.info('Course soft deleted', { courseId: id });
    return course;
  }

  async restoreCourse(id) {
    const course = await Course.restore({ _id: id });
    if (!course) throw new ApiError(MESSAGES.COURSE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    logger.info('Course restored', { courseId: id });
    return course;
  }

  async forceDeleteCourse(id) {
    const result = await Course.deleteOne({ _id: id });
    if (result.deletedCount === 0) throw new ApiError(MESSAGES.COURSE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    logger.info('Course permanently deleted', { courseId: id });
    return result;
  }

  async getDeletedCourses() {
    return Course.findDeleted({});
  }

  async getDeletedCoursesCount() {
    return Course.countDocumentsDeleted();
  }

  async getFilteredCourses({ search = '', level = '', status = '', sort = 'newest' } = {}) {
    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (level) query.level = level;
    if (status) query.status = status;

    const sortOrder = sort === 'oldest' ? 1 : -1;
    return Course.find(query).sort({ createdAt: sortOrder }).lean();
  }

  async bulkDeleteCourses(courseIds) {
    const result = await Course.delete({ _id: { $in: courseIds } });
    logger.info('Courses bulk deleted', { count: courseIds.length });
    return result;
  }
}

export default new CourseService();
