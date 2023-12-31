import { WhereOptions } from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';
import { NextFunction, Request, Response } from 'express';

export function recordExists(model: ModelCtor) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const whereClause: WhereOptions = {
      id: parseInt(req.params.id),
    };
    const record = await model.count({
      where: whereClause,
    });

    if (record === 0) {
      return res.status(404).json({
        status: false,
        message: `The requested record with id "${req.params.id}" does not exist`,
      });
    } else {
      next();
    }
  };
}
