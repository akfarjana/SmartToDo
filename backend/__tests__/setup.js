const path = require('path');
const fs = require('fs').promises;
const db = require('../src/db');

// Create a test database file
const TEST_DB_PATH = path.join(__dirname, 'test.db.json');

// Setup test environment variables
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRES_IN = '1h';

// Helper to initialize test database
async function initializeTestDB() {
  const initialData = {
    users: [],
    tasks: []
  };
  await fs.writeFile(TEST_DB_PATH, JSON.stringify(initialData, null, 2));
  db.data = initialData;
}

// Before all tests
beforeAll(async () => {
  // Point database to test file
  db.filePath = TEST_DB_PATH;
  await initializeTestDB();
});

// Before each test
beforeEach(async () => {
  await initializeTestDB();
});

// After all tests
afterAll(async () => {
  try {
    await fs.unlink(TEST_DB_PATH);
  } catch (error) {
    // Ignore if file doesn't exist
  }
}); 