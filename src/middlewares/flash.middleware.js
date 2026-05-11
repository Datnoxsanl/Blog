const flashMiddleware = (req, res, next) => {
  req.flash = (type, message) => {
    if (!req.session._flash) req.session._flash = {};
    req.session._flash[type] = message;
  };

  const flash = (req.session && req.session._flash) || {};
  if (req.session) req.session._flash = null;
  res.locals.flash = flash;

  next();
};

export default flashMiddleware;
