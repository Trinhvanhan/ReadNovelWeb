import express from 'express';
import InteractionController from '../controllers/interaction.controller.js';
import { authenticateStrict } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/toggle', authenticateStrict, InteractionController.toggleInteration);

export default router;
