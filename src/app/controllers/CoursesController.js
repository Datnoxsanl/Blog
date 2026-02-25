const Courses = require("../models/Courses");
const { mongooseToObject } = require("../../util/mongoose");

class CoursesController {
  // [GET] /courses/:slug
  show(req, res, next) {
    Courses.findOne({ slug: req.params.slug })
      .then((course) => {
        // res.json(Courses);
        if (!course) return res.status(404).send("Course not found");
        res.render("courses/show", mongooseToObject(course));
      })
      .catch(next);
    // res.send("COURSE DETAIL: " + req.params.slug);
  }

  // async show(req, res, next) {
  //   try {
  //     const course = await Courses.findOne({
  //       slug: req.params.slug,
  //     }).lean();
  //     if (!course) {
  //       return res.status(404).send("Course not found");
  //     }
  //     res.render("courses/show", { course });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // [GET] /courses/create
  create(req, res, next) {
    res.render("courses/create");
  }
  // [POST] /courses/store -> lưu trữ dữ liệu từ form tạo mới
  store(req, res, next) {
    // res.json(req.body);
    const course = new Courses(req.body);
    course.save()
      .then(() => res.redirect("/"))
      .catch(error => {
        console.error("Error creating course:", error);
        res.status(500).send("An error occurred while creating the course.");
      })

    // res.send("Course created successfully");
  }
}

module.exports = new CoursesController();
