import { HTTP_STATUS, MESSAGES } from '../config/constants.js';

class ApiResponse {
  static success(data = null, message = MESSAGES.SUCCESS, statusCode = HTTP_STATUS.OK) {
    return { success: true, statusCode, message, data, timestamp: new Date().toISOString() };
  }

  static error(message = MESSAGES.ERROR, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) {
    return { success: false, statusCode, message, errors, timestamp: new Date().toISOString() };
  }

  static validationError(errors) {
    return this.error(MESSAGES.VALIDATION_ERROR, HTTP_STATUS.BAD_REQUEST, errors);
  }

  static notFound(message = MESSAGES.NOT_FOUND) {
    return this.error(message, HTTP_STATUS.NOT_FOUND);
  }

  static unauthorized() {
    return this.error(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
  }
}

export default ApiResponse;
