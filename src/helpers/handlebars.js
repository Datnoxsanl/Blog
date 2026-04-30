import Handlebars from "handlebars";

export default {
  sum: (a, b) => a + b,

  sortable: (field, sort) => {
    const sortType =
      field === sort.column ? sort.type : "default";

    const icons = {
      default: "fa-solid fa-sort",
      asc: "fa-solid fa-sort-up",
      desc: "fa-solid fa-sort-down",
    };

    const types = {
      default: "asc",
      asc: "desc",
      desc: "asc",
    };

    const icon = icons[sortType];
    const type = types[sortType];

    // const href = `?_sort&column=${field}&type=${type}`;
    const href = Handlebars.escapeExpression(`?_sort&column=${field}&type=${type}`);

    return new Handlebars.SafeString(`
      <a href="${href}">
        <i class="${icon}"></i>
      </a>
    `);
  },
};