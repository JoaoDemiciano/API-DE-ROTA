import { Router } from 'express';
import { loginHandler, refreshHandler, registerHandler } from './auth.controller';
import { loginValidators, refreshValidators, registerValidators } from './auth.validators';
import { validateRequest } from '../../middleware/validateRequest';

export const authRouter = Router();

authRouter.post('/register', registerValidators, validateRequest, registerHandler);
authRouter.post('/login', loginValidators, validateRequest, loginHandler);
authRouter.post('/refresh', refreshValidators, validateRequest, refreshHandler);
