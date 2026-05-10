import adminDashboardService from '../../services/adminDashboardService.js';
import logger from '../../utils/logger.js';

class AdminDashboardController {
    async index(req, res, next) {
        try {
            const { search = '', level = '', status = '', sort = 'newest', page = 1, limit = 5 } = req.query;

            logger.debug('Admin dashboard requested', { search, level, status, sort, page });

            const data = await adminDashboardService.getDashboardData({
                search,
                level,
                status,
                sort,
                page,
                limit,
            });

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

export default new AdminDashboardController();
