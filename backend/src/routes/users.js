const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const db = require('../db');

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    await db.read();
    const user = db.data.users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data without sensitive information
    res.json({
      id: user.id,
      email: user.email,
      profile: user.profile,
      lastLogin: user.lastLogin
    });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, theme } = req.body;
    
    await db.read();
    const user = db.data.users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update profile fields
    if (name) user.profile.name = name;
    if (theme) user.profile.theme = theme;

    await db.write();
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router; 