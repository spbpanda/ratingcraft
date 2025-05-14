import express from 'express';
import { boostServerRating } from '../controllers/boost.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/servers/:id/boost', authMiddleware, boostServerRating);

export default router;