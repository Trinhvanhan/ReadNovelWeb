import mongoose from 'mongoose';

const chapterContentSchema = new mongoose.Schema({
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
  content: { type: String, default: '' },
});

chapterContentSchema.index({ chapterId: 1 });
export default mongoose.model('ChapterContent', chapterContentSchema);
