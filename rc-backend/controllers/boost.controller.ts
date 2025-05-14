import { Request, Response } from 'express';
import { BoostRequest } from '../interfaces/boost.interface';
import { applyBoostToServer } from '../services/boost.service';

export const boostServerRating = (req: Request, res: Response): void => {
  const userId = (req as any).user.id;
  const { amount, paymentMethod } = req.body as BoostRequest;
  const { id: serverId } = req.params;

  const result = applyBoostToServer(serverId, userId, amount, paymentMethod);

  if (result.success) {
    res.json({
      success: true,
      newRating: result.newRating,
      transactionId: result.transactionId,
    });
  } else {
    res.status(400).json({ success: false, error: result.error });
  }
};