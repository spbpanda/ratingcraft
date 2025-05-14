import { authMiddleware } from './../middleware/authMiddleware';
import express from 'express';
import {
  getServerDetails,
  createNewServer,
  editServer,
  removeServer,
  listServers,
  listUserServers
} from '../controllers/servers.controller';

const router = express.Router();

router.get('/servers/:id', getServerDetails);            // GET /servers/:id
router.post('/servers', listServers);                   // POST /servers (фильтры)
router.post('/add-server', authMiddleware, createNewServer); // POST /add-server
router.put('/servers/:id', authMiddleware, editServer);  // PUT /servers/:id
router.delete('/servers/:id', authMiddleware, removeServer); // DELETE /servers/:id
router.get('/my-servers', authMiddleware, listUserServers); // GET /my-servers

export default router;