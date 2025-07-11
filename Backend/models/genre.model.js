// models/genre.model.ts
import mongoose from 'mongoose';

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true }, // ví dụ: 'sci-fi'
  description: { type: String },
});

export default mongoose.model('Genre', genreSchema);
