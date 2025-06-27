const mongoose = require('mongoose');

const novelSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  author:      { type: String },
  genres:      [{ type: String }],
  coverImage:  { type: String },
  description: { type: String },
  status:      { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Novel', novelSchema);
