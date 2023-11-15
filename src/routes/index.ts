import { Router } from 'express';

import { authCheck, validate } from '../middlewares';
import { AuthController, UserController } from '../controllers';
import { createUserSchema, loginSchema, updateUserSchema } from '../schemas';

import User from '../database/models/user';
import recordExists from '../middlewares/record_exists';

const router = Router();

// User routes
router.get('/users', authCheck, UserController.getAll);
router.get('/users/:id', authCheck, recordExists(User), UserController.getById);
router.put(
  '/users/:id',
  authCheck,
  recordExists(User),
  validate(updateUserSchema),
  UserController.updateById
);
router.post('/users', validate(createUserSchema), UserController.create);
router.delete(
  '/users/:id',
  authCheck,
  recordExists(User),
  UserController.deleteById
);

// Auth routes
router.post('/auth/login', validate(loginSchema), AuthController.login);
router.delete('/auth/logout', authCheck, AuthController.logout);

export default router;
