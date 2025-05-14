import jwt from 'jsonwebtoken';

export const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Нет токена, авторизация отклонена' });
  }

  try {
    const decoded = jwt.decode(token) as any; // Декодируем токен
    if (decoded) {
        req.user = {
          id: decoded.sub, // Используем sub как user.id
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture,
        };
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Токен недействителен' });
  }
};