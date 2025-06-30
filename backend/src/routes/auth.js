const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    await db.read();
    const user = db.data.users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    await db.write();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Error during login' });
  }
});

// Create initial admin user if none exists
const initializeAdmin = async () => {
  try {
    await db.read();
    const adminExists = db.data.users.some(u => u.role === 'admin');

    if (!adminExists) {
      const adminPassword = 'admin123'; // Change this in production
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      const adminUser = {
        id: uuidv4(),
        email: 'admin@smarttodo.com',
        passwordHash: hashedPassword,
        role: 'admin',
        profile: {
          name: 'Admin',
          theme: 'light'
        },
        lastLogin: null
      };

      db.data.users.push(adminUser);
      await db.write();
      console.log('Initial admin user created');
    }
  } catch (err) {
    console.error('Error creating admin user:', err);
  }
};

// Initialize admin user
initializeAdmin();

module.exports = router; 