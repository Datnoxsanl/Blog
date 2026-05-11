import Joi from 'joi';
import { COURSE_LEVELS, FORM_ACTIONS } from '../../config/constants.js';

export const createCourseSchema = Joi.object({
  name: Joi.string().required().min(3).max(255).trim().messages({
    'string.required': 'Course name is required',
    'string.min': 'Course name must be at least 3 characters',
    'string.max': 'Course name must not exceed 255 characters',
  }),
  description: Joi.string().optional().max(2000).trim(),
  image: Joi.string().optional().uri().messages({ 'string.uri': 'Image must be a valid URL' }),
  level: Joi.string().optional().valid(...Object.values(COURSE_LEVELS)).default(COURSE_LEVELS.BASIC),
  status: Joi.string().optional().valid('draft', 'published', 'archived').default('published'),
});

export const updateCourseSchema = Joi.object({
  name: Joi.string().optional().min(3).max(255).trim(),
  description: Joi.string().optional().max(2000).trim(),
  image: Joi.string().optional().uri(),
  level: Joi.string().optional().valid(...Object.values(COURSE_LEVELS)),
  status: Joi.string().optional().valid('draft', 'published', 'archived'),
});

export const bulkActionSchema = Joi.object({
  action: Joi.string().required().valid(...Object.values(FORM_ACTIONS)).messages({
    'string.required': 'Action is required',
  }),
  coursesIds: Joi.array().items(Joi.string().required()).required().min(1).messages({
    'array.min': 'At least one course ID is required',
  }),
});

export const courseIdSchema = Joi.object({
  id: Joi.string().required().trim(),
});
