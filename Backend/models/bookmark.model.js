import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  novel: { type: mongoose.Schema.Types.ObjectId, ref: 'Novel', required: true },
  chapterNumber: { type: Number, required: true },
  position: { type: Number, default: 0 },
  note: { type: String },
  createdAt: { type: Date, default: Date.now }
});

bookmarkSchema.index({ user: 1, novel: 1, chapterNumber: 1 }, { unique: true });

export default mongoose.model('Bookmark', bookmarkSchema);
