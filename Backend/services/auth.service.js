import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateToken, generateRefreshToken, verifyToken } from '../utils/jwt.util.js';

class AuthService {
  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) throw { status: 401, message: 'Invalid credentials' };

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw { status: 401, message: 'Invalid credentials' };

    const payload = { id: user._id, email: user.email, role: user.role };
    const token = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      user: formatUser(user),
      token,
      refreshToken,
      expiresAt: Date.now() + 3600000 // 1h in ms
    };
  }

  async signup({ name, email, password }) {
    const exists = await User.findOne({ email });
    if (exists) throw { status: 409, message: 'User already exists' };

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const payload = { id: user._id, email: user.email, role: user.role };
    const token = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      user: formatUser(user),
      token,
      refreshToken,
      expiresAt: Date.now() + 3600000
    };
  }

  async refresh(authHeader) {
    const token = authHeader?.split(' ')[1];
    if (!token) throw { status: 401, message: 'Missing refresh token' };

    try {
      const decoded = verifyToken(token);
      const newToken = generateToken({ id: decoded.id, email: decoded.email });
      return {
        token: newToken,
        expiresAt: Date.now() + 3600000
      };
    } catch {
      throw { status: 401, message: 'Invalid or expired token' };
    }
  }
}

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar || null,
    role: user.role,
    createdAt: user.createdAt,
    preferences: user.preferences || {
      theme: 'light',
      fontSize: 'medium',
      notifications: {
        email: true,
        push: false,
        newChapters: true,
        recommendations: true
      }
    }
  };
}

export default new AuthService();
