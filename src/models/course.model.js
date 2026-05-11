import mongoose from 'mongoose';
import slugify from 'slugify';
import mongooseDelete from 'mongoose-delete';
import Counter from './counter.model.js';
import { COURSE_LEVELS, SLUG_CONFIG, SORT_OPTIONS } from '../config/constants.js';

const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    _id: { type: Number },
    name: { type: String, required: true, trim: true, index: true },
    description: { type: String, trim: true },
    image: { type: String, trim: true },
    level: { type: String, enum: Object.values(COURSE_LEVELS), default: COURSE_LEVELS.BASIC },
    slug: { type: String, unique: true, lowercase: true, sparse: true },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
  },
  {
    _id: false,
    timestamps: true,
    collection: 'courses',
  },
);

courseSchema.pre('save', async function autoIncrementId() {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      'course_id_counter',
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    this._id = counter.seq;
  }
});

courseSchema.pre('save', async function generateSlug() {
  if (!this.isModified('name')) return;

  const baseSlug = slugify(this.name, { lower: SLUG_CONFIG.LOWERCASE, strict: SLUG_CONFIG.STRICT });

  const CourseModel = mongoose.models.Courses || mongoose.model('Courses', courseSchema);
  const existing = await CourseModel.findOne({ slug: baseSlug, _id: { $ne: this._id } });

  if (!existing) {
    this.slug = baseSlug;
  } else {
    const randomStr = Math.random().toString(36).substring(2, SLUG_CONFIG.RANDOM_STRING_LENGTH + 2);
    this.slug = `${baseSlug}-${randomStr}`;
  }
});

courseSchema.query.sortable = function sortableQuery(req) {
  if (Object.prototype.hasOwnProperty.call(req.query, '_sort')) {
    const isValidType = [SORT_OPTIONS.ASCENDING, SORT_OPTIONS.DESCENDING].includes(req.query.type);
    return this.sort({
      [req.query.column]: isValidType ? (req.query.type === SORT_OPTIONS.ASCENDING ? 1 : -1) : 0,
    });
  }
  return this;
};

courseSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

const Course = mongoose.model('Courses', courseSchema);

export default Course;
