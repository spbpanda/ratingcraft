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

// POST route for creating a new server
app.post('/api/servers', (req, res) => {
  const newServer = { ...req.body, id: servers.length + 1 }; // Assign a new ID
  servers.push(newServer);
  fs.writeFileSync('./data/servers.json', JSON.stringify(servers, null, 2)); // Save updated data
  res.status(201).json(newServer);
});

// DELETE route for removing a server by ID
app.delete('/api/servers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  servers = servers.filter((server: any) => server.id !== id); // Remove server by so ID
  fs.writeFileSync('./data/servers.json', JSON.stringify(servers, null, 2)); // Save updated data
  res.status(204).send(); // No content to send back
});

app.post('/servers', (req, res) => {
  const { search, versions, bases, mods, plugins, miniGames } = req.body;

  let filteredServers: Server[] = filterServers(servers, {
    search: typeof search === 'string' ? search : undefined,
    versions: Array.isArray(versions) && versions.length > 0 ? versions.map(version => Number(version)) : undefined,
    bases: Array.isArray(bases) && bases.length > 0 ? bases.map(base => Number(base)) : undefined,
    mods: Array.isArray(mods) && mods.length > 0 ? mods.map(mod => Number(mod)) : undefined,
    plugins: Array.isArray(plugins) && plugins.length > 0 ? plugins.map(plugin => Number(plugin)) : undefined,
    miniGames: Array.isArray(miniGames) && miniGames.length > 0 ? miniGames.map(miniGame => Number(miniGame)) : undefined,
  });
  res.json(filteredServers);
});

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
    const nameMatch = criteria.search ? server.name.toLowerCase().includes(criteria.search.toLowerCase()) || server.address.toLowerCase().includes(criteria.search.toLowerCase()) : true;
    const versionMatch = criteria.versions ? criteria.versions.includes(server.version) : true;
    const basesMatch = criteria.bases ? criteria.bases.every(baseId => server.bases.includes(baseId)) : true;
    const modsMatch = criteria.mods ? criteria.mods.every(modId => server.mods.includes(modId)) : true;
    const pluginsMatch = criteria.plugins ? criteria.plugins.every(pluginId => server.plugins.includes(pluginId)) : true;
    const miniGamesMatch = criteria.miniGames ? criteria.miniGames.every(miniGameId => server.miniGames.includes(miniGameId)) : true;
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