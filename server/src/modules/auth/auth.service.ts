import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateTokens, verifyRefreshToken } from '../../services/token.service';

const prisma = new PrismaClient();

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export const register = async ({ name, email, password }: RegisterInput) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error('E-mail já cadastrado');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: Role.USER
    }
  });

  const tokens = generateTokens({ sub: user.id, role: user.role, email: user.email });
  return { user, tokens };
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) {
    throw new Error('Credenciais inválidas');
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    throw new Error('Credenciais inválidas');
  }

  const tokens = generateTokens({ sub: user.id, role: user.role, email: user.email });
  return { user, tokens };
};

export const refresh = async (token: string) => {
  const payload = verifyRefreshToken(token);
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || !user.isActive) {
    throw new Error('Usuário inválido');
  }
  const tokens = generateTokens({ sub: user.id, role: user.role, email: user.email });
  return { user, tokens };
};
