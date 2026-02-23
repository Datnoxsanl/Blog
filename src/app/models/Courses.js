const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Courses = new Schema({
  name: { type: String, maxLength: 255, default: "No name" },
  description: { type: String, maxLength: 1000 },
  image: { type: String, maxLength: 255 },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Courses", Courses);