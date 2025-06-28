import express from 'express';
import searchController from '../controllers/search.controller.js';

const router = express.Router();

router.get('/', searchController.search);
router.get('/suggestions', searchController.suggestions);

export default router;
