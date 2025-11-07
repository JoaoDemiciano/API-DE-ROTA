import { Router } from 'express';
import { createRouteHandler, getRouteHandler } from './routes.controller';

export const routesRouter = Router();

routesRouter.post('/', createRouteHandler);
routesRouter.get('/:id', getRouteHandler);
