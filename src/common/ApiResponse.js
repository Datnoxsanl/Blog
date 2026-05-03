/**
 * @fileoverview Response Formatter Utility
 * @description Standardized API response format for consistent responses
 */

import { HTTP_STATUS, MESSAGES } from '../config/constants/index.js';

/**
 * Standard API Response Format
 * @class ApiResponse
 */
class ApiResponse {
  /**
   * Create a successful response
   * @param {any} data - Response data
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code
   * @returns {object} Formatted response object
   */
  static success(data = null, message = MESSAGES.SUCCESS, statusCode = HTTP_STATUS.OK) {
    return {
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create an error response
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {any} errors - Additional error details
   * @returns {object} Formatted error response object
   */
  static error(message = MESSAGES.ERROR, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) {
    return {
      success: false,
      statusCode,
      message,
      errors,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create a validation error response
   * @param {any} errors - Validation errors
   * @returns {object} Formatted validation error response
   */
  static validationError(errors) {
    return this.error(
      MESSAGES.VALIDATION_ERROR,
      HTTP_STATUS.BAD_REQUEST,
      errors,
    );
  }

  /**
   * Create a not found response
   * @param {string} message - Not found message
   * @returns {object} Formatted not found response
   */
  static notFound(message = MESSAGES.NOT_FOUND) {
    return this.error(message, HTTP_STATUS.NOT_FOUND);
  }

  /**
   * Create an unauthorized response
   * @returns {object} Formatted unauthorized response
   */
  static unauthorized() {
    return this.error(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
  }
}

export default ApiResponse;
