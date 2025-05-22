import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Секретный ключ для верификации токена
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Расширяем тип Request, чтобы TypeScript знал о req.user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name?: string;
        picture?: string;
        role?: string; // роль пользователя
      };
    }
  }
}

// Middleware: проверяет, что пользователь авторизован
export const authMiddleware = (req: Request, res: Response, next: NextFunction): any => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Нет токена, авторизация отклонена' });
  }

  try {
    // Используем verify вместо decode, чтобы гарантировать валидность токена
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    req.user = {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name || null,
      picture: decoded.picture || null,
      role: decoded.role || 'user', // по умолчанию — обычный пользователь
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Токен недействителен или истёк' });
  }
};

// Middleware: проверяет, что пользователь — администратор
export const adminOnly = (req: Request, res: Response, next: NextFunction): any => {
  const token = req.cookies['admin-token']; // Достаём токен из куков

  if (!token) {
    return res.status(401).json({ message: 'Токен отсутствует' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещён: требуется роль администратора' });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Невалидный токен' });
  }
};