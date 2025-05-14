import express from 'express';
import transactionsRoutes from './transactions.routes';
import boostRoutes from './boost.routes';

const router = express.Router();

router.use('/', transactionsRoutes);
router.use('/', boostRoutes);

export default router;