const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  novel:   { type: mongoose.Schema.Types.ObjectId, ref: 'Novel', required: true },
  chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
  lastReadAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', historySchema);
