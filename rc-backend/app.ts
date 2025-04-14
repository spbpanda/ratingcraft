import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { Server } from './interfaces/server';
import { authMiddleware } from './middleware/auth'; // Импортируем middleware
import { pingBedrock } from "./mineping/bedrock";
import { pingJava } from "./mineping/java";
import { OpenAI } from 'openai';
import { Groq } from "groq-sdk";
import { convertMOTDToHTML } from './utils/convert-motd-to-html';
import getMinecraftServerStatus from './minecraft-server-util/minecraft-server-util';
import { BEDROCK_DEFAULT_PORT, JAVA_DEFAULT_PORT } from './consts/ports';
import { randomUUID, UUID } from 'crypto';
import { BoostRequest } from './interfaces/boost-request';
import { Transaction } from './interfaces/transaction';

const app = express();
const PORT = Number(process.env.PORT) || 10000;
const DEFAULT_TIMEOUT = 20000;
const baseURL = "https://api.aimlapi.com/v1";
const apiKey = "214878940f4a4fe39b28a390a4af471a";
const api = new OpenAI({
  apiKey,
  baseURL,
});

app.use(cors());
app.use(express.json({limit: '50mb'}));

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
app.post('/add-server', authMiddleware, async (req, res): Promise<any> => {
  const { address, port, ...rest } = req.body;
  const userId = (req as any).user.id; // Получаем ID пользователя из токена

  // Проверка обязательных полей
  if (!address) {
    return res.status(400).json({ error: 'IP адрес обязателен, нужно заполнить его' });
  }

  try {
    // Получаем информацию о сервере
    const serverInfo = await getServerInfo(address, port);
    // Загружаем список версий
    const versions = readJsonFile('./data/versions.json');
    // Находим версию сервера в списке
    const serverVersion = versions.find((version: any) => 
      version.protocol === serverInfo.version?.protocol
    );

    // console.log(serverInfo)
    // Если версия не найдена, возвращаем ошибку
    if (!serverVersion) {
      return res.status(400).json({ error: 'Версия сервера не поддерживается' });
    }

    // Создание нового сервера
    const newServer: Server = {
      id: randomUUID(),
      address,
      port,
      ...rest, // Остальные параметры (если есть)
      name: serverInfo.host,
      createDate: new Date(), // Автоматически добавляем дату создания
      ownerId: userId, // Указываем владельца сервера
      rating: 0, // Баллы для нового сервера
      onlinePlayers: serverInfo.players?.online ?? 0, // Добавляем информацию о сервере
      maxPlayers: serverInfo.players?.max ?? 0,
      description: convertMOTDToHTML(serverInfo.description),
      version: serverVersion, // Добавляем версию из списка
    };

    // Добавление сервера в массив
    servers.push(newServer);

    // Сохранение данных в файл
    fs.writeFileSync('./data/servers.json', JSON.stringify(servers, null, 2));
    res.status(201).json(newServer);
  } catch (err) {
    console.error('Ошибка при проверке сервера:', err);
    res.status(500).json({ error: 'Не удалось проверить сервер или сохранить данные' });
  }
});

// Удаление сервера
app.delete('/servers/:id', authMiddleware, (req, res): any => {
  const id = parseInt(req.params.id);
  const userId = (req as any).user.id; // Получаем ID пользователя из токена

  // Находим сервер по ID
  const server = servers.find((server: any) => server.id === id);

  // Если сервер не найден
  if (!server) {
    return res.status(404).json({ message: 'Сервер не найден' });
  }

  // Проверяем, что пользователь является владельцем сервера
  if (server.ownerId !== userId) {
    return res.status(403).json({ message: 'У вас нет прав для удаления этого сервера' });
  }

  // Удаляем сервер
  servers = servers.filter((server: any) => server.id !== id);

  // Сохраняем обновленные данные в файл
  try {
    fs.writeFileSync('./data/servers.json', JSON.stringify(servers, null, 2));
    console.log(`Пользователь ${userId} удалил сервер ${id}`);
    res.status(204).send(); // Успешное удаление, нет содержимого для возврата
  } catch (err) {
    console.error('Ошибка при записи в файл:', err);
    res.status(500).json({ message: 'Ошибка сервера при сохранении данных' });
  }
});

