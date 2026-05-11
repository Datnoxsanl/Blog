import User from '../../models/user.model.js';
import ApiError from '../../shared/api-error.js';
import { HTTP_STATUS, AUTH_MESSAGES } from '../../config/constants.js';
import logger from '../../shared/logger.js';

class AuthService {
  async findUserByEmail(email) {
    return User.findOne({ email: email.toLowerCase().trim() });
  }

  async login(email, password) {
    const user = await this.findUserByEmail(email);

    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(AUTH_MESSAGES.LOGIN_FAILED, HTTP_STATUS.UNAUTHORIZED);
    }

    logger.info('User logged in successfully', { userId: user._id });
    return user;
  }

  async register(userData) {
    const existing = await this.findUserByEmail(userData.email);
    if (existing) {
      throw new ApiError(AUTH_MESSAGES.USER_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
    }

    const user = new User(userData);
    const saved = await user.save();
    logger.info('User registered successfully', { userId: saved._id });
    return saved;
  }
}

export default new AuthService();
