import { readJsonFile, writeJsonFile } from "../utils/file.utils";
import { Server } from "../interfaces/server.interface";
import { filterServers } from "../helpers/filter-servers";
import getMinecraftServerStatus from "../minecraft-server-util/minecraft-server-util";
import { pingJava } from "../mineping/java";
import { pingBedrock } from "../mineping/bedrock";

const SERVERS_PATH = "./data/servers.json";

// Получаем все серверы
export const getAllServers = (): Server[] => {
  return readJsonFile<Server[]>(SERVERS_PATH);
};

// Сохраняем список серверов
export const saveAllServers = (servers: Server[]) => {
  writeJsonFile(SERVERS_PATH, servers);
};

// Получаем сервер по ID
export const getServerById = (id: string): Server | undefined => {
  const servers = getAllServers();
  return servers.find((s) => s.id === id);
};

// Добавляем новый сервер
export const addNewServer = (newServer: Server): Server => {
  const servers = getAllServers();
  servers.push(newServer);
  saveAllServers(servers);
  return newServer;
};

// Обновляем сервер
export const updateServer = (
  id: string,
  updatedData: Partial<Server>
): Server | null => {
  const servers = getAllServers();
  const index = servers.findIndex((s) => s.id === id);
  if (index === -1) return null;
  servers[index] = { ...servers[index], ...updatedData };
  saveAllServers(servers);
  return servers[index];
};

// Удаляем сервер
export const deleteServer = (id: string, ownerId: string): boolean => {
  const servers = getAllServers();
  const index = servers.findIndex((s) => s.id === id && s.ownerId === ownerId);
  if (index === -1) return false;
  servers.splice(index, 1);
  saveAllServers(servers);
  return true;
};

// Получаем список серверов с фильтром и пагинацией
export const getServersWithFilterAndPagination = async (
  filter: any,
  page: number = 0,
  pageSize: number = 10
): Promise<{
  data: Server[];
  total: number;
  page: number;
  pageSize: number;
}> => {
  let servers = getAllServers();

  // Применяем фильтр
  servers = filterServers(servers, filter);

  // Обновляем количество игроков
  for (const server of servers) {
    try {
      const serverInfo = await getServerInfo(server.address, server.port);
      server.onlinePlayers = serverInfo.players?.online ?? 0;
      server.maxPlayers = serverInfo.players?.max ?? 0;
    } catch (err) {
      console.error(`Ошибка при обновлении сервера ${server.id}:`, err);
    }
  }

  // Сортировка по рейтингу
  const sortedServers = servers
    .slice()
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .map((server, index) => ({ ...server, ratingPlace: index + 1 }));

  // Пагинация
  const startIndex = page * pageSize;
  const paginatedServers = sortedServers.slice(
    startIndex,
    startIndex + pageSize
  );

  return {
    data: paginatedServers,
    total: sortedServers.length,
    page,
    pageSize,
  };
};

// Получаем серверы пользователя
export const getUserServers = (userId: string): Server[] => {
  const servers = getAllServers();
  return servers.filter((s) => s.ownerId === userId);
};

export async function getServerInfo(address: string, port?: number) {
  return (
    (await getMinecraftServerStatus(address, port)) ??
    (await pingJava(address, { port })) ??
    (await pingBedrock(address, { port }))
  );
}
