import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { getTransactions } from '../controllers/transactions.controller';

const router = express.Router();

router.get('/transactions', authMiddleware, getTransactions);

export default router;