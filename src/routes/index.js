import authRouter from '../modules/auth/auth.routes.js';
import adminRouter from '../modules/admin/admin.routes.js';
import coursesRouter from '../modules/courses/course.routes.js';
import siteRouter from '../modules/site/site.routes.js';

const route = (app) => {
  app.use('/', authRouter);
  app.use('/admin', adminRouter);
  app.use('/courses', coursesRouter);
  app.use('/', siteRouter);
};

export default route;
