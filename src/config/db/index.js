/**
 * @fileoverview MongoDB Connection
 * @description Establish MongoDB connection and handle connection errors
 */

import mongoose from 'mongoose';
import config from '../config.js';
import logger from '../../utils/logger.js';

/**
 * Connect to MongoDB database
 * 
 * @async
 * @returns {Promise<void>}
 * @throws {Error} If connection fails
 */
export const connectDB = async () => {
  try {
    logger.info('Connecting to MongoDB...', { uri: config.database.uri });

    // Establish MongoDB connection
    await mongoose.connect(config.database.uri, {
      // Modern Mongoose connection options
      maxPoolSize: 10,
      socketTimeoutMS: 45000,
    });

    logger.info('✓ MongoDB connected successfully', {
      database: config.database.name,
    });

    /**
     * Connection event listeners
     */

    // Log when connection is established
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to MongoDB');
    });

    // Log when connection is disconnected
    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from MongoDB');
    });

    // Log connection errors
    mongoose.connection.on('error', (err) => {
      logger.error('Mongoose connection error', { error: err.message });
    });

    // Log when reconnecting
    mongoose.connection.on('reconnected', () => {
      logger.info('Mongoose reconnected to MongoDB');
    });
  } catch (error) {
    logger.error('Failed to connect to MongoDB', {
      error: error.message,
      uri: config.database.uri,
    });

    // Re-throw error to be handled by caller
    throw error;
  }
};

/**
 * Disconnect from MongoDB database
 * 
 * @async
 * @returns {Promise<void>}
 */
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

export default {
  connectDB,
  disconnectDB,
};
