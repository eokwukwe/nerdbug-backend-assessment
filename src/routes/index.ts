import { Router } from 'express';

import { validate } from '../middlewares';
import { UserController } from '../controllers';
import { createUserSchema, updateUserSchema } from '../schemas';

import User from '../database/models/user';
import recordExists from '../middlewares/record_exists';

const router = Router();

// User routes
router.get('/users', UserController.getAll);
router.get('/users/:id', recordExists(User), UserController.getById);
router.put(
  '/users/:id',
  recordExists(User),
  validate(updateUserSchema),
  UserController.updateById
);
router.post('/users', validate(createUserSchema), UserController.create);
router.delete('/users/:id', recordExists(User), UserController.deleteById);

export default router;
