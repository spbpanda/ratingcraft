import { Request, Response } from 'express';
import { 
  getServerById, 
  addNewServer, 
  updateServer, 
  deleteServer, 
  getServersWithFilterAndPagination,
  getUserServers 
} from '../services/server.service';
import { randomUUID } from 'crypto';

// Получение сервера по ID
export const getServerDetails = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const server = getServerById(id);
  if (!server) {
    res.status(404).json({ error: 'Сервер не найден' });
    return;
  }
  res.json(server);
};

// Добавление нового сервера
export const createNewServer = async (req: Request, res: Response): Promise<void> => {
  const { address, port, ...rest } = req.body;
  const userId = (req as any).user.id; // из токена

  const newServer = {
    id: randomUUID(),
    address,
    port,
    ownerID: userId,
    rating: 0,
    createDate: new Date(),
    onlinePlayers: 0,
    maxPlayers: 0,
    description: '',
    ...rest
  };

  const createdServer = addNewServer(newServer);
  res.status(201).json(createdServer);
};

// Обновление сервера
export const editServer = (req: Request, res: Response): void => {
  const { id } = req.params;
  const updatedData = req.body;
  const updatedServer = updateServer(id, updatedData);
  if (!updatedServer) {
    res.status(404).json({ message: 'Сервер не найден' });
    return;
  }
  res.json(updatedServer);
};

// Удаление сервера
export const removeServer = (req: Request, res: Response): void => {
  const { id } = req.params;
  const userId = (req as any).user.id;
  const success = deleteServer(id, userId);
  if (!success) {
    res.status(404).json({ message: 'Сервер не найден или недостаточно прав' });
    return;
  }
  res.status(204).send();
};

// Получение списка серверов с фильтром
export const listServers = async (req: Request, res: Response): Promise<void> => {
  const { search, versions, bases, mods, plugins, miniGames, page, pageSize } = req.body;
  const result = await getServersWithFilterAndPagination({
    search,
    versions,
    bases,
    mods,
    plugins,
    miniGames
  }, page, pageSize);
  res.json(result);
};

// Получение серверов пользователя
export const listUserServers = (req: Request, res: Response): void => {
  const userId = (req as any).user.id;
  const userServers = getUserServers(userId);
  res.json(userServers);
};