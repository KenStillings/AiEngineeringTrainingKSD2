const Database = require('better-sqlite3');

/**
 * Initializes the database schema for the task management application.
 * Creates tasks and task_history tables.
 * 
 * @param {Database} db - SQLite database instance
 * @returns {Database} The initialized database instance
 */
function initializeSchema(db) {
  // Create tasks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      due_date TEXT,
      completed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Create task_history table for tracking changes
  db.exec(`
    CREATE TABLE IF NOT EXISTS task_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER NOT NULL,
      changed_field TEXT NOT NULL,
      old_value TEXT,
      new_value TEXT,
      changed_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
    )
  `);

  // Create index for faster history queries
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_task_history_task_id 
    ON task_history(task_id)
  `);

  return db;
}

/**
 * Creates a new in-memory database with the application schema.
 * 
 * @returns {Database} New database instance with schema initialized
 */
function createDatabase() {
  const db = new Database(':memory:');
  return initializeSchema(db);
}

/**
 * Seeds the database with initial sample tasks.
 * 
 * @param {Database} db - Database instance to seed
 */
function seedDatabase(db) {
  const insertTask = db.prepare(`
    INSERT INTO tasks (name, description, due_date, completed)
    VALUES (?, ?, ?, ?)
  `);

  const sampleTasks = [
    {
      name: 'Complete project documentation',
      description: 'Write comprehensive docs for the task management app',
      due_date: '2026-02-15',
      completed: 0
    },
    {
      name: 'Review pull requests',
      description: 'Review and merge pending PRs',
      due_date: '2026-02-01',
      completed: 0
    },
    {
      name: 'Setup CI/CD pipeline',
      description: 'Configure automated testing and deployment',
      due_date: null,
      completed: 0
    },
    {
      name: 'Buy groceries',
      description: 'Milk, eggs, bread',
      due_date: null,
      completed: 1
    }
  ];

  sampleTasks.forEach(task => {
    insertTask.run(task.name, task.description, task.due_date, task.completed);
  });

  console.log('Database seeded with sample tasks');
}

module.exports = {
  createDatabase,
  initializeSchema,
  seedDatabase
};
