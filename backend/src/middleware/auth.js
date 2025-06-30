const jwt = require('jsonwebtoken');
const db = require('../db');

// Verify JWT token middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Check if user is admin middleware
const isAdmin = async (req, res, next) => {
  try {
    await db.read();
    const user = db.data.users.find(u => u.id === req.user.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access forbidden: Admin privileges required' });
    }
    
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Error checking admin status' });
  }
};

module.exports = {
  verifyToken,
  isAdmin
}; 