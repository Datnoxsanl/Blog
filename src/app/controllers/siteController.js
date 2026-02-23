const BlogCourses = require("../models/Courses");

class SiteController {
  // [GET] /home
async index(req, res) {
    try {
      const courses = await BlogCourses.find({});
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // [GET] /search
  search(req, res) {
    res.render("search");
  }
}

module.exports = new SiteController();
