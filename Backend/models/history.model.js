import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  novel: { type: mongoose.Schema.Types.ObjectId, ref: 'Novel', required: true },
  chapterNumber: { type: Number, required: true },
  position: { type: Number, default: 0 },
  totalReadingTime: { type: Number, default: 0 }, // in seconds
  lastReadAt: { type: Date, default: Date.now }
}, { timestamps: true });

historySchema.index({ user: 1, novel: 1, chapterNumber: 1 }, { unique: true });

export default mongoose.model('History', historySchema);
