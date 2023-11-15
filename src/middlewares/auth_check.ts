import { NextFunction, Request, Response } from 'express';


import { verifyJwt } from '../utils/jwt';
import HttpError from '../utils/http_error';
import { SessionService } from '../services';

export async function authCheck(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.headers.authorization) {
      return next(new HttpError('You are not logged in', 401));
    }

    const accessToken = req.headers.authorization.split(' ')[1];

    if (!accessToken) {
      return next(new HttpError('You are not logged in', 401));
    }

    // Validate the access token
    const decoded = verifyJwt<{ sub: number }>(
      accessToken,
      'accessTokenPublicKey'
    );

    if (!decoded) {
      return next(new HttpError(`Invalid token or user doesn't exist`, 401));
    }

    // Check if the user has a valid session
    const session = await SessionService.getById(decoded.sub);

    if (!session || session.hasExpired()) {
      return next(new HttpError('Invalid token or session has expired', 401));
    }

    // Add user and sessionId to request object
    req.user = session.user;
    req.session = session.id;

    next();
  } catch (err: any) {
    next(err);
  }
}
