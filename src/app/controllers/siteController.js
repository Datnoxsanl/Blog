const Courses = require("../models/Courses");
const { multipleMongooseToObject } = require("../../util/mongoose");
class SiteController {
  // [GET] /home
  // async index(req, res, next) {
  //   try {
  //     const courses = await Courses.find({}).lean();
  //     res.render("home", { courses });
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  index(req, res, next) {
    Courses.find({})
      .then((courses) => {
        res.render("home", {
          courses: multipleMongooseToObject(courses),
        });
      })
      .catch(next);
  }

  // [GET] /search
  search(req, res) {
    res.render("search");
  }
}

module.exports = new SiteController();
