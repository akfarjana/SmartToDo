const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

// Get all tasks for the authenticated user
router.get('/', verifyToken, async (req, res) => {
  try {
    const { category, priority, completed, sort_by, order } = req.query;
    
    await db.read();
    let tasks = db.data.tasks.filter(task => task.userId === req.user.id);

    // Apply filters
    if (category) {
      tasks = tasks.filter(task => task.category === category);
    }
    if (priority) {
      tasks = tasks.filter(task => task.priority === priority);
    }
    if (completed !== undefined) {
      const isCompleted = completed === 'true';
      tasks = tasks.filter(task => task.completed === isCompleted);
    }

    // Apply sorting
    if (sort_by) {
      tasks.sort((a, b) => {
        const orderMult = order === 'desc' ? -1 : 1;
        if (sort_by === 'dueDate') {
          return orderMult * (new Date(a.dueDate) - new Date(b.dueDate));
        }
        return orderMult * (a[sort_by] > b[sort_by] ? 1 : -1);
      });
    }

    res.json(tasks);
  } catch (err) {
    console.error('Tasks fetch error:', err);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Create a new task
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, dueDate, priority, category, recurring } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newTask = {
      id: uuidv4(),
      userId: req.user.id,
      title,
      description: description || '',
      dueDate: dueDate || null,
      priority: priority || 'medium',
      completed: false,
      recurring: recurring || null,
      category: category || 'default',
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.read();
    db.data.tasks.push(newTask);
    await db.write();

    res.status(201).json(newTask);
  } catch (err) {
    console.error('Task creation error:', err);
    res.status(500).json({ message: 'Error creating task' });
  }
});

// Update a task
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    await db.read();
    const taskIndex = db.data.tasks.findIndex(
      task => task.id === id && task.userId === req.user.id
    );

    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update task fields while preserving unmodified fields
    const updatedTask = {
      ...db.data.tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Preserve the original id and userId
    updatedTask.id = id;
    updatedTask.userId = req.user.id;

    db.data.tasks[taskIndex] = updatedTask;
    await db.write();

    res.json(updatedTask);
  } catch (err) {
    console.error('Task update error:', err);
    res.status(500).json({ message: 'Error updating task' });
  }
});

// Delete a task
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    await db.read();
    const taskIndex = db.data.tasks.findIndex(
      task => task.id === id && task.userId === req.user.id
    );

    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    db.data.tasks.splice(taskIndex, 1);
    await db.write();

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Task deletion error:', err);
    res.status(500).json({ message: 'Error deleting task' });
  }
});

// Add subtask to a task
router.post('/:id/subtasks', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Subtask title is required' });
    }

    await db.read();
    const task = db.data.tasks.find(
      task => task.id === id && task.userId === req.user.id
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const newSubtask = {
      id: uuidv4(),
      title,
      completed: false,
      createdAt: new Date().toISOString()
    };

    task.subtasks.push(newSubtask);
    await db.write();

    res.status(201).json(newSubtask);
  } catch (err) {
    console.error('Subtask creation error:', err);
    res.status(500).json({ message: 'Error creating subtask' });
  }
});

// Update a subtask
router.put('/subtasks/:subtaskId', verifyToken, async (req, res) => {
  try {
    const { subtaskId } = req.params;
    const { title, completed } = req.body;

    await db.read();
    let subtaskFound = false;
    let updatedSubtask = null;

    for (const task of db.data.tasks) {
      if (task.userId === req.user.id) {
        const subtaskIndex = task.subtasks.findIndex(st => st.id === subtaskId);
        if (subtaskIndex !== -1) {
          if (title !== undefined) task.subtasks[subtaskIndex].title = title;
          if (completed !== undefined) task.subtasks[subtaskIndex].completed = completed;
          subtaskFound = true;
          updatedSubtask = task.subtasks[subtaskIndex];
          break;
        }
      }
    }

    if (!subtaskFound) {
      return res.status(404).json({ message: 'Subtask not found' });
    }

    await db.write();
    res.json(updatedSubtask);
  } catch (err) {
    console.error('Subtask update error:', err);
    res.status(500).json({ message: 'Error updating subtask' });
  }
});

// Delete a subtask
router.delete('/subtasks/:subtaskId', verifyToken, async (req, res) => {
  try {
    const { subtaskId } = req.params;

    await db.read();
    let subtaskFound = false;

    for (const task of db.data.tasks) {
      if (task.userId === req.user.id) {
        const subtaskIndex = task.subtasks.findIndex(st => st.id === subtaskId);
        if (subtaskIndex !== -1) {
          task.subtasks.splice(subtaskIndex, 1);
          subtaskFound = true;
          break;
        }
      }
    }

    if (!subtaskFound) {
      return res.status(404).json({ message: 'Subtask not found' });
    }

    await db.write();
    res.json({ message: 'Subtask deleted successfully' });
  } catch (err) {
    console.error('Subtask deletion error:', err);
    res.status(500).json({ message: 'Error deleting subtask' });
  }
});

module.exports = router; 