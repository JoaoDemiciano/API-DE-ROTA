import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

const accessSecret = process.env.JWT_ACCESS_SECRET || 'access-secret';
const refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh-secret';

const accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export interface TokenPayload {
  sub: string;
  role: Role;
  email: string;
}

export const generateTokens = (payload: TokenPayload) => {
  const accessToken = jwt.sign(payload, accessSecret, { expiresIn: accessExpiresIn });
  const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: refreshExpiresIn });
  return { accessToken, refreshToken };
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, refreshSecret) as TokenPayload;
};
