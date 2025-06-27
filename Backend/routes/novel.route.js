import express from 'express';
import novelController from '../controllers/novel.controller.js';

const router = express.Router();

router.post('/', novelController.createNovel);
router.get('/', novelController.getAllNovels);
router.get('/:id', novelController.getNovelById);
router.put('/:id', novelController.updateNovel);
router.delete('/:id', novelController.deleteNovel);

export default router;
