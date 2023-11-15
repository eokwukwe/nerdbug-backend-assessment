import { Request, Response, NextFunction } from 'express';

import { UserService } from '../../services';

export class UserController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.create(req.body);

      return res.status(201).json({
        status: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}
