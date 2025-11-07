import request from 'supertest';
import app from '../src/app';

describe('Routes API', () => {
  it('requires authentication', async () => {
    const res = await request(app).post('/routes').send({
      origin: 'A',
      destination: 'B'
    });
    expect(res.status).toBe(401);
  });
});
