import express from 'express';
import transactionsRouter from './transactions.routes';
// import serversRouter from './servers.routes';

const router = express.Router();

router.use('/', transactionsRouter);
// router.use('/', serversRouter);

export default router;