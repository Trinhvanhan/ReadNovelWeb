import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
  novelId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Novel', required: true },
  title:     { type: String },
  chapterNumber: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  publishedAt: { type: Date, default: Date.now },
  wordCount: { type: Number, default: 0 },
  content: { type: String, default: '' },
});

chapterSchema.index({ novelId: 1, chapterNumber: 1 }, { unique: true });

export default mongoose.model('Chapter', chapterSchema);
