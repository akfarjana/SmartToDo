const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');

// Default data structure
const defaultData = {
  users: [],
  tasks: []
};

// Create database instance
const dbFile = path.join(__dirname, 'db.json');
const adapter = new JSONFile(dbFile);
const db = new Low(adapter, defaultData); // Pass default data here

// Initialize database
const initializeDb = async () => {
  try {
    await db.read();
    // If db.data is null (file doesn't exist), it will use defaultData
    db.data ||= defaultData;
    await db.write();
  } catch (err) {
    console.error('Database initialization error:', err);
    // Ensure we have data even if read fails
    db.data = defaultData;
  }
};

// Initialize database
initializeDb().catch(console.error);

module.exports = db; 