import express from 'express';
import transactionsRoutes from './transactions.routes';
import boostRoutes from './boost.routes';
import serversRoutes from './servers.routes';
import dataRoutes from './data.routes';
import favoriteRoutes from './favorite.routes';
import adminRoutes from './admin.routes';

const router = express.Router();

router.use('/', transactionsRoutes);
router.use('/', boostRoutes);
router.use('/', serversRoutes);
router.use('/', dataRoutes);
router.use('/', favoriteRoutes);
router.use('/', adminRoutes);

export default router;