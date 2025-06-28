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
      email: {
        enabled: { type: Boolean, default: true },
        newChapters: { type: Boolean, default: true },
        recommendations: { type: Boolean, default: true },
        systemUpdates: { type: Boolean, default: true },
        frequency: { type: String, default: 'immediate' }
      },
      push: {
        enabled: { type: Boolean, default: false },
        newChapters: { type: Boolean, default: false },
        recommendations: { type: Boolean, default: false },
        systemUpdates: { type: Boolean, default: true }
      },
      inApp: {
        enabled: { type: Boolean, default: true },
        newChapters: { type: Boolean, default: true },
        recommendations: { type: Boolean, default: true },
        systemUpdates: { type: Boolean, default: true }
      }
    }
  }

}, { timestamps: true });

export default mongoose.model('User', userSchema);
