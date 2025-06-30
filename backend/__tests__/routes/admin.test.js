const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const adminRoutes = require('../../src/routes/admin');
const db = require('../../src/db');

const app = express();
app.use(express.json());
app.use('/admin', adminRoutes);

describe('Admin Routes', () => {
  let adminUser;
  let regularUser;
  let adminToken;
  let userToken;
  let testTask;

  beforeEach(async () => {
    // Create admin user
    adminUser = {
      id: 'admin-id',
      email: 'admin@example.com',
      role: 'admin'
    };

    // Create regular user
    regularUser = {
      id: 'user-id',
      email: 'user@example.com',
      role: 'user',
      profile: {
        name: 'Regular User',
        theme: 'light'
      },
      lastLogin: new Date().toISOString()
    };

    // Create test task
    testTask = {
      id: 'test-task-id',
      userId: regularUser.id,
      title: 'Test Task',
      description: 'Test Description',
      category: 'Work',
      completed: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Initialize database
    await db.read();
    db.data.users = [adminUser, regularUser];
    db.data.tasks = [testTask];
    await db.write();

    // Generate tokens
    adminToken = jwt.sign(
      { id: adminUser.id, email: adminUser.email, role: adminUser.role },
      process.env.JWT_SECRET
    );

    userToken = jwt.sign(
      { id: regularUser.id, email: regularUser.email, role: regularUser.role },
      process.env.JWT_SECRET
    );
  });

  describe('GET /admin/users', () => {
    it('should return all users when authenticated as admin', async () => {
      const response = await request(app)
        .get('/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[1]).toMatchObject({
        id: regularUser.id,
        email: regularUser.email,
        profile: regularUser.profile,
        lastLogin: regularUser.lastLogin,
        taskCount: 1,
        completedTaskCount: 1
      });
    });

    it('should return 403 when authenticated as regular user', async () => {
      const response = await request(app)
        .get('/admin/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Access Forbidden: Admin privileges required');
    });

    it('should return 401 when no token provided', async () => {
      const response = await request(app)
        .get('/admin/users');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'No token provided');
    });
  });

  describe('GET /admin/users/:id/activity', () => {
    it('should return user activity when authenticated as admin', async () => {
      const response = await request(app)
        .get(`/admin/users/${regularUser.id}/activity`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        userId: regularUser.id,
        taskBreakdown: {
          Work: 1
        },
        completionPercentage: 1
      });
      expect(response.body.recentActivity).toHaveLength(2); // created and updated events
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/admin/users/non-existent-id/activity')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('should return 403 when authenticated as regular user', async () => {
      const response = await request(app)
        .get(`/admin/users/${regularUser.id}/activity`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Access Forbidden: Admin privileges required');
    });
  });

  describe('GET /admin/analytics', () => {
    it('should return system analytics when authenticated as admin', async () => {
      const response = await request(app)
        .get('/admin/analytics')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        totalUsers: 2,
        totalTasks: 1,
        activeTasks: 0,
        completedTasks: 1,
        completionRate: 1,
        averageTasksPerUser: 0.5,
        mostUsedCategories: ['Work']
      });
      expect(response.body).toHaveProperty('taskCompletionTrends');
    });

    it('should return 403 when authenticated as regular user', async () => {
      const response = await request(app)
        .get('/admin/analytics')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Access Forbidden: Admin privileges required');
    });

    it('should return 401 when no token provided', async () => {
      const response = await request(app)
        .get('/admin/analytics');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'No token provided');
    });
  });
}); 