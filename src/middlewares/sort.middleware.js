import { SORT_OPTIONS } from '../config/constants.js';

const sortMiddleware = (req, res, next) => {
  res.locals._sort = {
    enabled: false,
    type: SORT_OPTIONS.DEFAULT,
    column: null,
  };

  if (Object.prototype.hasOwnProperty.call(req.query, '_sort')) {
    Object.assign(res.locals._sort, {
      enabled: true,
      type: req.query.type || SORT_OPTIONS.DEFAULT,
      column: req.query.column,
    });
  }

  next();
};

export default sortMiddleware;
