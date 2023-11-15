import { Server } from 'http';
import request from 'supertest';

import { createApp } from '../src/app';
import { UserService } from '../src/services';
import { CreateUserInput } from '../src/schemas';
import sequelize from '../src/database/connection';

const usersFixture: CreateUserInput[] = [
  {
    first_name: 'John',
    last_name: 'Doe',
    email: 'John@mail.com',
    password: 'password',
    role: 'admin',
  },
  {
    first_name: 'James',
    last_name: ' Doe',
    email: 'James@mail.com',
    password: 'password',
    role: 'user',
  },
  {
    first_name: 'Jane',
    last_name: 'Doe',
    email: 'Jane@mail.com',
    password: 'password',
    role: 'user',
  },
];

describe('User Resource Test', () => {
  let app: Server;

  beforeAll(async () => {
    await sequelize.sync();
    app = createApp(3333);
  });

  afterAll(async () => {
    app.close();
    await sequelize.drop();
    await sequelize.close();
  });

  describe('Create User Endpoint', () => {
    const url = '/api/users';

    it('should validate required fields', async () => {
      const response = await request(app).post(url).send({});

      expect(response.status).toBe(422);
      expect(response.body.errors).toMatchObject({
        first_name: 'First name is required',
        last_name: 'Last name is required',
        email: 'Email is required',
        password: 'Password is required',
        role: 'Invalid role. Available roles [user, admin].',
      });
    });

    it('should validate field types', async () => {
      const response = await request(app).post(url).send({
        first_name: 123,
        last_name: 123,
        email: 'email',
        password: 123,
        role: 'adminus',
      });

      expect(response.status).toBe(422);
      expect(response.body.errors).toMatchObject({
        first_name: 'First name must be a string',
        last_name: 'Last name must be a string',
        email: 'Invalid email address',
        password: 'Password must be a string',
        role: 'Invalid role. Available roles [user, admin].',
      });
    });

    it('should validate duplicate record', async () => {
      await UserService.create(usersFixture[0]);

      const response = await request(app).post(url).send(usersFixture[0]);

      expect(response.status).toBe(422);
      expect(response.body.errors).toMatchObject({
        email: 'Email already exists',
      });
    });

    it('should create a new user record with valid input', async () => {
      const response = await request(app).post(url).send(usersFixture[1]);

      const { password, ...othersFields } = usersFixture[1];

      expect(response.status).toBe(201);
      expect(response.body.data).toMatchObject(othersFields);
    });
  });
});
