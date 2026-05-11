import Handlebars from 'handlebars';

const helpers = {
  sum: (a, b) => a + b,

  sortable: (field, sort) => {
    const sortType = field === sort.column ? sort.type : 'default';
    const icons = { default: 'fa-solid fa-sort', asc: 'fa-solid fa-sort-up', desc: 'fa-solid fa-sort-down' };
    const types = { default: 'asc', asc: 'desc', desc: 'asc' };
    const icon = icons[sortType];
    const type = types[sortType];
    const href = Handlebars.escapeExpression(`?_sort&column=${field}&type=${type}`);
    return new Handlebars.SafeString(`<a href="${href}"><i class="${icon}"></i></a>`);
  },

  eq: (a, b) => a === b,
  neq: (a, b) => a !== b,
  gt: (a, b) => a > b,

  startsWith: (str, prefix) => !!(str && str.startsWith(prefix)),

  formatDate: (date, format = 'short') => {
    if (!date) return 'N/A';
    const d = new Date(date);
    if (isNaN(d)) return 'N/A';
    if (format === 'relative') {
      const diff = Date.now() - d.getTime();
      const mins = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);
      if (mins < 1) return 'Just now';
      if (mins < 60) return `${mins}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 7) return `${days}d ago`;
    }
    return d.toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' });
  },

  json: (obj) => JSON.stringify(obj),

  truncate: (str, len = 50) => {
    if (!str) return '';
    return str.length > len ? str.slice(0, len) + '...' : str;
  },

  levelBadge: (level) => {
    const map = { 'Cơ bản': 'success', 'Trung cấp': 'warning', 'Nâng cao': 'danger' };
    return map[level] || 'secondary';
  },

  statusBadge: (status) => {
    const map = { published: 'success', draft: 'secondary', archived: 'warning' };
    return map[status] || 'secondary';
  },

  statusLabel: (status) => {
    const labels = { published: 'Published', draft: 'Draft', archived: 'Archived' };
    return labels[status] || (status || 'Unknown');
  },

  roleBadge: (role) => (role === 'admin' ? 'danger' : 'primary'),

  paginationRange: (currentPage, totalPages) => {
    const pages = [];
    const delta = 2;
    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);
    for (let i = left; i <= right; i++) pages.push(i);
    return pages;
  },

  includes: (arr, val) => Array.isArray(arr) && arr.includes(val),

  add: (a, b) => Number(a) + Number(b),
  sub: (a, b) => Number(a) - Number(b),

  capitalize: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  defaultTo: (val, fallback) => val || fallback,
};

export default helpers;
