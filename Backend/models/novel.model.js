const mongoose = require('mongoose');

const novelSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  author:      { type: String },
  genres:      [{ type: String }],
  coverImage:  { type: String },
  views:       { type: Number, default: 0 },
  isNew:       { type: Boolean, default: false },
  isFeatured:  { type: Boolean, default: false },
  description: { type: String },
  rating:      { type: Number, default: 0 },
  chapters:    {type: Number, default: 0 },
  status:      { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Novel', novelSchema);
