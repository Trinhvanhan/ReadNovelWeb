import authService from '../services/auth.service.js';

class AuthController {
  login = async (req, res) => {
    try {
      const result = await authService.login(req.body);
      res.status(200).json(result);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  };

  signup = async (req, res) => {
    try {
      const result = await authService.signup(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  };

  logout = async (req, res) => {
    try {
      // Invalidate token if using token blacklist (optional)
      res.status(200).json({ message: 'Successfully logged out' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  refresh = async (req, res) => {
    try {
      const result = await authService.refresh(req.headers.authorization);
      res.status(200).json(result);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  };
}

export default new AuthController();
