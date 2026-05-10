import logger from '../utils/logger.js';

/**
 * Middleware: require authenticated session
 * Redirects to /login and saves the intended URL in session
 */
export const requireAuth = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        logger.debug('Unauthenticated access attempt', { path: req.originalUrl });
        req.session.returnTo = req.originalUrl;
        return res.redirect('/login');
    }
    next();
};

/**
 * Middleware factory: authorize by role
 * Must be used after requireAuth (session.user is guaranteed to exist)
 * Usage: authorize('admin')
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        const userRole = req.session.user?.role;
        if (!userRole || !roles.includes(userRole)) {
            logger.debug('Unauthorized access attempt', {
                path: req.originalUrl,
                userRole,
                requiredRoles: roles,
            });
            return res.status(403).render('errors/403', { layout: 'main' });
        }
        next();
    };
};
