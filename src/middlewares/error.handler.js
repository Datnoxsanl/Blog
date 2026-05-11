import logger from '../shared/logger.js';
import ApiResponse from '../shared/api-response.js';
import ApiError from '../shared/api-error.js';
import { HTTP_STATUS, MESSAGES } from '../config/constants.js';

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message} | Path: ${req.path} | Method: ${req.method}`, {
    statusCode: err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(ApiResponse.error(err.message, err.statusCode, err.data));
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    return res.status(HTTP_STATUS.BAD_REQUEST).json(ApiResponse.validationError(errors));
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(HTTP_STATUS.CONFLICT).json(
      ApiResponse.error(`${field} already exists`, HTTP_STATUS.CONFLICT, { field }),
    );
  }

  if (err.name === 'CastError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      ApiResponse.error('Invalid ID format', HTTP_STATUS.BAD_REQUEST),
    );
  }

  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || MESSAGES.ERROR;
  return res.status(statusCode).json(ApiResponse.error(message, statusCode));
};

export default errorHandler;
