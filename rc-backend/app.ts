import express from 'express';
import cors from 'cors';
import fs from 'fs';
import bodyParser from 'body-parser'; // Not used, you can remove if not needed
import axios from 'axios'; // Not used, you can remove if not needed
import helmet from 'helmet'; // Not used, you can remove if not needed
import { Server } from './interfaces/server';

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

// Function to read JSON data safely
const readJsonFile = (filePath: string) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

// Bases Основные
const bases = readJsonFile('./data/bases.json');

app.get('/bases', (req, res) => {
  res.json(bases);
});

// Mini-Games Мини игры
const miniGames = readJsonFile('./data/mini-games.json');

app.get('/mini-games', (req, res) => {
  res.json(miniGames);
});

// Mods Моды
const mods = readJsonFile('./data/mods.json');

app.get('/mods', (req, res) => {
  res.json(mods);
});

// Plugins Плагины
const plugins = readJsonFile('./data/plugins.json');

app.get('/plugins', (req, res) => {
  res.json(plugins);
});

// Versions Версии
const versions = readJsonFile('./data/versions.json');

app.get('/versions', (req, res) => {
  res.json(versions);
});

// Servers Сервера
let servers = readJsonFile('./data/servers.json');

// Добавление нового сервера
app.post('/add-server', (req, res): any => {
  const { address, port, ...rest } = req.body;

  // Проверка обязательных полей
  if (!address) {
    return res.status(400).json({ error: 'Address are required' });
  }

  // Создание нового сервера
  const newServer: Server = {
      id: servers.length + 1, // Генерация нового ID
      address,
      port,
      ...rest, // Остальные параметры (если есть)
      createDate: new Date(), // Автоматически добавляем дату создания
  };

  // Добавление сервера в массив
  servers.push(newServer);

  // Сохранение данных в файл
  try {
    fs.writeFileSync('./data/servers.json', JSON.stringify(servers, null, 2));
    res.status(201).json(newServer);
  } catch (err) {
    console.error('Error writing to file:', err);
    res.status(500).json({ error: 'Failed to save server data' });
  }
});

// DELETE route for removing a server by ID
app.delete('/servers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  servers = servers.filter((server: any) => server.id !== id); // Remove server by so ID
  fs.writeFileSync('./data/servers.json', JSON.stringify(servers, null, 2)); // Save updated data
  res.status(204).send(); // No content to send back
});

// Получить список серверов
app.post('/servers', (req, res) => {
  const { search, versions, bases, mods, plugins, miniGames, page = 0, pageSize = 10 } = req.body;

  let filteredServers: Server[] = filterServers(servers, {
    search: typeof search === 'string' ? search : undefined,
    versions: Array.isArray(versions) && versions.length > 0 ? versions.map(version => Number(version)) : undefined,
    bases: Array.isArray(bases) && bases.length > 0 ? bases.map(base => Number(base)) : undefined,
    mods: Array.isArray(mods) && mods.length > 0 ? mods.map(mod => Number(mod)) : undefined,
    plugins: Array.isArray(plugins) && plugins.length > 0 ? plugins.map(plugin => Number(plugin)) : undefined,
    miniGames: Array.isArray(miniGames) && miniGames.length > 0 ? miniGames.map(miniGame => Number(miniGame)) : undefined,
  });

  // Пагинация
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedServers = filteredServers.slice(startIndex, endIndex);

  res.json({
    data: paginatedServers,
    total: filteredServers.length, // Общее количество серверов для пагинации
    page,
    pageSize,
  });
});

// Получить информацию по серверу
app.get('/servers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const server = servers.find((server: any) => server.id === id);
  res.json(server ?? undefined);
})


const filterServers = (servers: Server[], criteria: {
  search?: string;
  versions?: number[];
  bases?: number[];
  mods?: number[];
  plugins?: number[];
  miniGames?: number[];
}) => {
  return servers.filter(server => {
    const nameMatch = criteria.search && server.name ? server.name.toLowerCase().includes(criteria.search.toLowerCase()) || server.address.toLowerCase().includes(criteria.search.toLowerCase()) : true;
    const versionMatch = criteria.versions && server.version ? criteria.versions.includes(server.version.id) : true;
    const basesMatch = criteria.bases && server.bases && server.bases.length > 0 ? criteria.bases.every(baseId => server.bases!.filter(item => item.id === baseId)) : true;
    const modsMatch = criteria.mods && server.mods && server.mods.length > 0 ? criteria.mods.every(modId => server.mods!.filter(item => item.id === modId)) : true;
    const pluginsMatch = criteria.plugins && server.plugins && server.plugins.length > 0 ? criteria.plugins.every(pluginId => server.plugins!.filter(item => item.id === pluginId)) : true;
    const miniGamesMatch = criteria.miniGames && server.miniGames && server.miniGames.length > 0 ? criteria.miniGames.every(miniGameId => server.miniGames!.filter(item => item.id === miniGameId)) : true;
    return nameMatch && versionMatch && basesMatch && modsMatch && pluginsMatch && miniGamesMatch;
  });
};

app.get('/api', (req, res) => {
  res.send({ message: 'Hello from Node.js API!' });
});

// Start server
app.listen(PORT, 'localhost', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});