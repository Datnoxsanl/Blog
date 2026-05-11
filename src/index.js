import express from 'express';
import path from 'path';
import morgan from 'morgan';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import config from './config/app.js';
import { connectDB } from './config/database.js';
import logger from './shared/logger.js';

import sortMiddleware from './middlewares/sort.middleware.js';
import errorHandler from './middlewares/error.handler.js';
import flashMiddleware from './middlewares/flash.middleware.js';

import helpers from './shared/handlebars.helpers.js';
import route from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const initializeApp = async () => {
  try {
    logger.info('Starting application...', { environment: config.env, port: config.server.port });

    await connectDB();

    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(morgan('combined'));

    app.use(
      session({
        secret: config.session.secret,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
          mongoUrl: config.database.uri,
          dbName: config.database.name,
          ttl: config.session.maxAge / 1000,
        }),
        cookie: {
          httpOnly: true,
          maxAge: config.session.maxAge,
          secure: config.isProduction,
        },
      }),
    );

    app.use((req, res, next) => {
      res.locals.currentUser = req.session.user || null;
      res.locals.isAdmin = req.session.user?.role === 'admin';
      res.locals.currentPath = req.path;
      next();
    });

    app.use(flashMiddleware);

    app.engine('hbs', engine({ extname: '.hbs', helpers }));
    app.set('view engine', 'hbs');
    app.set('views', path.join(__dirname, 'resources', 'views'));

    app.use(methodOverride('_method'));
    app.use(sortMiddleware);

    route(app);

    app.use(errorHandler);

    app.listen(config.server.port, config.server.host, () => {
      logger.info('✓ Server started successfully', {
        url: `http://${config.server.host}:${config.server.port}`,
      });
    });

    process.on('SIGTERM', () => { logger.warn('SIGTERM received, shutting down gracefully...'); process.exit(0); });
    process.on('SIGINT', () => { logger.warn('SIGINT received, shutting down gracefully...'); process.exit(0); });

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Rejection', { reason: reason instanceof Error ? reason.message : reason });
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to initialize application', { error: error.message, stack: error.stack });
    process.exit(1);
  }
};

initializeApp();
