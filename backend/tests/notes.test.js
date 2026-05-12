require('dotenv').config();
const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');
const db = require('../src/config/db');

describe('Notes API', () => {
  let token;
  const testUser = {
    name: 'Notes Tester',
    email: `notestester${Date.now()}@example.com`,
    password: 'password123',
  };
  let testNoteId;

  beforeAll(async () => {
    // Register and login to get token
    await request(app).post('/api/auth/register').send(testUser);
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });
    token = res.body.data.token;
  });

  afterAll(async () => {
    // Cleanup
    await db.query('DELETE FROM users WHERE email = $1', [testUser.email]);
  });

  it('should create a new note', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Note',
        content: 'This is a test note content',
      });

    expect(res.status).to.equal(201);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.have.property('title', 'Test Note');
    testNoteId = res.body.data.id;
  });

  it('should get all notes for user', async () => {
    const res = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.be.an('array');
    expect(res.body.data.length).to.be.at.least(1);
  });

  it('should update a note', async () => {
    const res = await request(app)
      .put(`/api/notes/${testNoteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Test Note',
      });

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.have.property('title', 'Updated Test Note');
  });

  it('should delete a note', async () => {
    const res = await request(app)
      .delete(`/api/notes/${testNoteId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
  });
});
