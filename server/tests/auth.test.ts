import request from 'supertest';
import app from '../src/app';

describe('Auth routes', () => {
  it('rejects login without payload', async () => {
    const response = await request(app).post('/auth/login').send({});
    expect(response.status).toBe(400);
  });
});
