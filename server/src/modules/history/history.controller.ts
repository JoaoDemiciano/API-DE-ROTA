import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { duplicateHistory, listHistory } from './history.service';

export const getHistoryHandler = async (req: AuthRequest, res: Response) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const offset = req.query.offset ? Number(req.query.offset) : 0;
    const history = await listHistory(req.user!.id, limit, offset);
    res.json({ items: history, pagination: { limit, offset } });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const duplicateHistoryHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const record = await duplicateHistory(id, req.user!.id);
    res.status(201).json(record);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};
