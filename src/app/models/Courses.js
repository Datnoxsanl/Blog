const mongoose = require("mongoose");
const slugify = require("slugify");
var mongooseDelete = require("mongoose-delete");
const Schema = mongoose.Schema;

const Courses = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    level: {
      type: String,
      default: "Cơ bản",
    },
    slug: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true },
);

// Tự tạo slug trước khi save
// Courses.pre("save", function (next) {
//   if (this.name) {
//     this.slug = slugify(this.name, {
//       lower: true,
//       strict: true,
//     });
//   }
// }
// );
Courses.pre("save", async function () {
  // tạo slug gốc
  const baseSlug = slugify(this.name, {
    lower: true,
    strict: true,
  });

  // kiểm tra đã tồn tại chưa
  const existingCourse = await mongoose.models.Courses.findOne({
    slug: baseSlug,
  });
  if (!existingCourse) {
    this.slug = baseSlug;
  } else {
    const randomString = Math.random().toString(36).substring(2, 8);
    this.slug = baseSlug + "-" + randomString;
  }
});
Courses.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("Courses", Courses);
