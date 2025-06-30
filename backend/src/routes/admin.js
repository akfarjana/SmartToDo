const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get all users
router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    await db.read();
    
    // Map users to remove sensitive information
    const users = db.data.users.map(user => ({
      id: user.id,
      email: user.email,
      profile: user.profile,
      lastLogin: user.lastLogin,
      taskCount: db.data.tasks.filter(t => t.userId === user.id).length,
      completedTaskCount: db.data.tasks.filter(t => t.userId === user.id && t.completed).length
    }));

    res.json(users);
  } catch (err) {
    console.error('Users fetch error:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get specific user activity
router.get('/users/:id/activity', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.read();
    const user = db.data.users.find(u => u.id === id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userTasks = db.data.tasks.filter(t => t.userId === id);
    
    // Calculate task breakdown by category
    const taskBreakdown = userTasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {});

    // Get recent activity (last 10 actions)
    const recentActivity = userTasks
      .map(task => ([
        {
          type: 'created',
          taskId: task.id,
          timestamp: task.createdAt
        },
        {
          type: 'updated',
          taskId: task.id,
          timestamp: task.updatedAt
        }
      ]))
      .flat()
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);

    // Calculate completion percentage
    const completionPercentage = userTasks.length > 0
      ? userTasks.filter(t => t.completed).length / userTasks.length
      : 0;

    res.json({
      userId: id,
      taskBreakdown,
      recentActivity,
      completionPercentage
    });
  } catch (err) {
    console.error('User activity fetch error:', err);
    res.status(500).json({ message: 'Error fetching user activity' });
  }
});

// Get system analytics
router.get('/analytics', verifyToken, isAdmin, async (req, res) => {
  try {
    await db.read();
    
    const totalUsers = db.data.users.length;
    const totalTasks = db.data.tasks.length;
    const completedTasks = db.data.tasks.filter(t => t.completed).length;
    const activeTasks = totalTasks - completedTasks;

    // Calculate task completion trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const taskCompletionTrends = db.data.tasks
      .filter(t => t.completed && new Date(t.updatedAt) > thirtyDaysAgo)
      .reduce((acc, task) => {
        const date = task.updatedAt.split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

    // Convert trends to array format
    const trends = Object.entries(taskCompletionTrends)
      .map(([date, completed]) => ({ date, completed }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate most used categories
    const categoryCount = db.data.tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {});

    const mostUsedCategories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category]) => category);

    res.json({
      totalUsers,
      totalTasks,
      activeTasks,
      completedTasks,
      completionRate: totalTasks > 0 ? completedTasks / totalTasks : 0,
      taskCompletionTrends: trends,
      averageTasksPerUser: totalUsers > 0 ? totalTasks / totalUsers : 0,
      mostUsedCategories
    });
  } catch (err) {
    console.error('Analytics fetch error:', err);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
});

module.exports = router; 