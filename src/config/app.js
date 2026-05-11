import dotenv from 'dotenv';

dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',

  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || 'localhost',
  },

  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/blog_edu',
    name: process.env.MONGODB_NAME || 'blog_edu',
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },

  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },

  session: {
    secret: process.env.SESSION_SECRET || 'fallback_secret_change_in_production',
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000', 10),
  },
};

export default config;
