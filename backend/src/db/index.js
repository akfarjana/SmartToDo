const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');

// Create database instance
const dbFile = path.join(__dirname, 'db.json');
const adapter = new JSONFile(dbFile);
const db = new Low(adapter);

// Initialize with default data
const initializeDb = async () => {
  const defaultData = {
    users: [],
    tasks: []
  };

  // Load existing data or set defaults
  await db.read();
  db.data ||= defaultData;
  await db.write();
};

// Initialize database
initializeDb().catch(console.error);

module.exports = db; 