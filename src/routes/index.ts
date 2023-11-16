import { Request, Response, Router } from 'express';

import { AuthController, UserController } from '../controllers';
import { createUserSchema, loginSchema, updateUserSchema } from '../schemas';
import { adminCheck, authCheck, validate, recordExists } from '../middlewares';

import User from '../database/models/user';

const router = Router();

// Base route
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: true,
    message: 'Welcome to NERDBUG backend assessment API',
  });
});

// User routes
router.get('/users', authCheck, adminCheck, UserController.getAll);
router.get('/users/:id', authCheck, recordExists(User), UserController.getById);
router.post('/users', validate(createUserSchema), UserController.create);
router.put(
  '/users/:id',
  authCheck,
  recordExists(User),
  validate(updateUserSchema),
  UserController.updateById
);
router.delete(
  '/users/:id',
  authCheck,
  adminCheck,
  recordExists(User),
  UserController.deleteById
);

// Auth routes
router.post('/auth/login', validate(loginSchema), AuthController.login);
router.delete('/auth/logout', authCheck, AuthController.logout);

export default router;
