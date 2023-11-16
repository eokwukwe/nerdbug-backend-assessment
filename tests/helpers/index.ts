import { faker } from '@faker-js/faker';

import { CreateUserInput, UserRole } from '../../src/schemas';
import { AuthService, SessionService, UserService } from '../../src/services';

type Roles = `${UserRole}`;

export const createTestSession = async (role: Roles) => {
  const user = await UserService.create({
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: '$2a$12$7e4l13Ozf.5I8H/rmbY/Gu6oWk747TS3qB53T62nArKEUqbGv09h.',
    role,
  });

  const session = await SessionService.create(user);
  const token = await AuthService.generateAccessToken(session.id);

  return { token, session };
};

export const testUsers: CreateUserInput[] = Array.from({ length: 10 }).map(
  (_) => ({
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: 'password',
    role: 'user',
  })
);
