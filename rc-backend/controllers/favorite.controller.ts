import { Request, Response } from 'express';
import { getFavoriteServers, addFavoriteServer, removeFavoriteServer } from '../services/favorite.service';
import { FavoriteServer } from '../interfaces/favorite.interface';

export const getFavorites = (req: Request, res: Response): void => {
  const userId = (req as any).user.id;
  const favorites = getFavoriteServers(userId);
  res.json(favorites);
};

export const addFavorite = (req: Request, res: Response): void => {
  const userId = (req as any).user.id;
  const { serverId } = req.body;

  if (!serverId) {
    res.status(400).json({ error: 'serverId обязателен' });
    return;
  }

  addFavoriteServer(userId, serverId);
  res.status(201).json({ success: true, message: 'Сервер добавлен в избранное' });
};

export const removeFavorite = (req: Request, res: Response): void => {
  const userId = (req as any).user.id;
  const { id } = req.params; // serverId передается как параметр пути

  const success = removeFavoriteServer(userId, id);
  if (success) {
    res.json({ success: true, message: 'Сервер удален из избранного' });
  } else {
    res.status(404).json({ error: 'Сервер не найден в избранном' });
  }
};