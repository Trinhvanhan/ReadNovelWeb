import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  preferences: {
    theme: { type: String, default: 'light' },
    fontSize: { type: String, default: 'medium' },
    autoBookmark: { type: Boolean, default: true },
    notifications: {
      emailNotifications: { type: Boolean, default: true },
      newChapters: { type: Boolean, default: true },
      novelCompleted: { type: Boolean, default: true },
      readingMilestones: { type: Boolean, default: true },
      systemUpdates: { type: Boolean, default: true },
      createdAt: { type: String, default: Date.now() },
      updatedAt: {
        type: String,
        default: Date.now(),
      }
    }
  }

}, { timestamps: true });

export default mongoose.model('User', userSchema);
