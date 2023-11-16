import { Request, Response, NextFunction } from 'express';

import { UserService } from '../../services';

export class UserController {
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json({
        status: true,
        data: await UserService.getAll(),
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json({
        status: true,
        data: await UserService.getById(parseInt(req.params.id)),
      });
    } catch (error) {
      next(error);
    }
  }

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

  static async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      await UserService.updateById(userId, req.body);

      return res.status(200).json({
        status: true,
        data: await UserService.getById(userId),
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      await UserService.deleteById(parseInt(req.params.id));

      return res.status(200).json({
        status: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
