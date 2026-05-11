import ApiError from '../shared/api-error.js';
import { HTTP_STATUS, MESSAGES } from '../config/constants.js';

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
        return next(new ApiError(MESSAGES.VALIDATION_ERROR, HTTP_STATUS.BAD_REQUEST, errors));
      }

      req[source] = value;
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default validateRequest;
