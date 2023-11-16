import { Server } from 'http';
import request from 'supertest';

import sequelize from '../src/database/connection';

import { createApp } from '../src/app';
import { UserService } from '../src/services';
import { createTestSession, testUsers } from './helpers';

describe('User Resource Test', () => {
  let app: Server;
  const url = '/api/users';

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  beforeAll(async () => {
    app = createApp(3033);
  });

  afterAll(async () => {
    app.close();
    await sequelize.close();
  });

  describe('Get User Record Endpoints', () => {
    it('should verify that only admin can fetch all users', async () => {
      const { token } = await createTestSession('user');
      await UserService.model.bulkCreate(testUsers);

      const response = await request(app)
        .get(url)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toEqual('Unauthorized operation');
    });

    it('should get all user records', async () => {
      const { token } = await createTestSession('admin');
      await UserService.model.bulkCreate(testUsers);

      const response = await request(app)
        .get(url)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(testUsers.length + 1);
    });

    it('should get a user by id', async () => {
      const { token } = await createTestSession('user');
      let records = await UserService.model.bulkCreate(testUsers);

      const response = await request(app)
        .get(`${url}/${records[0].id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toEqual(records[0].id);
      expect(response.body.data.role).toEqual(records[0].role);
    });

    it('should return 404 if user record does not exist', async () => {
      const { token } = await createTestSession('user');
      const id = testUsers.length + 10;
      await UserService.model.bulkCreate(testUsers);

      const response = await request(app)
        .get(`${url}/${id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toEqual(
        `The requested record with id "${id}" does not exist`
      );
    });
  });

  describe('Create User Record Endpoint', () => {
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
      await UserService.create(testUsers[0]);

      const response = await request(app).post(url).send(testUsers[0]);

      expect(response.status).toBe(422);
      expect(response.body.errors).toMatchObject({
        email: 'Email already exists',
      });
    });

    it('should create a new user record with valid input', async () => {
      const response = await request(app).post(url).send(testUsers[0]);

      const { password, ...othersFields } = testUsers[0];

      expect(response.status).toBe(201);
      expect(response.body.data).toMatchObject(othersFields);
    });
  });

  describe('Update User Record Endpoint', () => {
    it('should validates field types', async () => {
      const { token } = await createTestSession('user');
      let records = await UserService.model.bulkCreate(testUsers);

      const response = await request(app)
        .put(`${url}/${records[0].id}`)
        .send({ email: 'email.com' })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(422);
      expect(response.body.errors).toMatchObject({
        email: 'Invalid email address',
      });
    });

    it('should validates duplicate email', async () => {
      const { token } = await createTestSession('user');
      let records = await UserService.model.bulkCreate(testUsers);

      const response = await request(app)
        .put(`${url}/${records[0].id}`)
        .send({ email: records[1].email })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(422);
      expect(response.body.errors).toMatchObject({
        email: 'Email already exists',
      });
    });

    it('should update a user record by id', async () => {
      const { token } = await createTestSession('user');
      let records = await UserService.model.bulkCreate(testUsers);

      const response = await request(app)
        .put(`${url}/${records[0].id}`)
        .send({
          first_name: 'Johnson',
          last_name: 'Doeman',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.first_name).toEqual('Johnson');
      expect(response.body.data.last_name).toEqual('Doeman');
    });

    it('should return 404 if user record does not exist', async () => {
      const { token } = await createTestSession('user');
      const id = testUsers.length + 10;
      await UserService.model.bulkCreate(testUsers);

      const response = await request(app)
        .put(`${url}/${id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toEqual(
        `The requested record with id "${id}" does not exist`
      );
    });
  });

  describe('Delete User Record Endpoint', () => {
    it('should verify that only admin can delete a user', async () => {
      const { token } = await createTestSession('user');
      let records = await UserService.model.bulkCreate(testUsers);

      const response = await request(app)
        .delete(`${url}/${records[0].id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toEqual('Unauthorized operation');
    });

    it('should delete a user record by id', async () => {
      const { token } = await createTestSession('admin');
      let records = await UserService.model.bulkCreate(testUsers);

      const response = await request(app)
        .delete(`${url}/${records[0].id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toEqual('User deleted successfully');
    });

    it('should return 404 if user record does not exist', async () => {
      const { token } = await createTestSession('admin');
      const id = testUsers.length + 10;
      await UserService.model.bulkCreate(testUsers);

      const response = await request(app)
        .delete(`${url}/${id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toEqual(
        `The requested record with id "${id}" does not exist`
      );
    });
  });
});
