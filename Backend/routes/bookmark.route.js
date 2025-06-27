import express from 'express';
import bookmarkController from '../controllers/bookmark.controller.js';

const router = express.Router();

router.post('/', bookmarkController.addBookmark);
router.get('/user/:userId', bookmarkController.getBookmarksByUser);
router.delete('/:id', bookmarkController.removeBookmark);

export default router;
