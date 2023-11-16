import { NextFunction, Request, Response } from 'express';

import HttpError from './http_error';

export function errorHandler(
  error: HttpError,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  const isProduction = process.env.NODE_ENV === 'production';

  error.status = error.status || false;
  error.statusCode = error.statusCode || 500;

  if (isProduction && error.statusCode === 500) {
    res.status(error.statusCode).json({
      status: error.status,
      message: 'Something went wrong. Please contact support',
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
