/**
 * @fileoverview Mongoose Utility Functions
 * @description Helper functions for Mongoose document conversion and manipulation
 */

/**
 * Convert single Mongoose document to plain JavaScript object
 * 
 * @param {object} mongooseDoc - Mongoose document to convert
 * @returns {object|null} Plain JavaScript object or null if document is falsy
 * 
 * @example
 * const course = await Course.findById(id);
 * const plainObject = mongooseToObject(course);
 */
export const mongooseToObject = (mongooseDoc) => {
  return mongooseDoc ? mongooseDoc.toObject() : mongooseDoc;
};

/**
 * Convert array of Mongoose documents to plain JavaScript objects
 * 
 * @param {array} mongooseArray - Array of Mongoose documents to convert
 * @returns {array} Array of plain JavaScript objects
 * 
 * @example
 * const courses = await Course.find({});
 * const plainObjects = mongooseArrayToObject(courses);
 */
export const mongooseArrayToObject = (mongooseArray) => {
  return Array.isArray(mongooseArray)
    ? mongooseArray.map((doc) => mongooseToObject(doc))
    : mongooseArray;
};

export default {
  mongooseToObject,
  mongooseArrayToObject,
};
