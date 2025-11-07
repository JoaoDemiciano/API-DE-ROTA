import { Request, Response } from 'express';
import { login, refresh, register } from './auth.service';

export const registerHandler = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const result = await register({ name, email, password });
    res.status(201).json({
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role
      },
      tokens: result.tokens
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    res.json({
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role
      },
      tokens: result.tokens
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const refreshHandler = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const result = await refresh(refreshToken);
    res.json({
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role
      },
      tokens: result.tokens
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};
