import { Router } from 'express';
import { authorize } from '../../middleware/auth';
import {
  auditHistoryHandler,
  exportHistoryHandler,
  listUsersHandler,
  metricsHandler,
  updateUserStatusHandler
} from './admin.controller';
import { Role } from '@prisma/client';

export const adminRouter = Router();

adminRouter.use(authorize([Role.ADMIN]));

adminRouter.get('/users', listUsersHandler);
adminRouter.patch('/users/:id', updateUserStatusHandler);
adminRouter.get('/history', auditHistoryHandler);
adminRouter.get('/export/history.csv', exportHistoryHandler);
adminRouter.get('/metrics', metricsHandler);
