import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
  novelId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Novel', required: true },
  title:     { type: String },
  chapterNumber: { type: Number, required: true },
});

chapterSchema.index({ novelId: 1, chapterNumber: 1 }, { unique: true });
export default mongoose.model('Chapter', chapterSchema);
