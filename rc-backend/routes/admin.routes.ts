import express from 'express';
import { adminLogin, getAdmin } from '../controllers/admin.controller';
import { authMiddleware, adminOnly } from '../middleware/authMiddleware';
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5, // максимум 5 попыток
  message: { message: 'Слишком много попыток. Попробуйте позже.' }
});

const router = express.Router();

router.post('/admin/login', loginLimiter, adminLogin);
router.get('/admin', adminOnly, getAdmin);

export default router;