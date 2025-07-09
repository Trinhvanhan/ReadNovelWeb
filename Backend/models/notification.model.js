import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  type: { type: String, enum: ['new_chapter', 'recommendation', 'system'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },

  data: {
    novelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Novel' },
    novelTitle: String,
    chapterNumber: Number,
    chapterTitle: String
  },

  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date, default: null },

  actions: [{
    type: {
      type: String,
      enum: ['read_chapter', 'mark_read', 'custom'],
      required: true
    },
    label: String,
    url: String
  }]
}, {
  timestamps: true
});

export default mongoose.model('Notification', notificationSchema);
