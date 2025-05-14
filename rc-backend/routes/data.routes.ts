// src/routes/data.routes.ts

import express from 'express';
import {
  getBases,
  getMiniGames,
  getMods,
  getPlugins,
  getVersions,
} from '../controllers/data.controller';

const router = express.Router();

router.get('/bases', getBases);
router.get('/mini-games', getMiniGames);
router.get('/mods', getMods);
router.get('/plugins', getPlugins);
router.get('/versions', getVersions);

export default router;