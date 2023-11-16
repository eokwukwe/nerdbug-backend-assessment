import cors from 'cors';
import morgan from 'morgan';
import express, { Response, Request, NextFunction } from 'express';

import './database/connection';

import apiRoutes from './routes';
import HttpError from './utils/http_error';
import { errorHandler } from './utils/error_handler';

export function createApp(port: number) {
  const app = express();

  app.use(express.json());

  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }

  app.use(cors());

  app.use('/api', apiRoutes);

  // UNHANDLED ROUTE
  app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new HttpError(`Route ${req.originalUrl} not found`, 404));
  });

  // GLOBAL ERROR HANDLER
  app.use(errorHandler);

  const server = app.listen(port, () => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`Server started on port: http://localhost:${port}`);
    }
  });

  return server;
}
