class UserController {
  getCurrentUser = async (req, res) => {
    try {
      const user = req.user;

      res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || null,
        role: user.role,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt || null,
        preferences: user.preferences || {},
        stats: user.stats || {}
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  updateProfile = async (req, res) => {
    try {
      const { name, avatar } = req.body;

      if (name !== undefined) req.user.name = name;
      if (avatar !== undefined) req.user.avatar = avatar;
      req.user.updatedAt = new Date();

      await req.user.save();

      res.status(200).json({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        updatedAt: req.user.updatedAt
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  updatePreferences = async (req, res) => {
    try {
      const preferences = req.body;

      req.user.preferences = {
        ...req.user.preferences,
        ...preferences,
        notifications: {
          ...req.user.preferences?.notifications,
          ...preferences.notifications
        }
      };

      req.user.updatedAt = new Date();
      await req.user.save();

      res.status(200).json({
        preferences: req.user.preferences,
        updatedAt: req.user.updatedAt
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
}

export default new UserController();