// Обновить данные по серверу
app.put('/servers/:id', authMiddleware, (req, res): any => {
  const serverId = req.params.id; // Получаем ID сервера из URL
  const updatedServer = req.body; // Получаем обновленные данные из тела запроса

  // Находим индекс сервера в массиве
  const serverIndex = servers.findIndex((server: Server) => server.id === serverId);
  // Если сервер не найден
  if (serverIndex === -1) {
    return res.status(404).json({ message: 'Сервер не найден' });
  }

  // Обновляем данные сервера
  servers[serverIndex] = { ...servers[serverIndex], ...updatedServer};
  // Сохраняем обновленные данные в файл
  try {
    fs.writeFileSync('./data/servers.json', JSON.stringify(servers, null, 2));
    res.status(200).json(servers[serverIndex]); // Возвращаем обновленный сервер
  } catch (err) {
    console.error('Ошибка при записи в файл:', err);
    res.status(500).json({ message: 'Ошибка сервера при сохранении данных' });
  }
});

// Получить список серверов
app.post('/servers', async (req, res) => {
  const { search, versions, bases, mods, plugins, miniGames, page = 0, pageSize = 10 } = req.body;

  // const sortingServers = servers.sort((a: { rating: number; }, b: { rating: number; }) => {
  //   if (!b.rating || !a.rating) {
  //     return -1
  //   }
  //   return b.rating - a.rating
  // }).map((server: Server, index: number) => {return {...server, ratingPlace: index+1}});

  let filteredServers: Server[] = filterServers(servers, {
    search: typeof search === 'string' ? search : undefined,
    versions: Array.isArray(versions) && versions.length > 0 ? versions.map(version => Number(version)) : undefined,
    bases: Array.isArray(bases) && bases.length > 0 ? bases.map(base => Number(base)) : undefined,
    mods: Array.isArray(mods) && mods.length > 0 ? mods.map(mod => Number(mod)) : undefined,
    plugins: Array.isArray(plugins) && plugins.length > 0 ? plugins.map(plugin => Number(plugin)) : undefined,
    miniGames: Array.isArray(miniGames) && miniGames.length > 0 ? miniGames.map(miniGame => Number(miniGame)) : undefined,
  });

  for (const server of filteredServers) {
    try {
      const serverInfo = await getServerInfo(server.address, server.port);
      server.onlinePlayers = serverInfo.players?.online ?? 0;
      server.maxPlayers = serverInfo.players?.max ?? 0;
    } catch (err) {
      console.error(`Ошибка при обновлении сервера ${server.id}:`, err);
    }
}

  // Пагинация
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedServers = filteredServers.slice(startIndex, endIndex).sort((a , b) => {
    if (!b.rating || !a.rating) {
      return -1
    }
    return b.rating - a.rating
  })

  res.json({
    data: paginatedServers,
    total: filteredServers.length, // Общее количество серверов для пагинации
    page,
    pageSize,
  });
});

// Получить информацию по серверу
app.get('/servers/:id', async (req, res): Promise<any> => {
  const id = req.params.id;
  const server = servers.find((server: Server) => server.id === id);

  if (!server) {
    return res.status(404).json({ error: 'Сервер не найден' });
  }

  try {
      // Получаем актуальную информацию о сервере
      const serverInfo = await getServerInfo(server.address, server.port);

      // Возвращаем данные сервера
      res.json({
          ...server,
          onlinePlayers: serverInfo.players?.online ?? 0,
          maxPlayers: serverInfo.players?.max ?? 0,
      });
  } catch (err) {
      console.error('Ошибка при проверке сервера:', err);
      res.status(500).json({ error: 'Не удалось проверить сервер' });
  }
});

// Эндпоинт для получения серверов пользователя
app.get('/my-servers', authMiddleware, (req, res) => {
  const userId = (req as any).user.id; // Используем sub как user.id
  const userServers = servers.filter((server: Server) => server.ownerId === userId);
  res.json(userServers);
});

// app.post('/find-server-ai', async (req, res) => {
//   const {hostname, port} = req.body;

//   const completion = await api.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     messages: [
//       {
//         role: "system",
//         content: "You are an AI assistant specialized in Minecraft server analysis. Your task is to provide detailed information about a given Minecraft server in a structured JSON format. Include all relevant details you can find or infer about the server, such as version, player count, game modes, plugins, and any other notable features. If you cannot find specific information, use null for that field. Always respond with a valid JSON object.",
//       },
//       {
//         role: "user",
//         content: `Analyze the Minecraft server at ${hostname}:${port} and provide all available information in a JSON format, without translation.`,
//       },
//     ],
//     temperature: 0.7,
//     max_tokens: 500,
//   });

//   try {
//     const response = JSON.parse(completion.choices[0].message.content ?? '');
//     res.json(response);
//   } catch (error) {
//     console.error("Error parsing AI response:", error);
//     res.status(500).json({ error: "Failed to parse AI response" });
//   }
// });

