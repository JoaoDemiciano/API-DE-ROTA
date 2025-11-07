import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { auditHistory, exportHistoryCsv, listUsers, metrics, updateUserStatus } from './admin.service';

export const listUsersHandler = async (_req: AuthRequest, res: Response) => {
  const users = await listUsers({ search: _req.query.search?.toString() });
  res.json(users);
};

export const updateUserStatusHandler = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { isActive } = req.body;
  const user = await updateUserStatus(id, Boolean(isActive));
  res.json(user);
};

export const auditHistoryHandler = async (req: AuthRequest, res: Response) => {
  const { userId, from, to } = req.query;
  const data = await auditHistory({
    userId: userId?.toString(),
    from: from?.toString(),
    to: to?.toString()
  });
  res.json(data);
};

export const exportHistoryHandler = async (req: AuthRequest, res: Response) => {
  const { userId, from, to } = req.query;
  const csv = await exportHistoryCsv({
    userId: userId?.toString(),
    from: from?.toString(),
    to: to?.toString()
  });
  res.header('Content-Type', 'text/csv');
  res.attachment('history.csv');
  res.send(csv);
};

export const metricsHandler = async (_req: AuthRequest, res: Response) => {
  const data = await metrics();
  res.json(data);
};
