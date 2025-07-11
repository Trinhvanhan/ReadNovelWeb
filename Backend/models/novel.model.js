import mongoose from 'mongoose';

const novelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  coverImage: { type: String },
  genres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }],
  tags: [{ type: String }],
  views: { type: Number, default: 0 },
  favorites: { type: Number, default: 0 },
  followers: { type: Number, default: 0 },
  features: { type: Number, default: 0 },
  description: { type: String, required: true },
  rating: { count: { type: Number, default: 0 }, average: { type: Number, default: 0 } },
  chapters: {type: Number, default: 0 },
  status: { type: String, enum: ['ongoing', 'completed', 'dropped'], default: 'ongoing' },
});

novelSchema.index({ title: 1 });
export default mongoose.model('Novel', novelSchema);
