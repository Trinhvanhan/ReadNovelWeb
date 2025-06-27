import express from 'express';
import historyController from '../controllers/history.controller.js';

const router = express.Router();

router.post('/', historyController.addHistory);
router.get('/user/:userId', historyController.getHistoryByUser);

export default router;
