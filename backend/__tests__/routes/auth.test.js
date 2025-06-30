const request = require('supertest');
const express = require('express');
const authRoutes = require('../../src/routes/auth');
const db = require('../../src/db');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Routes', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'testpassword123',
    name: 'Test User'
  };

  describe('POST /auth/signup', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('userId');

      // Verify user was created in DB
      await db.read();
      const user = db.data.users.find(u => u.email === testUser.email);
      expect(user).toBeDefined();
      expect(user.profile.name).toBe(testUser.name);
    });

    it('should return 400 if email already exists', async () => {
      // First signup
      await request(app)
        .post('/auth/signup')
        .send(testUser);

      // Try to signup again with same email
      const response = await request(app)
        .post('/auth/signup')
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Email already registered');
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({ email: testUser.email });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Email, password, and name are required');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Create a test user before each login test
      await request(app)
        .post('/auth/signup')
        .send(testUser);
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should return 401 with invalid password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });

    it('should return 401 with non-existent email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });
  });

  describe('POST /auth/reset-password', () => {
    beforeEach(async () => {
      // Create a test user before each reset password test
      await request(app)
        .post('/auth/signup')
        .send(testUser);
    });

    it('should initiate password reset for existing email', async () => {
      const response = await request(app)
        .post('/auth/reset-password')
        .send({ email: testUser.email });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Password reset link sent to email');
    });

    it('should return 404 for non-existent email', async () => {
      const response = await request(app)
        .post('/auth/reset-password')
        .send({ email: 'nonexistent@example.com' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('should return 400 if email is missing', async () => {
      const response = await request(app)
        .post('/auth/reset-password')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Email is required');
    });
  });
}); 