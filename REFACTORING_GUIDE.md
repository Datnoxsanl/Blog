# Project Refactoring Guide - Enterprise-Standard Structure

## 📋 Overview
Dự án đã được refactor hoàn toàn theo chuẩn doanh nghiệp với cấu trúc rõ ràng, maintainable, và scalable.

## 🎯 Những Thay Đổi Chính

### 1. **Cấu Trúc Thư Mục Enterprise-Standard**
```
src/
├── config/              # Configuration files
│   ├── config.js       # Main configuration
│   ├── constants/      # Application constants
│   └── db/             # Database configuration
├── app/                # Application core
│   ├── controllers/    # Request handlers
│   ├── models/         # Database models
│   └── middleware/     # Express middleware
├── services/           # Business logic layer
├── routes/             # API routes
├── middlewares/        # Reusable middleware
├── validators/         # Request validation schemas
├── utils/              # Utility functions
├── helpers/            # Template helpers
├── common/             # Common classes (ApiResponse, ApiError)
└── resources/          # Views and assets
```

### 2. **Consistent ES Modules**
- Toàn bộ project đã chuyển sang ES Modules
- Thêm `"type": "module"` trong `package.json`
- Tất cả imports/exports đều consistent

### 3. **Environment Variables Configuration**
- Tạo file `.env` và `.env.example` cho configuration
- Sử dụng `dotenv` package để load environment variables
- Config centralized tại `src/config/config.js`

### 4. **Service Layer - Separation of Concerns**
- Tạo `CourseService.js` để chứa business logic
- Controllers chỉ xử lý HTTP requests/responses
- Services xử lý logic liên quan đến database

**Before:**
```javascript
// Controller xử lý cả business logic lẫn request handling
store(req, res, next) {
  const course = new Courses(req.body);
  course.save().then(() => res.redirect(...))
}
```

**After:**
```javascript
// Controller: chỉ xử lý HTTP
async store(req, res, next) {
  await CourseService.createCourse(req.body);
  res.redirect('/me/stored/courses');
}

// Service: xử lý business logic
async createCourse(courseData) {
  const course = new Courses(courseData);
  return await course.save();
}
```

### 5. **Error Handling**
- Tạo `ApiError` class cho custom errors
- Tạo global `errorHandler` middleware
- Standardized error responses với `ApiResponse`

```javascript
// Throw custom errors
throw new ApiError(
  MESSAGES.COURSE_NOT_FOUND,
  HTTP_STATUS.NOT_FOUND
);

// Responses được format consistent
{
  success: false,
  statusCode: 404,
  message: "Course not found",
  timestamp: "2024-01-01T12:00:00Z"
}
```

### 6. **Request Validation**
- Tạo validators sử dụng Joi schema
- Validators for `createCourse`, `updateCourse`, `bulkAction`
- Validation middleware factory pattern

```javascript
// Define schema
const createCourseSchema = Joi.object({
  name: Joi.string().required().min(3),
  description: Joi.string().optional()
});

// Use in route
router.post('/store', validateRequest(createCourseSchema), ...)
```

### 7. **Logging System**
- Centralized logger tại `src/utils/logger.js`
- Methods: `logger.error()`, `logger.warn()`, `logger.info()`, `logger.debug()`
- Color-coded output với timestamps

```javascript
logger.info('Course created', { courseId: 123 });
// Output: [2024-01-01T12:00:00Z] [INFO] Course created | {"courseId": 123}
```

### 8. **Comprehensive Comments**
- Thêm JSDoc comments cho tất cả functions
- Comments giải thích business logic phức tạp
- Removed commented-out code

### 9. **Constants Management**
- Centralized constants tại `src/config/constants/index.js`
- Gồm: HTTP_STATUS, MESSAGES, COURSE_LEVELS, FORM_ACTIONS, etc.

### 10. **Async/Await Pattern**
- Converted từ Promise chaining sang async/await
- Cleaner code, better error handling
- Try-catch blocks for error management

## 📦 New Dependencies

```bash
npm install dotenv joi
```

### Added to package.json:
- **dotenv**: Load environment variables
- **joi**: Request validation schemas

## 🚀 How to Use

### 1. Setup Environment
```bash
# Copy .env.example to .env
cp .env.example .env

# Install dependencies
npm install
```

### 2. Run Application
```bash
npm start
```

### 3. Development Workflow

#### Creating a New Feature (Example: News CRUD)

**Step 1: Create Model** (`src/app/models/News.js`)
```javascript
import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: String,
  content: String,
  slug: String
}, { timestamps: true });

export default mongoose.model('News', newsSchema);
```

**Step 2: Create Service** (`src/services/NewsService.js`)
```javascript
import News from '../app/models/News.js';
import ApiError from '../common/ApiError.js';

class NewsService {
  async createNews(newsData) {
    const news = new News(newsData);
    return await news.save();
  }
  
  async getNewsBySlug(slug) {
    const news = await News.findOne({ slug });
    if (!news) throw new ApiError('News not found', 404);
    return news;
  }
}

export default new NewsService();
```

