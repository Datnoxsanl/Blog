import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    actor: { type: String, required: true },
    actorRole: { type: String, default: 'admin' },
    action: {
      type: String,
      enum: ['created', 'updated', 'deleted', 'restored', 'force_deleted', 'registered', 'login', 'logout', 'activated', 'deactivated'],
      required: true,
    },
    target: { type: String, default: '' },
    targetType: { type: String, enum: ['course', 'user', 'system'], default: 'system' },
    description: { type: String, required: true },
    icon: { type: String, default: 'fas fa-circle' },
    iconColor: { type: String, default: 'primary' },
  },
  { timestamps: true },
);

export default mongoose.model('ActivityLog', activityLogSchema);
