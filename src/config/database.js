import mongoose from 'mongoose';
import config from './app.js';
import logger from '../shared/logger.js';

export const connectDB = async () => {
  try {
    logger.info('Connecting to MongoDB...', { uri: config.database.uri });

    await mongoose.connect(config.database.uri, {
      maxPoolSize: 10,
      socketTimeoutMS: 45000,
    });

    logger.info('✓ MongoDB connected successfully', { database: config.database.name });

    mongoose.connection.on('connected', () => logger.info('Mongoose connected to MongoDB'));
    mongoose.connection.on('disconnected', () => logger.warn('Mongoose disconnected from MongoDB'));
    mongoose.connection.on('error', (err) => logger.error('Mongoose connection error', { error: err.message }));
    mongoose.connection.on('reconnected', () => logger.info('Mongoose reconnected to MongoDB'));
  } catch (error) {
    logger.error('Failed to connect to MongoDB', { error: error.message, uri: config.database.uri });
    throw error;
  }
};

export const disconnectDB = async () => {
  try {
    logger.info('Disconnecting from MongoDB...');
    await mongoose.disconnect();
    logger.info('✓ MongoDB disconnected');
  } catch (error) {
    logger.error('Error disconnecting from MongoDB', { error: error.message });
    throw error;
  }
};
