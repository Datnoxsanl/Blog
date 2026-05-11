import config from '../config/app.js';

const LOG_LEVELS = { ERROR: 'ERROR', WARN: 'WARN', INFO: 'INFO', DEBUG: 'DEBUG' };

const COLORS = {
  RESET: '\x1b[0m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  CYAN: '\x1b[36m',
};

const getColorForLevel = (level) => {
  const map = { ERROR: COLORS.RED, WARN: COLORS.YELLOW, INFO: COLORS.BLUE, DEBUG: COLORS.CYAN };
  return map[level] || COLORS.RESET;
};

const formatLog = (level, message, data) => {
  const color = getColorForLevel(level);
  const timestamp = new Date().toISOString();
  const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
  return `${color}[${timestamp}] [${level}] ${message}${dataStr}${COLORS.RESET}`;
};

const logger = {
  error: (message, data) => console.error(formatLog(LOG_LEVELS.ERROR, message, data)),
  warn: (message, data) => console.warn(formatLog(LOG_LEVELS.WARN, message, data)),
  info: (message, data) => console.info(formatLog(LOG_LEVELS.INFO, message, data)),
  debug: (message, data) => {
    if (config.isDevelopment) console.log(formatLog(LOG_LEVELS.DEBUG, message, data));
  },
};

export default logger;
