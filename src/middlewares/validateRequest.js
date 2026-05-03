/**
 * @fileoverview Request Validation Middleware Factory
 * @description Create validation middleware for request validation
 */

import ApiError from '../common/ApiError.js';
import { HTTP_STATUS, MESSAGES } from '../config/constants/index.js';

/**
 * Factory function to create validation middleware
 * 
 * @param {object} schema - Validation schema (joi schema)
 * @param {string} source - Source to validate: 'body', 'query', 'params'
 * @returns {function} Middleware function for validation
 */
export const validateRequest = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const { value, error } = schema.validate(req[source], {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const errors = error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        }));

        return next(
          new ApiError(
            MESSAGES.VALIDATION_ERROR,
            HTTP_STATUS.BAD_REQUEST,
            errors,
          ),
        );
      }

      // Replace source data with validated data
      req[source] = value;
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default validateRequest;
