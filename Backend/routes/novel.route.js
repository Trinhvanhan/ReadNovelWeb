import express from 'express';
import novelController from '../controllers/novel.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', novelController.getNovels);
router.get('/:id', novelController.getNovelById);
router.get('/:id/chapters/:chapter', authenticate, novelController.getChapter);

export default router;
