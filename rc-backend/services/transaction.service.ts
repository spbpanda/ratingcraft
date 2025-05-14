// src/services/transaction.service.ts
import { Transaction } from '../interfaces/transaction.interface';
import { readJsonFile, writeJsonFile } from '../utils/file.utils';

const TRANSACTIONS_PATH = './data/transactions.json';

export const getAllTransactions = (): Transaction[] => {
  return readJsonFile<Transaction[]>(TRANSACTIONS_PATH);
};

export const getTransactionsByUserId = (userId: string): Transaction[] => {
  const transactions = getAllTransactions();
  return transactions.filter((tr) => tr.userId === userId);
};

export const addTransaction = (newTransaction: Transaction): void => {
  const transactions = getAllTransactions();
  transactions.push(newTransaction);
  writeJsonFile(TRANSACTIONS_PATH, transactions);
};