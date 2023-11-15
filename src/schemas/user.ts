import { object, string, TypeOf, z } from 'zod';
import User from '../database/models/user';

export const baseUserSchema = object({
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
    role: z.enum(['user', 'admin'], {
      errorMap: () => ({
        message: `Invalid role. Available roles [user, admin].`,
      }),
    }),
  }),
});

const passwordSchema = object({
  password: string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }).min(8, 'Password must be at least 8 characters'),
});

export const createUserSchema = baseUserSchema
  .extend({
    body: baseUserSchema.shape.body.extend(passwordSchema.shape),
  })
  .superRefine(async (data, ctx) => {
    const count = await User.count({ where: { email: data.body.email } });

    if (count) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['body', 'email'],
        message: 'Email already exists',
      });
    }
  });

export const updateUserSchema = baseUserSchema
  .deepPartial()
  .superRefine(async (data, ctx) => {
    let count: number | undefined;
    if (data.body && data.body.email) {
      count = await User.count({ where: { email: data.body.email } });

      if (count) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['body', 'email'],
          message: 'Email already exists',
        });
      }
    }
  });

export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];
