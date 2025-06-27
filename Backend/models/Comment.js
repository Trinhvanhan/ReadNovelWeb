const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  novel:   { type: mongoose.Schema.Types.ObjectId, ref: 'Novel' },
  chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
