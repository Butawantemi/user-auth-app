const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('../Routes/auth.route');
const sequelize = require('../Config/dbConnect'); // Adjust the path according to your project structure

// Set up the express app
const app = express();
app.use(bodyParser.json());
app.use('/', authRoutes);

// Database setup for testing
beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.close();
});

describe('POST /auth/register', () => {
  it('should register user successfully', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@example.com',
        password: 'testpassword',
      });
    expect(response.statusCode).toEqual(201);
    expect(response.body).toHaveProperty('token');
  });

  it('should fail if required fields are missing', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({});
    expect(response.statusCode).toEqual(400);
  });

  it('should fail if there is a duplicate email', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@example.com',
        password: 'testpassword',
      });

    const response = await request(app)
      .post('/auth/register')
      .send({
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@example.com',
        password: 'testpassword',
      });
    expect(response.statusCode).toBe(422);
  });
});

describe('POST /auth/login', () => {
  it('should log the user in successfully', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        firstName: 'Test',
        lastName: 'User',
        email: 'loginuser@example.com',
        password: 'testpassword',
      });

    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'loginuser@example.com',
        password: 'testpassword',
      });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should fail if email or password is incorrect', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'wrong@example.com',
        password: 'wrongpassword',
      });
    expect(response.statusCode).toEqual(401);
  });
});

describe('GET /api/users/:id', () => {
  let userId;
  beforeAll(async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        firstName: 'Test',
        lastName: 'User',
        email: 'getuser@example.com',
        password: 'testpassword',
      });
    userId = response.body.id;
  });

  it('should get user details successfully', async () => {
    const response = await request(app)
      .get(`/api/users/${userId}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty('email', 'getuser@example.com');
  });

  it('should return 404 if user not found', async () => {
    const response = await request(app)
      .get('/api/users/nonexistentid');
    expect(response.statusCode).toEqual(404);
  });
});
