import { body } from 'express-validator';

export const registerValidators = [
  body('name').isString().isLength({ min: 2 }).withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('E-mail inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter ao menos 6 caracteres')
];

export const loginValidators = [
  body('email').isEmail().withMessage('E-mail inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória')
];

export const refreshValidators = [
  body('refreshToken').notEmpty().withMessage('Refresh token é obrigatório')
];
