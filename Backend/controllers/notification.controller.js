import Notification from '../models/notification.model.js';
import User from '../models/user.model.js';

class NotificationController {
  async getNotifications(req, res) {
    const { page = 1, limit = 20, type, read, priority } = req.query;
    const userId = req.user._id;

    const filter = { user: userId };
    if (type) filter.type = type;
    if (read !== undefined) filter.isRead = read === 'true';
    if (priority) filter.priority = priority;

    const totalCount = await Notification.countDocuments(filter);
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const typeBreakdown = await Notification.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });

    res.status(200).json({
      notifications: notifications.map(n => ({
        ...n,
        id: n._id
      })),
      pagination: {
        currentPage: +page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: +page * limit < totalCount,
        hasPrev: +page > 1
      },
      summary: {
        unreadCount,
        totalCount,
        typeBreakdown: Object.fromEntries(typeBreakdown.map(t => [t._id, t.count]))
      }
    });
  }

  async markAsRead(req, res) {
    const { ids } = req.body;
    const result = await Notification.updateMany(
      { _id: { $in: ids }, user: req.user._id },
      { isRead: true, readAt: new Date() }
    );
    res.status(200).json({
      markedAsRead: result.modifiedCount,
      updatedAt: new Date()
    });
  }

  async updatePreferences(req, res) {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 'preferences.notifications': req.body },
      { new: true }
    ).lean();

    res.status(200).json({
      preferences: user.preferences.notifications,
      updatedAt: new Date()
    });
  }
}

export default new NotificationController();
