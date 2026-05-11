import Course from '../../../models/course.model.js';
import User from '../../../models/user.model.js';
import ActivityLog from '../../../models/activity-log.model.js';
import logger from '../../../shared/logger.js';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

class DashboardService {
  async getStats() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [
      totalCourses,
      deletedCourses,
      totalUsers,
      newCoursesThisWeek,
      coursesByLevelRaw,
      coursesByStatusRaw,
    ] = await Promise.all([
      Course.countDocuments({}),
      Course.countDocumentsDeleted(),
      User.countDocuments({}),
      Course.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
      Course.aggregate([{ $group: { _id: '$level', count: { $sum: 1 } } }]),
      Course.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);

    const activeUsers = await User.countDocuments({ isActive: { $ne: false } });

    const coursesByLevel = {};
    coursesByLevelRaw.forEach(({ _id, count }) => { if (_id) coursesByLevel[_id] = count; });

    const coursesByStatus = { published: 0, draft: 0, archived: 0 };
    coursesByStatusRaw.forEach(({ _id, count }) => {
      if (_id && Object.prototype.hasOwnProperty.call(coursesByStatus, _id)) coursesByStatus[_id] = count;
    });
    if (coursesByStatusRaw.length === 0) coursesByStatus.published = totalCourses;

    return {
      totalCourses,
      activeCourses: totalCourses,
      deletedCourses,
      totalUsers,
      activeUsers,
      newCoursesThisWeek,
      coursesByLevel,
      coursesByStatus,
    };
  }

  async getRecentCourses({ search = '', level = '', status = '', sort = 'newest', page = 1, limit = 5 } = {}) {
    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (level) query.level = level;
    if (status) query.status = status;

    const sortOrder = sort === 'oldest' ? 1 : -1;
    const skip = (Number(page) - 1) * Number(limit);

    const [courses, total] = await Promise.all([
      Course.find(query).sort({ createdAt: sortOrder }).skip(skip).limit(Number(limit)).lean(),
      Course.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    return {
      courses,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages,
        hasPrev: Number(page) > 1,
        hasNext: Number(page) < totalPages,
        prevPage: Number(page) - 1,
        nextPage: Number(page) + 1,
      },
    };
  }

  async getRecentUsers(limit = 8) {
    return User.find({}).sort({ createdAt: -1 }).limit(limit).select('-password').lean();
  }

  _formatMonthlyData(rawData, months = 6) {
    const labels = [];
    const data = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      labels.push(`${MONTH_NAMES[month - 1]} ${year}`);
      const found = rawData.find((r) => r._id.year === year && r._id.month === month);
      data.push(found ? found.count : 0);
    }

    return { labels, data };
  }

  async getCoursesPerMonth(months = 6) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months + 1);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const raw = await Course.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    return this._formatMonthlyData(raw, months);
  }

  async getUsersPerMonth(months = 6) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months + 1);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const raw = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    return this._formatMonthlyData(raw, months);
  }

  async getRecentActivity(limit = 15) {
    return ActivityLog.find({}).sort({ createdAt: -1 }).limit(limit).lean();
  }

  async getDashboardData({ search = '', level = '', status = '', sort = 'newest', page = 1, limit = 5 } = {}) {
    try {
      const [stats, courseResult, recentUsers, coursesPerMonth, usersPerMonth, recentActivity] =
        await Promise.all([
          this.getStats(),
          this.getRecentCourses({ search, level, status, sort, page, limit }),
          this.getRecentUsers(),
          this.getCoursesPerMonth(),
          this.getUsersPerMonth(),
          this.getRecentActivity(),
        ]);

      const chartData = JSON.stringify({
        coursesPerMonth,
        usersPerMonth,
        coursesByLevel: {
          labels: Object.keys(stats.coursesByLevel),
          data: Object.values(stats.coursesByLevel),
        },
        coursesByStatus: {
          labels: ['Published', 'Draft', 'Archived'],
          data: [stats.coursesByStatus.published, stats.coursesByStatus.draft, stats.coursesByStatus.archived],
        },
      });

      return {
        stats,
        recentCourses: courseResult.courses,
        pagination: courseResult.pagination,
        recentUsers,
        recentActivity,
        chartData,
      };
    } catch (error) {
      logger.error('Error fetching dashboard data', { error: error.message });
      throw error;
    }
  }

  async logActivity({ actor, actorRole = 'admin', action, target, targetType, description, icon, iconColor }) {
    try {
      await ActivityLog.create({ actor, actorRole, action, target, targetType, description, icon, iconColor });
    } catch (error) {
      logger.error('Error logging activity', { error: error.message });
    }
  }
}

export default new DashboardService();
