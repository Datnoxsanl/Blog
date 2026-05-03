# 📁 Project Structure - Enterprise-Standard

## Directory Overview

```
blog/
├── .env                          # Environment variables (DO NOT COMMIT)
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── package.json                  # Project dependencies & scripts
├── nodemon.json                  # Nodemon configuration
├── REFACTORING_GUIDE.md          # Detailed refactoring documentation
├── ARCHITECTURE.md               # This file
│
└── src/                          # Source code
    ├── index.js                  # Application entry point
    │
    ├── config/                   # Configuration files
    │   ├── config.js             # Main app configuration
    │   ├── constants/
    │   │   └── index.js          # Application constants
    │   └── db/
    │       └── index.js          # MongoDB connection setup
    │
    ├── app/                      # Application core logic
    │   ├── controllers/          # HTTP request handlers
    │   │   ├── CoursesController.js
    │   │   ├── NewsController.js
    │   │   ├── meController.js
    │   │   └── siteController.js
    │   │
    │   ├── models/               # Mongoose database models
    │   │   └── Courses.js
    │   │
    │   └── middleware/           # Application-specific middleware
    │       └── (none currently)
    │
    ├── services/                 # Business logic layer
    │   └── CourseService.js      # Course business operations
    │
    ├── routes/                   # Express route definitions
    │   ├── index.js              # Route entry point
    │   ├── courses.js            # Course routes
    │   ├── news.js               # News routes
    │   ├── me.js                 # User-specific routes
    │   └── site.js               # General site routes
    │
    ├── middlewares/              # Reusable middleware functions
    │   ├── errorHandler.js       # Global error handling
    │   ├── sortMiddleware.js     # Sort configuration
    │   └── validateRequest.js    # Request validation
    │
    ├── validators/               # Joi validation schemas
    │   └── courseValidator.js    # Course validation schemas
    │
    ├── utils/                    # Utility functions
    │   ├── logger.js             # Logging utility
    │   └── mongoose.js           # Mongoose helpers
    │
    ├── common/                   # Common classes & utilities
    │   ├── ApiResponse.js        # Standardized API responses
    │   └── ApiError.js           # Custom error class
    │
    ├── helpers/                  # Template helpers
    │   └── handlebars.js         # Handlebars template helpers
    │
    ├── public/                   # Static files (client-side)
    │   ├── css/
    │   │   └── app.css
    │   └── img/
    │
    └── resources/                # Template resources
        ├── scss/                 # Styles
        │   ├── _variables.scss
        │   └── app.scss
        └── views/                # Handlebars templates
            ├── home.hbs
            ├── news.hbs
            ├── search.hbs
            ├── courses/
            │   ├── create.hbs
            │   ├── edit.hbs
            │   └── show.hbs
            ├── me/
            │   ├── stored-courses.hbs
            │   └── trash-courses.hbs
            ├── layouts/
            │   └── main.hbs
            └── partials/
                ├── footer.hbs
                └── header.hbs
```

## 📊 Layer Architecture

```
┌─────────────────────────────────────────┐
│  CLIENT (Browser)                        │
├─────────────────────────────────────────┤
│  VIEWS (Handlebars Templates)           │
├─────────────────────────────────────────┤
│  ROUTES (Express Router)                 │
├─────────────────────────────────────────┤
│  CONTROLLERS (Request Handlers)          │
│  - Parse incoming data                  │
│  - Call services                        │
│  - Return responses                     │
├─────────────────────────────────────────┤
│  SERVICES (Business Logic)               │
│  - Database operations                  │
│  - Business rules                       │
│  - Error handling                       │
├─────────────────────────────────────────┤
│  MODELS (Database Schema)                │
│  - MongoDB collections                  │
│  - Data validation                      │
├─────────────────────────────────────────┤
│  MongoDB (Database)                      │
└─────────────────────────────────────────┘
```

## 🔄 Request Flow Example

### Creating a Course

```
1. CLIENT SUBMITS FORM
   └─→ POST /courses/store with course data

2. ROUTE HANDLER
   └─→ routes/courses.js catches the request
   └─→ Calls: coursesController.store()

3. MIDDLEWARE (If added)
   └─→ validateRequest middleware validates input
   └─→ Passes to controller if valid

4. CONTROLLER
   └─→ coursesController.store()
   └─→ Calls: CourseService.createCourse(req.body)
   └─→ Handles response redirect

5. SERVICE (Business Logic)
   └─→ CourseService.createCourse()
   └─→ Creates new Courses instance
   └─→ Calls: course.save()
   └─→ Returns saved course or throws error

6. MODEL (Database)
   └─→ Courses.js schema pre-hooks
   └─→ Generates slug before saving
   └─→ Saves to MongoDB

7. ERROR HANDLING (If error occurs)
   └─→ Error bubbles up to error handler middleware
   └─→ errorHandler.js catches error
   └─→ Returns standardized error response

8. RESPONSE
   └─→ JSON response or redirect based on controller logic
```

