import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandler';
import { authRouter } from './modules/auth/auth.routes';
import { routesRouter } from './modules/routes/routes.routes';
import { historyRouter } from './modules/history/history.routes';
import { adminRouter } from './modules/admin/admin.routes';
import { authenticate } from './middleware/auth';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/auth', authRouter);
app.use('/routes', authenticate, routesRouter);
app.use('/history', authenticate, historyRouter);
app.use('/admin', authenticate, adminRouter);

app.use(errorHandler);

export default app;
