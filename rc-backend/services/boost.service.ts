import { readJsonFile, writeJsonFile } from '../utils/file.utils';
import { Server } from '../interfaces/server.interface';
import { Transaction } from '../interfaces/transaction.interface';
import { randomUUID } from 'crypto';

const SERVERS_PATH = './data/servers.json';
const TRANSACTIONS_PATH = './data/transactions.json';

const BASE_PRICE_PER_POINT = 30;

// Расчёт стоимости буста
export const calculateBoostCost = (amount: number): number => {
  return amount * BASE_PRICE_PER_POINT;
};

// Заглушка для обработки платежа
export const processPayment = async (
  userId: string,
  amount: number,
  method: string
): Promise<boolean> => {
  // TODO: Здесь должна быть интеграция с платёжной системой
  console.log(`Processing payment for user ${userId}, amount: ${amount}, method: ${method}`);
  return true; // временно всегда успешная оплата
};

// Применение буста к серверу и создание транзакции
export const applyBoostToServer = (
  serverId: string,
  userId: string,
  amount: number,
  paymentMethod: string
): { success: boolean; newRating?: number; transactionId?: string, error?: string } => {
  try {
    const servers = readJsonFile<Server[]>(SERVERS_PATH);
    const transactions = readJsonFile<Transaction[]>(TRANSACTIONS_PATH);

    const server = servers.find((s) => s.id === serverId);
    if (!server) {
      throw new Error('Сервер не найден');
    }

    const cost = calculateBoostCost(amount);

    // Проверяем оплату
    const paymentSuccess = processPayment(userId, cost, paymentMethod);
    if (!paymentSuccess) {
      throw new Error('Ошибка оплаты');
    }

    // Обновляем рейтинг
    server.rating = Number(server.rating) + Number(amount);

    // Создаем транзакцию
    const transaction: Transaction = {
      id: randomUUID(),
      userId,
      serverId,
      serverName: server.name || server.id!,
      amount: cost,
      ratingAdded: amount,
      paymentMethod,
      date: new Date(),
      status: 'completed',
    };

    transactions.push(transaction);

    // Сохраняем изменения
    writeJsonFile(SERVERS_PATH, servers);
    writeJsonFile(TRANSACTIONS_PATH, transactions);

    return {
      success: true,
      newRating: server.rating,
      transactionId: transaction.id,
    };
  } catch (error: any) {
    console.error('Ошибка при бусте рейтинга:', error.message);
    return { success: false, error: error.message };
  }
};