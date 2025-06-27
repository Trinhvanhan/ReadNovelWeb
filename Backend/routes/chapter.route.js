import express from 'express';
import chapterController from '../controllers/chapter.controller.js';

const router = express.Router();

router.post('/', chapterController.createChapter);
router.get('/novel/:novelId', chapterController.getChaptersByNovel);

export default router;
