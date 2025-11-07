import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { getRouteById, requestRoute } from './routes.service';

export const createRouteHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { origin, destination, waypoints, avoidTolls, avoidTraffic } = req.body;
    if (!origin || !destination) {
      return res.status(400).json({ message: 'Origem e destino são obrigatórios' });
    }
    const response = await requestRoute({
      userId: req.user!.id,
      origin,
      destination,
      waypoints,
      avoidTolls,
      avoidTraffic
    });
    res.status(201).json(response);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getRouteHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const route = await getRouteById(id, req.user!.id);
    res.json(route);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};
