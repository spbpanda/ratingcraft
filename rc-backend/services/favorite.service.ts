import fs from 'fs';
import { FavoriteServer } from '../interfaces/favorite.interface';

const FAVORITES_PATH = './data/favorites.json';

function readFavorites(): FavoriteServer[] {
  const data = fs.readFileSync(FAVORITES_PATH, 'utf8');
  return JSON.parse(data);
}

function writeFavorites(favorites: FavoriteServer[]): void {
  fs.writeFileSync(FAVORITES_PATH, JSON.stringify(favorites, null, 2));
}

export function getFavoriteServers(userId: string): FavoriteServer[] {
  const favorites = readFavorites();
  return favorites.filter(fav => fav.userId === userId);
}

export function addFavoriteServer(userId: string, serverId: string): void {
  const favorites = readFavorites();
  if (!favorites.some(fav => fav.userId === userId && fav.serverId === serverId)) {
    favorites.push({ userId, serverId, addedAt: new Date() });
    writeFavorites(favorites);
  }
}

export function removeFavoriteServer(userId: string, serverId: string): boolean {
  let favorites = readFavorites();
  const initialLength = favorites.length;
  favorites = favorites.filter(fav => !(fav.userId === userId && fav.serverId === serverId));
  if (favorites.length < initialLength) {
    writeFavorites(favorites);
    return true;
  }
  return false;
}