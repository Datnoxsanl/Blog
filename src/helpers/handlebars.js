/**
 * @fileoverview Handlebars Template Helpers
 * @description Custom helpers for Handlebars template engine
 */

import Handlebars from 'handlebars';

/**
 * Handlebars helpers object
 * Contains all custom helper functions for templates
 */
const helpers = {
  /**
   * Sum helper - Add two numbers
   * Usage: {{sum a b}}
   * 
   * @param {number} a - First number
   * @param {number} b - Second number
   * @returns {number} Sum of a and b
   */
  sum: (a, b) => a + b,

  /**
   * Sortable helper - Generate sortable column header links
   * Creates links that toggle sort direction and apply sorting
   * Usage: {{sortable 'fieldName' sort}}
   * 
   * @param {string} field - Column/field name to sort by
   * @param {object} sort - Sort object from res.locals._sort
   * @returns {Handlebars.SafeString} HTML link with sort icon
   */
  sortable: (field, sort) => {
    // Determine current sort type for this field
    const sortType = field === sort.column ? sort.type : 'default';

    // Icon mapping for different sort states
    const icons = {
      default: 'fa-solid fa-sort',           // Neutral sort icon
      asc: 'fa-solid fa-sort-up',            // Ascending sort icon
      desc: 'fa-solid fa-sort-down',         // Descending sort icon
    };

    // Sort type cycling: default -> asc -> desc -> asc
    const types = {
      default: 'asc',
      asc: 'desc',
      desc: 'asc',
    };

    const icon = icons[sortType];
    const type = types[sortType];

    // Generate query string for sort parameters
    const href = Handlebars.escapeExpression(
      `?_sort&column=${field}&type=${type}`,
    );

    // Return HTML link with icon
    return new Handlebars.SafeString(`
      <a href="${href}">
        <i class="${icon}"></i>
      </a>
    `);
  },
};

export default helpers;