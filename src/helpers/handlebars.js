import Handlebars from 'handlebars';

const helpers = {
    sum: (a, b) => a + b,

    sortable: (field, sort) => {
        const sortType = field === sort.column ? sort.type : 'default';
        const icons = {
            default: 'fa-solid fa-sort',
            asc: 'fa-solid fa-sort-up',
            desc: 'fa-solid fa-sort-down',
        };
        const types = { default: 'asc', asc: 'desc', desc: 'asc' };
        const icon = icons[sortType];
        const type = types[sortType];
        const href = Handlebars.escapeExpression(`?_sort&column=${field}&type=${type}`);
        return new Handlebars.SafeString(`
      <a href="${href}">
        <i class="${icon}"></i>
      </a>
    `);
    },

    // Equality check: {{#if (eq a b)}}
    eq: (a, b) => a === b,

    // Not equal
    neq: (a, b) => a !== b,

    // Greater than
    gt: (a, b) => a > b,

    // Path prefix match for sidebar active state
    startsWith: (str, prefix) => !!(str && str.startsWith(prefix)),

    // Format date for display
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

    // Stringify to JSON (safe for embedding in script tags with triple mustache)
    json: (obj) => JSON.stringify(obj),

    // Truncate text
    truncate: (str, len = 50) => {
        if (!str) return '';
        return str.length > len ? str.slice(0, len) + '...' : str;
    },

    // Bootstrap badge color by course level
    levelBadge: (level) => {
        const map = { 'Cơ bản': 'success', 'Trung cấp': 'warning', 'Nâng cao': 'danger' };
        return map[level] || 'secondary';
    },

    // Bootstrap badge color by course status
    statusBadge: (status) => {
        const map = { published: 'success', draft: 'secondary', archived: 'warning' };
        return map[status] || 'secondary';
    },

    // Human-readable status label
    statusLabel: (status) => {
        const labels = { published: 'Published', draft: 'Draft', archived: 'Archived' };
        return labels[status] || (status || 'Unknown');
    },

    // Bootstrap badge color by user role
    roleBadge: (role) => {
        return role === 'admin' ? 'danger' : 'primary';
    },

    // Generate pagination range array as JSON for template iteration
    paginationRange: (currentPage, totalPages) => {
        const pages = [];
        const delta = 2;
        const left = Math.max(1, currentPage - delta);
        const right = Math.min(totalPages, currentPage + delta);
        for (let i = left; i <= right; i++) pages.push(i);
        return pages;
    },

    // Check if value is in an array
    includes: (arr, val) => Array.isArray(arr) && arr.includes(val),

    // Math add
    add: (a, b) => Number(a) + Number(b),

    // Math subtract
    sub: (a, b) => Number(a) - Number(b),

    // Capitalize first letter
    capitalize: (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    // Default fallback value
    defaultTo: (val, fallback) => val || fallback,
};

export default helpers;
