import { Router } from 'express';
import { duplicateHistoryHandler, getHistoryHandler } from './history.controller';

export const historyRouter = Router();

historyRouter.get('/', getHistoryHandler);
historyRouter.post('/:id/duplicate', duplicateHistoryHandler);
