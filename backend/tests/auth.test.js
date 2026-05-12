require('dotenv').config();
const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');
const db = require('../src/config/db');

describe('Auth API', () => {
  const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123',
  };

  afterAll(async () => {
    // Cleanup
    await db.query('DELETE FROM users WHERE email = $1', [testUser.email]);
    await db.end();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).to.equal(201);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.have.property('token');
    expect(res.body.data.user).to.have.property('email', testUser.email);
  });

  it('should not register with existing email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).to.equal(409);
    expect(res.body.success).to.be.false;
  });

  it('should login the user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.have.property('token');
  });

  it('should not login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' });

    expect(res.status).to.equal(401);
    expect(res.body.success).to.be.false;
  });
});
