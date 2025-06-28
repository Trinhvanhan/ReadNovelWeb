import express from 'express';
import notificationController from '../controllers/notification.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', notificationController.getNotifications);
router.post('/read', notificationController.markAsRead);
router.patch('/preferences', notificationController.updatePreferences);

export default router;
