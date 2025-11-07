import './config/env';
import app from './app';
import { logger } from './utils/logger';

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(port, () => {
  logger.info(`RotaPerfeita API listening on port ${port}`);
});
