import express from 'express';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favorite.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/favorite-servers', authMiddleware, getFavorites);
router.post('/favorite-servers', authMiddleware, addFavorite);
router.delete('/favorite-servers/:id', authMiddleware, removeFavorite);

export default router;