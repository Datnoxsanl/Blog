const Courses = require("../models/Courses");
const { multipleMongooseToObject } = require("../../util/mongoose");

class MeController {
  // [GET] /me/stored/courses
  storedCourses(req, res, next) {
    Courses.find({})
      .then((courses) =>
        res.render("me/stored-courses", {
          courses: multipleMongooseToObject(courses),
          deleted: req.query.deleted
        }),
      )
      .catch(next);
    // res.render("me/stored-courses");
  }
}

module.exports = new MeController();
