import { NextFunction, Request, Response } from 'express';

import { LoginInput } from '../../schemas';
import { AuthService } from '../../services';

export class AuthController {
  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const access_token = await AuthService.login(req.body);

      return res.status(200).json({
        status: true,
        token_type: 'Bearer',
        access_token,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await AuthService.logout(req.session);

      return res.status(200).json({
        status: true,
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  }
}
