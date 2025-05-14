// src/controllers/transaction.controller.ts
import { Request, Response } from 'express';
import { getTransactionsByUserId } from '../services/transaction.service';
import { Transaction } from '../interfaces/transaction.interface';

export const getTransactions = (req: Request, res: Response): void => {
  const userId = (req as any).user.id;

  const userTransactions = getTransactionsByUserId(userId).sort(
    (a: Transaction, b: Transaction) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  res.json(userTransactions);
};