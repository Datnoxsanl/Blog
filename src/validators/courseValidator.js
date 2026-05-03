/**
 * @fileoverview Course Validators
 * @description Validation schemas for Course-related operations
 */

import Joi from 'joi';
import { COURSE_LEVELS, FORM_ACTIONS } from '../config/constants/index.js';

/**
 * Schema for creating a new course
 */
export const createCourseSchema = Joi.object({
  name: Joi.string()
    .required()
    .min(3)
    .max(255)
    .trim()
    .messages({
      'string.required': 'Course name is required',
      'string.min': 'Course name must be at least 3 characters',
      'string.max': 'Course name must not exceed 255 characters',
    }),

  description: Joi.string()
    .optional()
    .max(2000)
    .trim()
    .messages({
      'string.max': 'Description must not exceed 2000 characters',
    }),

  image: Joi.string()
    .optional()
    .uri()
    .messages({
      'string.uri': 'Image must be a valid URL',
    }),

  level: Joi.string()
    .optional()
    .valid(...Object.values(COURSE_LEVELS))
    .default(COURSE_LEVELS.BASIC)
    .messages({
      'string.valid': `Level must be one of: ${Object.values(COURSE_LEVELS).join(', ')}`,
    }),
});

/**
 * Schema for updating a course
 */
export const updateCourseSchema = Joi.object({
  name: Joi.string()
    .optional()
    .min(3)
    .max(255)
    .trim(),

  description: Joi.string()
    .optional()
    .max(2000)
    .trim(),

  image: Joi.string()
    .optional()
    .uri(),

  level: Joi.string()
    .optional()
    .valid(...Object.values(COURSE_LEVELS)),
});

/**
 * Schema for bulk course actions (delete, restore, etc.)
 */
export const bulkActionSchema = Joi.object({
  action: Joi.string()
    .required()
    .valid(...Object.values(FORM_ACTIONS))
    .messages({
      'string.required': 'Action is required',
      'string.valid': `Action must be one of: ${Object.values(FORM_ACTIONS).join(', ')}`,
    }),

  coursesIds: Joi.array()
    .items(Joi.string().required())
    .required()
    .min(1)
    .messages({
      'array.min': 'At least one course ID is required',
      'string.required': 'All course IDs must be valid strings',
    }),
});

/**
 * Schema for course ID parameter validation
 */
export const courseIdSchema = Joi.object({
  id: Joi.string()
    .required()
    .trim()
    .messages({
      'string.required': 'Course ID is required',
    }),
});

export default {
  createCourseSchema,
  updateCourseSchema,
  bulkActionSchema,
  courseIdSchema,
};
