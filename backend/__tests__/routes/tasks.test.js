const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const taskRoutes = require('../../src/routes/tasks');
const db = require('../../src/db');

const app = express();
app.use(express.json());
app.use('/tasks', taskRoutes);

describe('Task Routes', () => {
  let testUser;
  let authToken;
  let testTask;

  beforeEach(async () => {
    // Create test user
    testUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      role: 'user'
    };

    // Create test task
    testTask = {
      id: 'test-task-id',
      userId: testUser.id,
      title: 'Test Task',
      description: 'Test Description',
      dueDate: '2024-12-31T23:59:59Z',
      priority: 'high',
      completed: false,
      category: 'Work',
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Initialize database
    await db.read();
    db.data.users.push(testUser);
    db.data.tasks.push(testTask);
    await db.write();

    // Generate auth token
    authToken = jwt.sign(
      { id: testUser.id, email: testUser.email, role: testUser.role },
      process.env.JWT_SECRET
    );
  });

  describe('GET /tasks', () => {
    it('should return all tasks for authenticated user', async () => {
      const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject(testTask);
    });

    it('should filter tasks by category', async () => {
      const response = await request(app)
        .get('/tasks?category=Work')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].category).toBe('Work');
    });

    it('should filter tasks by priority', async () => {
      const response = await request(app)
        .get('/tasks?priority=high')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].priority).toBe('high');
    });

    it('should filter tasks by completion status', async () => {
      const response = await request(app)
        .get('/tasks?completed=false')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].completed).toBe(false);
    });
  });

  describe('POST /tasks', () => {
    it('should create a new task', async () => {
      const newTask = {
        title: 'New Task',
        description: 'New Description',
        dueDate: '2024-12-31T23:59:59Z',
        priority: 'medium',
        category: 'Personal'
      };

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newTask);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        ...newTask,
        userId: testUser.id,
        completed: false
      });

      // Verify task was created in database
      await db.read();
      const createdTask = db.data.tasks.find(t => t.title === newTask.title);
      expect(createdTask).toBeDefined();
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ description: 'No Title' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Title is required');
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update an existing task', async () => {
      const updates = {
        title: 'Updated Title',
        completed: true
      };

      const response = await request(app)
        .put(`/tasks/${testTask.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        ...testTask,
        ...updates
      });

      // Verify changes in database
      await db.read();
      const updatedTask = db.data.tasks.find(t => t.id === testTask.id);
      expect(updatedTask.title).toBe(updates.title);
      expect(updatedTask.completed).toBe(updates.completed);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .put('/tasks/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated Title' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Task not found');
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete an existing task', async () => {
      const response = await request(app)
        .delete(`/tasks/${testTask.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Task deleted successfully');

      // Verify task was deleted from database
      await db.read();
      const deletedTask = db.data.tasks.find(t => t.id === testTask.id);
      expect(deletedTask).toBeUndefined();
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .delete('/tasks/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Task not found');
    });
  });

  describe('POST /tasks/:id/subtasks', () => {
    it('should add a subtask to an existing task', async () => {
      const subtask = {
        title: 'Test Subtask'
      };

      const response = await request(app)
        .post(`/tasks/${testTask.id}/subtasks`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(subtask);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        title: subtask.title,
        completed: false
      });

      // Verify subtask was added in database
      await db.read();
      const updatedTask = db.data.tasks.find(t => t.id === testTask.id);
      expect(updatedTask.subtasks).toHaveLength(1);
      expect(updatedTask.subtasks[0].title).toBe(subtask.title);
    });

    it('should return 400 if subtask title is missing', async () => {
      const response = await request(app)
        .post(`/tasks/${testTask.id}/subtasks`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Subtask title is required');
    });
  });

  describe('PUT /tasks/subtasks/:subtaskId', () => {
    let subtaskId;

    beforeEach(async () => {
      // Add a test subtask
      const subtask = {
        id: 'test-subtask-id',
        title: 'Test Subtask',
        completed: false,
        createdAt: new Date().toISOString()
      };
      subtaskId = subtask.id;
      testTask.subtasks.push(subtask);
      await db.write();
    });

    it('should update an existing subtask', async () => {
      const updates = {
        title: 'Updated Subtask',
        completed: true
      };

      const response = await request(app)
        .put(`/tasks/subtasks/${subtaskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(updates);

      // Verify changes in database
      await db.read();
      const task = db.data.tasks.find(t => t.id === testTask.id);
      const updatedSubtask = task.subtasks.find(s => s.id === subtaskId);
      expect(updatedSubtask).toMatchObject(updates);
    });

    it('should return 404 for non-existent subtask', async () => {
      const response = await request(app)
        .put('/tasks/subtasks/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated Title' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Subtask not found');
    });
  });

  describe('DELETE /tasks/subtasks/:subtaskId', () => {
    let subtaskId;

    beforeEach(async () => {
      // Add a test subtask
      const subtask = {
        id: 'test-subtask-id',
        title: 'Test Subtask',
        completed: false,
        createdAt: new Date().toISOString()
      };
      subtaskId = subtask.id;
      testTask.subtasks.push(subtask);
      await db.write();
    });

    it('should delete an existing subtask', async () => {
      const response = await request(app)
        .delete(`/tasks/subtasks/${subtaskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Subtask deleted successfully');

      // Verify subtask was deleted from database
      await db.read();
      const task = db.data.tasks.find(t => t.id === testTask.id);
      const deletedSubtask = task.subtasks.find(s => s.id === subtaskId);
      expect(deletedSubtask).toBeUndefined();
    });

    it('should return 404 for non-existent subtask', async () => {
      const response = await request(app)
        .delete('/tasks/subtasks/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Subtask not found');
    });
  });
}); 