## 🔐 Data Flow & Dependencies

### Without Service Layer (Bad ❌)
```
Controller → Model → Database
  └─ Business logic mixed in controller
  └─ Hard to test
  └─ Hard to reuse logic
```

### With Service Layer (Good ✅)
```
Controller → Service → Model → Database
  └─ Separation of concerns
  └─ Service logic reusable
  └─ Easy to test services
  └─ Controller focused on HTTP
```

## 📝 Key Components Explained

### 1. Controllers (`app/controllers/`)
- **Purpose**: Handle HTTP requests/responses
- **Should NOT contain**: Business logic, database queries
- **Example**:
  ```javascript
  async store(req, res, next) {
    try {
      await CourseService.createCourse(req.body);
      res.redirect('/me/stored/courses');
    } catch (error) {
      next(error);
    }
  }
  ```

### 2. Services (`services/`)
- **Purpose**: Contain all business logic
- **Should contain**: Database queries, data processing, validation
- **Example**:
  ```javascript
  async createCourse(courseData) {
    const course = new Courses(courseData);
    return await course.save();
  }
  ```

### 3. Models (`app/models/`)
- **Purpose**: Define database schema and hooks
- **Contains**: Schema definition, pre/post hooks, query helpers
- **Example**: Schema with auto-slug generation

### 4. Routes (`routes/`)
- **Purpose**: Define API endpoints and route handlers
- **Uses**: Controller methods
- **Example**:
  ```javascript
  router.post('/store', coursesController.store);
  ```

### 5. Validators (`validators/`)
- **Purpose**: Define request validation rules
- **Uses**: Joi schemas
- **Example**:
  ```javascript
  const createCourseSchema = Joi.object({
    name: Joi.string().required().min(3)
  });
  ```

### 6. Middleware (`middlewares/`)
- **Purpose**: Cross-cutting concerns
- **Types**: Error handling, validation, sorting, logging
- **Example**: Global error handler

### 7. Utils (`utils/`)
- **Purpose**: Helper functions and utilities
- **Includes**: Logger, Mongoose converters, etc.
- **Example**: Convert Mongoose documents to plain objects

## 🎯 Design Patterns Used

### 1. **MVC Pattern**
- Model: Database schema
- View: Handlebars templates
- Controller: Request handlers

### 2. **Service Pattern**
- Separates business logic from HTTP handling
- Makes code testable and reusable

### 3. **Middleware Pattern**
- Error handling
- Request validation
- Logging

### 4. **Singleton Pattern**
- Controllers exported as single instances
- Services exported as single instances

### 5. **Factory Pattern**
- `validateRequest` creates validation middleware

## 📐 SOLID Principles Applied

### S - Single Responsibility
- Controllers: Handle HTTP only
- Services: Handle business logic only
- Models: Define schema only

### O - Open/Closed
- Services can be extended for new operations
- Middleware can be added without changing core logic

### L - Liskov Substitution
- Error handling works with any error type

### I - Interface Segregation
- Specific validators for specific operations
- Specific services for specific domains

### D - Dependency Inversion
- Controllers depend on Service abstractions
- Services depend on Model abstractions

## 🚀 Scalability Features

### Current Implementation
✅ Modular structure for feature addition
✅ Service layer for business logic reuse
✅ Constants management
✅ Centralized error handling
✅ Logging system
✅ Environment configuration

### Future Improvements
- [ ] Add caching (Redis)
- [ ] Add job queue (Bull)
- [ ] Add authentication/authorization
- [ ] Add API versioning
- [ ] Add comprehensive tests
- [ ] Add GraphQL API
- [ ] Add WebSocket support
- [ ] Add database migrations

## 🔧 Configuration Files

### `config/config.js`
- Loads environment variables
- Centralizes all configuration
- Makes app configuration-driven

### `config/constants/index.js`
- Defines all magic strings
- Makes code more maintainable
- Easy to update values globally

### `.env`
- Sensitive data (never commit)
- Environment-specific values
- Database credentials

## 📚 Common Operations

### Adding a New Route
1. Create controller method
2. Add route in routes file
3. Add validator if needed

### Adding Business Logic
1. Add method in service
2. Call from controller

### Adding Database Schema
1. Create model file
2. Define schema with validations
3. Create corresponding service

### Handling Errors
1. Throw ApiError in service
2. Let error handler catch it
3. Returns standardized response

---

**Last Updated**: January 2024
**Architecture Version**: 1.0
