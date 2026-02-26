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

## Create new courses 

[https://mongoosejs.com/docs/models.html#constructing-documents]

npm i mongoose-slug-generator (https://www.npmjs.com/package/mongoose-slug-generator) -> tự động tạo slug /model/Courses 
-> KHÔNG tương thích với Mongoose 8

npm install slugify

## update courses

[https://handlebarsjs.com/guide/] -> đánh index hiện thị từ 1 (handlebarJS)

express-handlebar -> 
`` app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    helpers: {
     sum: (a, b) => a + b,
    },
  }),
); ``

 `` <th scope="row">{{ sum @index 1 }}</th> ``

method cần dùng PUT/PATCH -> [https://expressjs.com/en/resources/middleware/method-override.html] 
npm install method-override
const methodOverride = require('method-override')
// override with POST having ?_method=DELETE
app.use(methodOverride('_method')

lưu lại vào db sau khi sửa -> mongoose: updateOne()