**Step 3: Create Validator** (`src/validators/newsValidator.js`)
```javascript
import Joi from 'joi';

export const createNewsSchema = Joi.object({
  title: Joi.string().required().min(5),
  content: Joi.string().required().min(20)
});
```

**Step 4: Create Controller** (`src/app/controllers/NewsController.js`)
```javascript
import NewsService from '../../services/NewsService.js';

class NewsController {
  async create(req, res, next) {
    try {
      const news = await NewsService.createNews(req.body);
      res.json({ success: true, data: news });
    } catch (error) {
      next(error);
    }
  }
}
```

**Step 5: Create Routes** (`src/routes/news.js`)
```javascript
import express from 'express';
import newsController from '../app/controllers/NewsController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createNewsSchema } from '../validators/newsValidator.js';

const router = express.Router();

router.post('/', validateRequest(createNewsSchema), newsController.create);

export default router;
```

## 📚 Key Patterns & Best Practices

### 1. **Separation of Concerns**
- Controllers: HTTP layer only
- Services: Business logic
- Models: Database schema
- Validators: Input validation
- Middleware: Cross-cutting concerns

### 2. **Error Handling**
- Use ApiError for business logic errors
- Global error handler catches all errors
- Consistent error response format

### 3. **Logging**
- Log important operations (create, update, delete)
- Log errors with context
- Use different log levels appropriately

### 4. **Naming Conventions**
- Controllers: PascalCase (e.g., `CoursesController`)
- Services: PascalCase with "Service" suffix (e.g., `CourseService`)
- Routes: kebab-case URLs
- Methods: camelCase (e.g., `getCourseById`)

### 5. **Async Operations**
- Always use async/await
- Wrap in try-catch
- Pass errors to Express error handler

## 🔒 Security Improvements

### Implemented:
- Environment variables for sensitive data
- Input validation with Joi
- Handlebars template escaping
- Express security defaults

### Recommended:
- Add helmet.js for HTTP headers
- Add CORS configuration
- Add rate limiting
- Add SQL injection prevention (Mongoose helps)

## 📈 Scalability Improvements

### Current:
- Service layer for easy testing
- Modular structure for feature addition
- Constants management
- Logging for debugging

### For Future Growth:
- Add caching layer (Redis)
- Add queue system (Bull)
- Add authentication/authorization
- Add API versioning
- Add tests (Jest/Mocha)
- Add CI/CD pipeline

## 🐛 Debugging

### Enable Debug Logging
Set `LOG_LEVEL=debug` in `.env`

### View Database Queries
```javascript
// In service methods, logs will show parameters
logger.debug('Creating course', { courseData });
```

### Check Application State
Use `logger.info()` at key points in application flow

## 📝 Migration Notes

### Files Moved/Renamed:
- `src/app/middleware/sortMiddleware.js` → `src/middlewares/sortMiddleware.js`
- `src/util/mongoose.js` → `src/utils/mongoose.js`
- Added error handler middleware
- Added validation middleware

### Breaking Changes:
- All imports now use ES module syntax
- Environment variables required (create .env)
- Error responses now JSON format

### What to Update:
- Update any direct MongoDB imports
- Update any .catch() chains to async/await if custom logic
- Test all routes after migration

## 🤝 Contributing Guidelines

When adding new features:

1. **Create feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Follow structure**
   - Model → Service → Validator → Controller → Route

3. **Add comments**
   - JSDoc for all public methods
   - Business logic comments

4. **Add logging**
   - Log start of operations
   - Log important milestones
   - Log errors with context

5. **Handle errors**
   - Use ApiError for known errors
   - Let unknown errors bubble to error handler

6. **Add tests** (Future)
   - Unit tests for services
   - Integration tests for routes

## ✅ Checklist for Code Review

- [ ] Comments added for clarity
- [ ] Error handling implemented
- [ ] Logging added at key points
- [ ] Environment variables used (no hardcoded config)
- [ ] Following naming conventions
- [ ] No commented-out code
- [ ] Using service layer for business logic
- [ ] Using validators for input
- [ ] Async/await pattern used

## 🆘 Troubleshooting

### "Cannot find module"
- Check import paths are correct
- Ensure .js extension is used in imports
- Check file names match import statements

### "dotenv is not defined"
- Ensure `import dotenv from 'dotenv'` at top of config.js
- Call `dotenv.config()` before using env variables

### Database connection errors
- Check MongoDB is running
- Verify MONGODB_URI in .env
- Check connection string format

### Validation errors
- Check Joi schema definitions
- Verify error messages are descriptive
- Test with curl or Postman

---

**Refactoring Date**: 2024
**Node Version**: 16+
**Npm Version**: 8+
