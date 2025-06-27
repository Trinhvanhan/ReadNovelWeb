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
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: false },
      newChapters: { type: Boolean, default: true },
      recommendations: { type: Boolean, default: true }
    }
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
