/**
 * @fileoverview Sort Middleware
 * @description Handle sorting configuration for query results
 */

import { SORT_OPTIONS } from '../config/constants/index.js';

/**
 * Middleware to initialize sort configuration
 * Makes sorting information available to views through res.locals._sort
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
const sortMiddleware = (req, res, next) => {
  // Initialize default sort configuration
  res.locals._sort = {
    enabled: false,
    type: SORT_OPTIONS.DEFAULT,
    column: null,
  };

  // Check if sort query parameter exists
  if (Object.prototype.hasOwnProperty.call(req.query, '_sort')) {
    // Update sort configuration from query parameters
    Object.assign(res.locals._sort, {
      enabled: true,
      type: req.query.type || SORT_OPTIONS.DEFAULT,
      column: req.query.column,
    });
  }

  next();
};

export default sortMiddleware;
