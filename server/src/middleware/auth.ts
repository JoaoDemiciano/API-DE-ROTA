import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: Role;
    email: string;
  };
}

const accessSecret = process.env.JWT_ACCESS_SECRET || 'access-secret';

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization || req.cookies?.accessToken;
    if (!authHeader) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
    const payload = jwt.verify(token, accessSecret) as { sub: string; role: Role; email: string };

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Usuário inativo ou não encontrado' });
    }

    req.user = { id: user.id, role: user.role, email: user.email };
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export const authorize = (roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    return next();
  };
};
