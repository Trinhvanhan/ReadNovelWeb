const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  novel:     { type: mongoose.Schema.Types.ObjectId, ref: 'Novel', required: true },
  title:     { type: String },
  chapterNumber: { type: Number },
  images:    [{ type: String }], // URLs to images
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chapter', chapterSchema);
