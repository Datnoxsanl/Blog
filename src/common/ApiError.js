/**
 * @fileoverview Custom Application Error Class
 * @description Define application-specific error handling
 */

/**
 * Custom API Error class
 * Extends Error to provide detailed error information
 */
class ApiError extends Error {
  /**
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {any} data - Additional error data
   */
  constructor(message, statusCode, data = null) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    this.timestamp = new Date().toISOString();

    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
