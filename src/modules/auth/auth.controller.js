import AuthService from './auth.service.js';
import { loginSchema, registerSchema } from './auth.validator.js';
import logger from '../../shared/logger.js';

const ROLE_REDIRECT = {
  admin: '/admin/dashboard',
  user: '/',
};

class AuthController {
  showLogin(req, res) {
    if (req.session.userId) {
      return res.redirect(ROLE_REDIRECT[req.session.user?.role] || '/');
    }
    res.render('auth/login', { layout: 'auth' });
  }

  async login(req, res) {
    try {
      const { error, value } = loginSchema.validate(req.body, { abortEarly: false });

      if (error) {
        const errors = {};
        error.details.forEach((d) => { errors[d.path[0]] = d.message; });
        return res.render('auth/login', { layout: 'auth', errors, oldInput: { email: req.body.email } });
      }

      const { email, password, remember } = value;
      const user = await AuthService.login(email, password);

      req.session.userId = user._id.toString();
      req.session.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      };

      if (remember) req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;

      logger.info('User logged in', { userId: user._id, role: user.role });

      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      const redirectTo = returnTo && returnTo.startsWith('/') ? returnTo : (ROLE_REDIRECT[user.role] || '/');
      return res.redirect(redirectTo);
    } catch (error) {
      logger.error('Login error', { error: error.message });
      return res.render('auth/login', {
        layout: 'auth',
        authError: error.message,
        oldInput: { email: req.body.email },
      });
    }
  }

  showRegister(req, res) {
    if (req.session.userId) {
      return res.redirect(ROLE_REDIRECT[req.session.user?.role] || '/');
    }
    res.render('auth/register', { layout: 'auth' });
  }

  async register(req, res) {
    try {
      const { error, value } = registerSchema.validate(req.body, { abortEarly: false });

      if (error) {
        const errors = {};
        error.details.forEach((d) => { errors[d.path[0]] = d.message; });
        return res.render('auth/register', {
          layout: 'auth',
          errors,
          oldInput: { name: req.body.name, email: req.body.email },
        });
      }

      const { name, email, password } = value;
      const user = await AuthService.register({ name, email, password });

      req.session.userId = user._id.toString();
      req.session.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      };

      logger.info('User registered and logged in', { userId: user._id });
      return res.redirect('/');
    } catch (error) {
      logger.error('Register error', { error: error.message });
      return res.render('auth/register', {
        layout: 'auth',
        authError: error.message,
        oldInput: { name: req.body.name, email: req.body.email },
      });
    }
  }

  logout(req, res) {
    req.session.destroy((err) => {
      if (err) logger.error('Session destroy error', { error: err.message });
      res.redirect('/');
    });
  }
}

export default new AuthController();
