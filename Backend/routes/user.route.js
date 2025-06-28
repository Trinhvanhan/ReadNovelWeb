import express from 'express';
import userController from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/me', authenticate, userController.getCurrentUser);
router.patch('/profile', authenticate, userController.updateProfile);
router.patch('/preferences', authenticate, userController.updatePreferences);

export default router;
