const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const userRoutes = require('../../src/routes/users');
const db = require('../../src/db');

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

describe('User Routes', () => {
  let testUser;
  let authToken;

  beforeEach(async () => {
    // Create a test user
    testUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      profile: {
        name: 'Test User',
        theme: 'light'
      },
      role: 'user',
      lastLogin: new Date().toISOString()
    };

    // Add user to test database
    await db.read();
    db.data.users.push(testUser);
    await db.write();

    // Generate auth token
    authToken = jwt.sign(
      { id: testUser.id, email: testUser.email, role: testUser.role },
      process.env.JWT_SECRET
    );
  });

  describe('GET /users/profile', () => {
    it('should return user profile when authenticated', async () => {
      const response = await request(app)
        .get('/users/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: testUser.id,
        email: testUser.email,
        profile: testUser.profile,
        lastLogin: testUser.lastLogin
      });
    });

    it('should return 401 when no token provided', async () => {
      const response = await request(app)
        .get('/users/profile');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'No token provided');
    });

    it('should return 401 when invalid token provided', async () => {
      const response = await request(app)
        .get('/users/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid token');
    });

    it('should return 404 when user not found', async () => {
      const nonExistentUserToken = jwt.sign(
        { id: 'non-existent-id', email: 'none@example.com', role: 'user' },
        process.env.JWT_SECRET
      );

      const response = await request(app)
        .get('/users/profile')
        .set('Authorization', `Bearer ${nonExistentUserToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });

  describe('PUT /users/profile', () => {
    it('should update user profile when authenticated', async () => {
      const updates = {
        name: 'Updated Name',
        theme: 'dark'
      };

      const response = await request(app)
        .put('/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Profile updated successfully');

      // Verify changes in database
      await db.read();
      const updatedUser = db.data.users.find(u => u.id === testUser.id);
      expect(updatedUser.profile).toMatchObject(updates);
    });

    it('should return 401 when no token provided', async () => {
      const response = await request(app)
        .put('/users/profile')
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'No token provided');
    });

    it('should return 404 when user not found', async () => {
      const nonExistentUserToken = jwt.sign(
        { id: 'non-existent-id', email: 'none@example.com', role: 'user' },
        process.env.JWT_SECRET
      );

      const response = await request(app)
        .put('/users/profile')
        .set('Authorization', `Bearer ${nonExistentUserToken}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('should only update provided fields', async () => {
      const updates = {
        theme: 'dark'
      };

      const response = await request(app)
        .put('/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates);

      expect(response.status).toBe(200);

      // Verify only theme was updated
      await db.read();
      const updatedUser = db.data.users.find(u => u.id === testUser.id);
      expect(updatedUser.profile.theme).toBe('dark');
      expect(updatedUser.profile.name).toBe(testUser.profile.name);
    });
  });
}); 