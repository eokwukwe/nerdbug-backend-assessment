import { Response, Router } from 'express';

import { validate } from '../middlewares';
import { UserController } from '../controllers';
import { createUserSchema } from '../schemas';

const router = Router();

// User routes
router.post('/users', validate(createUserSchema), UserController.create);

export default router;
