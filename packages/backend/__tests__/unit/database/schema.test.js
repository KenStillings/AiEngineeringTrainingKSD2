const { createDatabase, initializeSchema, seedDatabase } = require('../../../src/database/schema');
const Database = require('better-sqlite3');

describe('Database Schema', () => {
  let db;

  beforeEach(() => {
    db = new Database(':memory:');
  });

  afterEach(() => {
    db.close();
  });

  describe('initializeSchema', () => {
    it('should create tasks table', () => {
      initializeSchema(db);
      
      const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'").all();
      expect(tables).toHaveLength(1);
    });

    it('should create task_history table', () => {
      initializeSchema(db);
      
      const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='task_history'").all();
      expect(tables).toHaveLength(1);
    });

    it('should create index for task_history', () => {
      initializeSchema(db);
      
      const indexes = db.prepare("SELECT name FROM sqlite_master WHERE type='index' AND name='idx_task_history_task_id'").all();
      expect(indexes).toHaveLength(1);
    });

    it('should create tasks table with correct columns', () => {
      initializeSchema(db);
      
      const columns = db.prepare("PRAGMA table_info(tasks)").all();
      const columnNames = columns.map(col => col.name);
      
      expect(columnNames).toContain('id');
      expect(columnNames).toContain('name');
      expect(columnNames).toContain('description');
      expect(columnNames).toContain('due_date');
      expect(columnNames).toContain('completed');
      expect(columnNames).toContain('created_at');
      expect(columnNames).toContain('updated_at');
    });

    it('should create task_history table with correct columns', () => {
      initializeSchema(db);
      
      const columns = db.prepare("PRAGMA table_info(task_history)").all();
      const columnNames = columns.map(col => col.name);
      
      expect(columnNames).toContain('id');
      expect(columnNames).toContain('task_id');
      expect(columnNames).toContain('changed_field');
      expect(columnNames).toContain('old_value');
      expect(columnNames).toContain('new_value');
      expect(columnNames).toContain('changed_at');
    });
  });

  describe('createDatabase', () => {
    it('should create a new database with schema initialized', () => {
      const testDb = createDatabase();
      
      const tables = testDb.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
      const tableNames = tables.map(t => t.name);
      
      expect(tableNames).toContain('tasks');
      expect(tableNames).toContain('task_history');
      
      testDb.close();
    });
  });

  describe('seedDatabase', () => {
    beforeEach(() => {
      initializeSchema(db);
    });

    it('should insert sample tasks into the database', () => {
      seedDatabase(db);
      
      const tasks = db.prepare('SELECT * FROM tasks').all();
      expect(tasks.length).toBeGreaterThan(0);
    });

    it('should insert tasks with correct structure', () => {
      seedDatabase(db);
      
      const tasks = db.prepare('SELECT * FROM tasks').all();
      tasks.forEach(task => {
        expect(task).toHaveProperty('id');
        expect(task).toHaveProperty('name');
        expect(task).toHaveProperty('description');
        expect(task).toHaveProperty('created_at');
      });
    });

    it('should insert both completed and incomplete tasks', () => {
      seedDatabase(db);
      
      const completedTasks = db.prepare('SELECT * FROM tasks WHERE completed = 1').all();
      const incompleteTasks = db.prepare('SELECT * FROM tasks WHERE completed = 0').all();
      
      expect(completedTasks.length).toBeGreaterThan(0);
      expect(incompleteTasks.length).toBeGreaterThan(0);
    });

    it('should insert tasks with and without due dates', () => {
      seedDatabase(db);
      
      const tasksWithDueDate = db.prepare('SELECT * FROM tasks WHERE due_date IS NOT NULL').all();
      const tasksWithoutDueDate = db.prepare('SELECT * FROM tasks WHERE due_date IS NULL').all();
      
      expect(tasksWithDueDate.length).toBeGreaterThan(0);
      expect(tasksWithoutDueDate.length).toBeGreaterThan(0);
    });
  });
});
