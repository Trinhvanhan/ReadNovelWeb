import express from 'express';
import novelController from '../controllers/novel.controller.js';
import { authenticate, authenticateStrict } from '../middlewares/auth.middleware.js';

const router = express.Router();
// router.use(authenticate);
router.get('/', authenticate, novelController.getNovels);
router.get('/:id', authenticate, novelController.getNovelById);
router.get('/:id/chapters/:chapter', authenticate, novelController.getChapter);

export default router;
