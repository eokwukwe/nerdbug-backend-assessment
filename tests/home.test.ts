import { Server } from 'http';
import request from 'supertest';

import { createApp } from '../src/app';

describe('Home route', () => {
  let app: Server;

  beforeAll(async () => {
    app = createApp(3000);
  });

  afterAll(async () => {
    app.close();
  });

  it('should return 200 when GET /api', async () => {
    const response = await request(app).get('/api');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: true,
      message: 'Welcome to NERDBUG backend assessment API',
    });
  });
});
