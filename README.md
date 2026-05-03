# Blog Project

## Overview

Đây là một dự án Blog nhỏ xây dựng bằng Node.js, Express và MongoDB (Mongoose). Dự án đã được tổ chức lại theo cấu trúc chuẩn doanh nghiệp, với tách biệt rõ ràng giữa:

- `controllers/` — xử lý request và response
- `services/` — business logic
- `models/` — schema Mongoose
- `routes/` — định nghĩa các đường dẫn
- `middlewares/` — xử lý chung giữa các request
- `validators/` — xác thực dữ liệu đầu vào
- `utils/` — helper dùng chung
- `config/` — cấu hình và constants

## Features

- Quản lý khóa học (Courses)
- Tạo, sửa, xóa, xem chi tiết khóa học
- Soft delete / restore / force delete
- Sort courses trên trang quản lý
- Handlebars làm template engine
- Middleware xử lý lỗi và sort
- Logging chuyên nghiệp với `logger.js`
- Môi trường cấu hình bằng `.env`

## Requirements

- Node.js 16+
- npm
- MongoDB đang chạy trên `mongodb://localhost:27017`

## Setup

1. Cài đặt dependencies:

```bash
npm install
```

2. Sao chép file cấu hình môi trường:

```bash
cp .env.example .env
```

3. Chỉnh sửa `.env` nếu cần:

```env
NODE_ENV=development
PORT=3000
HOST=localhost
MONGODB_URI=mongodb://localhost:27017/blog_edu
MONGODB_NAME=blog_edu
LOG_LEVEL=info
CORS_ORIGIN=*
```

4. Khởi động ứng dụng:

```bash
npm start
```

## Available Scripts

- `npm start` — chạy ứng dụng bằng `nodemon`
- `npm run beauty` — format lại file bằng Prettier
- `npm run watch` — build SCSS thành CSS và theo dõi thay đổi

## Static files & SCSS

- Thư mục tĩnh: `src/public/`
- SCSS nguồn: `src/resources/scss/`
- Biên dịch SCSS sang CSS bằng `npm run watch`
- Tập trung giữ `static assets` nguyên vẹn và cập nhật CSS tự động

## Formatting & Git Hooks

Dự án đã sử dụng `prettier`, `lint-staged`, và `husky` để đảm bảo mã nguồn sạch trước khi commit.

```bash
npm i prettier lint-staged husky --save-dev
```

- **Prettier:** [Docs](https://prettier.io/docs/cli.html)
- **Lint-staged:** format file staged trước khi commit
- **Husky:** chạy script tự động trước commit

Thông thường workflow:

1. `git status`
2. `git add <files>`
3. `git status`
4. `npm run beauty`

## MongoDB Compass

Nếu cần quản lý database bằng GUI, dùng MongoDB Compass:

[https://www.mongodb.com/try](https://www.mongodb.com/try)

## Mongoose & MVC Model

Dự án dùng `mongoose` để kết nối MongoDB và định nghĩa schema.

```bash
npm install mongoose
```

Kết nối database trong `src/config/db/index.js`:

```js
await mongoose.connect('mongodb://localhost:27017/blog_edu');
```

Model course hiện tại nằm ở `src/app/models/Courses.js`.

## Courses Model & Slug

Khóa học (`Courses`) được xây dựng với:

- `name`
- `description`
- `image`
- `level`
- `slug`

Slug được tạo tự động bằng `slugify`:

```bash
npm install slugify
```

Plugin `mongoose-sequence` được dùng để tăng `_id` tự động:

```bash
npm install --save mongoose-sequence
```

Plugin `mongoose-delete` dùng cho soft delete:

```bash
npm install mongoose-delete
```

## Update courses

Sử dụng Handlebars để hiển thị form chỉnh sửa và điều khiển index:

```hbs
<th scope="row">{{ sum @index 1 }}</th>
```

Xử lý PUT/PATCH trong form:

```bash
npm install method-override
```

```js
import methodOverride from 'method-override';
app.use(methodOverride('_method'));
```

Sau khi sửa, cập nhật dữ liệu trong MongoDB bằng `updateOne()` hoặc `findByIdAndUpdate()`.

## Delete course

Mẫu link xóa khóa học có thể được hiển thị như sau:

```html
<a
  href="/courses/{{this._id}}/delete"
  class="btn btn-link"
  data-bs-toggle="modal"
  data-bs-target="#delete-course-modal"
  data-id="{{this._id}}"
>Xóa</a>
```

## Soft delete

Dự án hiện hỗ trợ:

- `delete` — soft delete, đưa vào thùng rác
- `restore` — khôi phục từ thùng rác
- `force delete` — xóa vĩnh viễn

Logic soft delete dùng `mongoose-delete`:

- Soft delete: `delete({ _id })`
- Restore: `restore({ _id })`
- Force delete: `deleteOne({ _id })`

## Select all with checkbox

Các chức năng hỗ trợ:

- xóa tất cả
- khôi phục tất cả
- xóa vĩnh viễn tất cả

Phần này có thể được mở rộng bằng checkbox trong view và action bulk trên server.

## Sort middleware

Phần sort dùng query `?_sort&column=<field>&type=<asc|desc>`.

Trong Express middleware, `res.locals._sort` được truyền vào view để hiển thị trạng thái sort.

### XSS note

Khi dùng helper sort trong Handlebars, hãy lưu ý:

```hbs
{{sortable "name" _sort}}
```

Không nên dùng `{{{sortable "name" _sort}}}` nếu helper không escape dữ liệu.
Helper hiện tại đã sử dụng `Handlebars.escapeExpression(...)` để tránh XSS.

## Project Structure

```text
src/
├── app/
│   ├── controllers/
│   ├── models/
│   └── middleware/
├── config/
│   ├── constants/
│   ├── config.js
│   └── db/
├── common/
├── helpers/
├── middlewares/
├── routes/
├── services/
├── validators/
├── utils/
└── resources/
```

## Architecture

Ứng dụng theo mô hình MVC mở rộng với Service Layer:

- `routes/` định nghĩa URL
- `controllers/` xử lý HTTP request và render view/redirect
- `services/` chứa logic xử lý dữ liệu và tương tác với database
- `models/` định nghĩa schema Mongoose
- `middlewares/` xử lý lỗi, validation và sort

## Important Files

- `src/index.js` — entry point của ứng dụng
- `src/config/config.js` — cấu hình môi trường và app
- `src/config/db/index.js` — kết nối MongoDB
- `src/common/ApiError.js` — custom error class
- `src/common/ApiResponse.js` — response format chuẩn
- `src/services/CourseService.js` — business logic khóa học
- `src/middlewares/errorHandler.js` — error handling trung tâm
- `src/validators/courseValidator.js` — Joi validation schema

## Notes

- Tất cả code đã được chuyển sang ES Modules.
- Dữ liệu và cấu hình được tách khỏi code, dùng `.env`.
- Routes và controller đã được tổ chức rõ ràng để dễ bảo trì.
- Thêm Logging và Error Handling ở mọi bước quan trọng.

## Development Tips

- Nếu muốn thêm chức năng mới, hãy tạo:
  1. Model trong `src/app/models/`
  2. Service trong `src/services/`
  3. Validator trong `src/validators/`
  4. Controller trong `src/app/controllers/`
  5. Route trong `src/routes/`

- Sử dụng `logger.js` để ghi log thay vì `console.log()`.
- Nếu cần thêm middleware, đặt vào `src/middlewares/`.

## References

- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [Handlebars](https://handlebarsjs.com/)
- [dotenv](https://github.com/motdotla/dotenv)
- [Joi](https://joi.dev/)

---

## License

ISC
