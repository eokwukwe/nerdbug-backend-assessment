// import 'reflect-metadata';

import cors from 'cors';
import morgan from 'morgan';
import express, { Response, Request, NextFunction } from 'express';

import './database/connection';

import apiRoutes from './routes';
import HttpError from './utils/http_error';

export function createApp(port: number) {
  const app = express();

  app.use(express.json());

  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }

  app.use(cors());

  app.get('/api', (_req: Request, res: Response) => {
    res.status(200).json({
      status: true,
      message: 'Welcome to NERDBUG backend assessment API',
    });
  });

  app.use('/api', apiRoutes);

  // UNHANDLED ROUTE
  app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new HttpError(`Route ${req.originalUrl} not found`, 404));
  });

  // GLOBAL ERROR HANDLER
  app.use(
    (error: HttpError, _req: Request, res: Response, next: NextFunction) => {
      const isProduction = process.env.NODE_ENV === 'production';

      error.status = error.status || false;
      error.statusCode = error.statusCode || 500;

      if (isProduction && error.statusCode === 500) {
        res.status(error.statusCode).json({
          status: error.status,
          message: 'Something went wrong.Please contact support',
        });
      } else if (error.statusCode === 500) {
        res.status(error.statusCode).json({
          status: error.status,
          message: error.message,
          error,
        });
      } else {
        res.status(error.statusCode).json({
          status: error.status,
          message: error.message,
        });
      }
    }
  );

  const server = app.listen(port, () => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`Server started on port: http://localhost:${port}`);
    }
  });

  return server;
}
