import { Server } from 'http';
import request from 'supertest';

import sequelize from '../src/database/connection';

import { createApp } from '../src/app';
import { createTestSession, testUsers } from './helpers';
import { SessionService, UserService } from '../src/services';

describe('Authentication Resource Test', () => {
  let app: Server;

  const url = '/api/auth';

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  beforeAll(async () => {
    app = createApp(3032);
  });

  afterAll(async () => {
    app.close();
    await sequelize.close();
  });

  describe('Login Endpoint', () => {
    it('should validate required fields', async () => {
      const response = await request(app).post(`${url}/login`).send({});

      expect(response.status).toBe(422);
      expect(response.body.errors).toMatchObject({
        email: 'Email is required',
        password: 'Password is required',
      });
    });

    it('should return 401 error for email that does not exist', async () => {
      const response = await request(app).post(`${url}/login`).send({
        email: 'wrong@email.com',
        password: 'password',
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toEqual('Invalid email or password');
    });

    it('should return 401 error for wrong password', async () => {
      const user = testUsers[0];
      await UserService.create(user);

      const response = await request(app).post(`${url}/login`).send({
        email: user.email,
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toEqual('Invalid email or password');
    });

    it('should authenticate a user with valid credential and create a session', async () => {
      const user = testUsers[0];
      const newUser = await UserService.model.create(user);

      const response = await request(app).post(`${url}/login`).send({
        email: user.email,
        password: user.password,
      });

      expect(response.status).toBe(200);
      expect(response.body.token_type).toEqual('Bearer');

      await newUser.reload({ include: [{ model: SessionService.model }] });
      expect(newUser.sessions.length).not.toEqual(0);
    });
  });

  describe('Log Out Endpoint', () => {
    it('should confirm that only authenticated user can log out', async () => {
      const response = await request(app).delete(`${url}/logout`);

      expect(response.status).toBe(401);
      expect(response.body.message).toEqual('You are not logged in');
    });

    it('should log out an authenticated user and delete session', async () => {
      const { token, session } = await createTestSession('user');

      const response = await request(app)
        .delete(`${url}/logout`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toEqual('Logout successful');

      const sessionRecord = await SessionService.getById(session.id);
      expect(sessionRecord).toBeNull();
    });
  });
});
