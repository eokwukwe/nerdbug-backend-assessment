import { object, string, TypeOf, z } from 'zod';
import User from '../database/models/user';

export const createUserSchema = object({
  body: object({
    first_name: string({
      required_error: 'First name is required',
      invalid_type_error: 'First name must be a string',
    }),
    last_name: string({
      required_error: 'Last name is required',
      invalid_type_error: 'Last name must be a string',
    }),
    email: string({
      required_error: 'Email is required',
    }).email('Invalid email address'),
    password: string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    }).min(8, 'Password must be at least 8 characters'),
    role: z.enum(['user', 'admin'], {
      errorMap: () => ({
        message: `Invalid role. Available roles [user, admin].`,
      }),
    }),
  }),
}).superRefine(async (data, ctx) => {
  const count = await User.count({ where: { email: data.body.email } });

  if (count) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['body', 'email'],
      message: 'Email already exists',
    });
  }
});

export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];