app.post('/find-server', async (req, res) => {
  const { hostname, port } = req.body;
  
  const serverInfo = await pingJavaServer(hostname, port) ?? await pingBedrockServer(hostname, port);
  try {
    // const response = JSON.parse(serverInfo);
    res.json(serverInfo);
  } catch (error) {
    console.error("Error parsing AI response:", error);
    res.status(500).json({ error: "Failed to parse AI response" });
  }
});

app.post('/find-server-ai', async (req, res) => {
  const { hostname, port } = req.body;
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const completion = await groq.chat.completions.create({
    model: "llama3-70b-8192", // или mixtral-8x7b-32768
    messages: [
      {
        role: "system",
        content: "You are an AI assistant specialized in Minecraft server analysis. Your task is to provide detailed information about a given Minecraft server in a structured JSON format. Include all relevant details you can find or infer about the server, such as version, player count, game modes, plugins, and any other notable features. If you cannot find specific information, use null for that field. Always respond with a valid JSON object.", 
      },
      {
        role: "user",
        content: `Analyze the Minecraft server at ${hostname}:${port} and provide all available information in a JSON format, without translation.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  try {
    const response = JSON.parse(completion.choices[0]?.message?.content ?? '{}');
    res.json(response);
  } catch (error) {
    console.error("Error parsing AI response:", error);
    res.status(500).json({ error: "Failed to parse AI response" });
  }
});

// Эндпоинт для буста рейтинга
app.post('/servers/:id/boost', authMiddleware, async (req, res): Promise<any> => {
  const { id } = req.params;
  const { amount, paymentMethod }: BoostRequest = req.body;
  const userId = (req as any).user.id;

  // 1. Находим сервер
  const server = servers.find((s: Server) => s.id === id);
  if (!server) {
    return res.status(404).json({ error: 'Сервер не найден' });
  }

  // 2. Рассчитываем стоимость
  const cost = calculateBoostCost(amount);
  
  // 3. Проверяем платеж (это упрощенный пример)
  const paymentSuccess = await processPayment(userId, cost, paymentMethod);
  
  if (!paymentSuccess) {
    return res.status(400).json({ error: 'Ошибка оплаты' });
  }

  // 4. Обновляем рейтинг
  server.rating = Number(server.rating) + Number(amount);
  
  // 5. Сохраняем транзакцию
  const transaction: Transaction = {
    id: randomUUID(),
    userId,
    serverId: id,
    amount: cost,
    ratingAdded: amount,
    paymentMethod,
    date: new Date(),
    status: 'completed'
  };

  const transactions = readJsonFile('./data/transactions.json');
  transactions.push(transaction);
  fs.writeFileSync('./data/transactions.json', JSON.stringify(transactions, null, 2));

  // 6. Сохраняем обновленный сервер
  fs.writeFileSync('./data/servers.json', JSON.stringify(servers, null, 2));

  res.json({
    success: true,
    newRating: server.rating,
    transactionId: transaction.id
  });
});

// Получение истории бустов для сервера
app.get('/servers/:id/boosts', (req, res) => {
  const { id } = req.params;
  const transactions = readJsonFile('./data/transactions.json');
  const serverBoosts = transactions.filter((t: Transaction) => t.serverId === id);
  res.json(serverBoosts);
});

// Вспомогательные функции
function calculateBoostCost(amount: number): number {
  // Например: 30 рублей за 1 пункт рейтинга
  const basePricePerPoint = 30;
  return amount * basePricePerPoint;
}

// Интеграция с платежной системой
async function processPayment(userId: string, amount: number, method: string): Promise<boolean> {
  // Здесь должна быть интеграция с платежной системой
  // Для примера просто возвращаем true
  return true;
}

// Фильтр для серверов по всем параметрам
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

// // Start server prod
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

// Start server
// app.listen(PORT, 'localhost', () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


async function pingJavaServer(host: any, port: number = JAVA_DEFAULT_PORT, timeout: number = DEFAULT_TIMEOUT) {
  try {
    const data: any = await pingJava(host, { port, timeout });
    return data;
  } catch (err) {
    console.error('Ошибка при проверке сервера:', err);
    return { error: 'Failed to parse server response' };
  }
}

async function pingBedrockServer(host: any, port: number = BEDROCK_DEFAULT_PORT, timeout: number = DEFAULT_TIMEOUT) {
  try {
    const data: any = await pingBedrock(host, { port, timeout });
    return data;
  } catch (err) {
    console.error('Ошибка при проверке сервера:', err);
    return { error: 'Failed to parse server response' };
  }
}

async function getServerInfo(address: any, port?: number) {
  return await getMinecraftServerStatus(address, port) ?? await pingJavaServer(address, port) ?? await pingBedrockServer(address, port);
}
