/**
 * @fileoverview Logger Utility
 * @description Centralized logging system for the application
 */

import config from '../config/config.js';

/**
 * Logger levels for different types of messages
 */
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};

/**
 * ANSI color codes for terminal output
 */
const COLORS = {
  RESET: '\x1b[0m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  CYAN: '\x1b[36m',
  GRAY: '\x1b[90m',
};

/**
 * Get color for log level
 * @param {string} level - Log level
 * @returns {string} ANSI color code
 */
const getColorForLevel = (level) => {
  switch (level) {
    case LOG_LEVELS.ERROR:
      return COLORS.RED;
    case LOG_LEVELS.WARN:
      return COLORS.YELLOW;
    case LOG_LEVELS.INFO:
      return COLORS.BLUE;
    case LOG_LEVELS.DEBUG:
      return COLORS.CYAN;
    default:
      return COLORS.RESET;
  }
};

/**
 * Format timestamp for logging
 * @returns {string} Formatted timestamp
 */
const getTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Format log message with timestamp, level, and color
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {any} data - Additional data to log
 * @returns {string} Formatted log message
 */
const formatLog = (level, message, data) => {
  const color = getColorForLevel(level);
  const timestamp = getTimestamp();
  const dataStr = data ? ` | ${JSON.stringify(data)}` : '';

  return `${color}[${timestamp}] [${level}] ${message}${dataStr}${COLORS.RESET}`;
};

/**
 * Central logger object with methods for each log level
 */
const logger = {
  /**
   * Log error message
   * @param {string} message - Error message
   * @param {any} data - Additional error data
   */
  error: (message, data) => {
    console.error(formatLog(LOG_LEVELS.ERROR, message, data));
  },

  /**
   * Log warning message
   * @param {string} message - Warning message
   * @param {any} data - Additional warning data
   */
  warn: (message, data) => {
    console.warn(formatLog(LOG_LEVELS.WARN, message, data));
  },

  /**
   * Log info message
   * @param {string} message - Info message
   * @param {any} data - Additional info data
   */
  info: (message, data) => {
    console.info(formatLog(LOG_LEVELS.INFO, message, data));
  },

  /**
   * Log debug message (only in development)
   * @param {string} message - Debug message
   * @param {any} data - Additional debug data
   */
  debug: (message, data) => {
    if (config.isDevelopment) {
      console.log(formatLog(LOG_LEVELS.DEBUG, message, data));
    }
  },
};

export default logger;
