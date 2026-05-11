import dashboardService from './dashboard.service.js';
import logger from '../../../shared/logger.js';

class DashboardController {
  async index(req, res, next) {
    try {
      const { search = '', level = '', status = '', sort = 'newest', page = 1, limit = 5 } = req.query;

      logger.debug('Admin dashboard requested', { search, level, status, sort, page });

      const data = await dashboardService.getDashboardData({ search, level, status, sort, page, limit });

      res.render('admin/dashboard', {
        layout: 'admin',
        pageTitle: 'Dashboard',
        ...data,
        filters: { search, level, status, sort },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();
