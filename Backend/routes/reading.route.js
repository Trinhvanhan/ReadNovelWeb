import express from 'express';
import readingController from '../controllers/reading.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/progress', readingController.getProgress);
router.post('/progress', readingController.updateProgress);
router.get('/bookmarks', readingController.getBookmarks);
router.post('/bookmarks', readingController.toggleBookmark);

export default router;
