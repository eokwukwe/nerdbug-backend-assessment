import { NextFunction, Request, Response } from 'express';

import HttpError from '../utils/http_error';

export async function adminCheck(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.user && req.user.role !== 'admin') {
      return next(new HttpError('Unauthorized operation', 403));
    }

    next();
  } catch (err: any) {
    next(err);
  }
}
