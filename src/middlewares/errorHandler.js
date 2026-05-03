/**
 * @fileoverview Error Handling Middleware
 * @description Centralized error handling for the application
 */

import logger from '../utils/logger.js';
import ApiResponse from '../common/ApiResponse.js';
import ApiError from '../common/ApiError.js';
import { HTTP_STATUS, MESSAGES } from '../config/constants/index.js';

/**
 * Global error handling middleware
 * Should be used as the last middleware in the express app
 * 
 * @param {Error} err - Error object
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
  // Log error details
  logger.error(`${err.message} | Path: ${req.path} | Method: ${req.method}`, {
    statusCode: err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Handle custom API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(
      ApiResponse.error(err.message, err.statusCode, err.data),
    );
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }));

    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      ApiResponse.validationError(errors),
    );
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(HTTP_STATUS.CONFLICT).json(
      ApiResponse.error(
        `${field} already exists`,
        HTTP_STATUS.CONFLICT,
        { field },
      ),
    );
  }

  // Handle Mongoose cast errors
  if (err.name === 'CastError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      ApiResponse.error(
        'Invalid ID format',
        HTTP_STATUS.BAD_REQUEST,
      ),
    );
  }

  // Handle generic errors
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || MESSAGES.ERROR;

  return res.status(statusCode).json(
    ApiResponse.error(message, statusCode),
  );
};

export default errorHandler;
