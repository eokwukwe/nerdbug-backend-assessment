import { ZodError, ZodTypeAny } from 'zod';
import { Request, Response, NextFunction } from 'express';

export function validate(schema: ZodTypeAny) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        params: req.params,
        query: req.query,
        body: req.body,
      });

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.reduce((acc, issue) => {
          /**
           * issue.path is an array of strings of the form ['body', 'email'],
           * ['body', 'password'], etc. We want to convert this to an object of
           * the form { email: 'error message', password: 'error message' }
           * so that we can easily access the error message for each field
           */
          acc[issue.path[1]] = issue.message;
          return acc;
        }, {} as Record<string, string>);

        return res.status(422).json({
          status: false,
          message: 'Invalid data provided',
          errors,
        });
      }

      next(error);
    }
  };
}
