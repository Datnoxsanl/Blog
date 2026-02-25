# Node-Bog

## Setup

- `npm init` => tạo file `package.json`

- `npm install express`

- `npm install nodemon`

- `npm install morgan`

- `npm install handlebars`

- Static file và SCSS

- Prettier, lint-staged, husky => github

```bash
npm i prettier lint-staged husky --save-dev
```

**Prettier:** [Docs](https://prettier.io/docs/cli.html)

```bash
npm run beauty
```

**lint-staged:** `git status` => `git add` => `git status` => `npm run beauty`

**Husky:** chạy tự động trước mỗi commit

---

## Cài đặt MongoDB Compass

[https://www.mongodb.com/try](https://www.mongodb.com/try)

---

## Model trong MVC

Cài đặt mongoose:

```bash
npm install mongoose
```

[https://github.com/Automattic/mongoose](https://github.com/Automattic/mongoose)

Kết nối database — `src/config/db`:

```js
await mongoose.connect("mongodb://localhost:27017/blog-test");
```

Tạo model — `src/app/models/Courses`



## JSON Viewer / Route methods / App listen log / Resource path

## Read From DB

handlebarjs

## Courses Detail Page

Mongoosejs [](https://mongoosejs.com/docs/queries.html)