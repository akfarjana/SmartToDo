const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

// Register new user
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    await db.read();
    
    // Check if user already exists
    if (db.data.users.some(u => u.email === email)) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: uuidv4(),
      email,
      passwordHash: hashedPassword,
      role: 'user',
      profile: {
        name,
        theme: 'light'
      },
      lastLogin: new Date().toISOString()
    };

    db.data.users.push(newUser);
    await db.write();

    res.status(201).json({ 
      message: 'User registered successfully',
      userId: newUser.id
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Error during registration' });
  }
});

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

// Reset password request
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    await db.read();
    const user = db.data.users.find(u => u.email === email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // In a real application, you would:
    // 1. Generate a reset token
    // 2. Save it to the database with an expiration
    // 3. Send an email with the reset link
    // For now, we'll just return a success message
    res.json({ message: 'Password reset link sent to email' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ message: 'Error processing password reset' });
  }
});

module.exports = router; 