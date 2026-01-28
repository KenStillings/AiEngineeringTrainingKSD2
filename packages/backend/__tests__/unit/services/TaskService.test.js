const Database = require('better-sqlite3');

const { createDatabase } = require('../../../src/database/schema');
const TaskService = require('../../../src/services/TaskService');

describe('TaskService', () => {
  let db;
  let taskService;

  beforeEach(() => {
    db = createDatabase();
    taskService = new TaskService(db);
  });

  afterEach(() => {
    db.close();
  });

  describe('createTask', () => {
    it('should create a new task with valid data', () => {
      const taskData = {
        name: 'Test Task',
        description: 'Test description',
        due_date: '2026-02-15',
        completed: 0
      };

      const task = taskService.createTask(taskData);

      expect(task).toBeDefined();
      expect(task.id).toBeDefined();
      expect(task.name).toBe('Test Task');
      expect(task.description).toBe('Test description');
      expect(task.due_date).toBe('2026-02-15');
      expect(task.completed).toBe(0);
    });

    it('should create a task with minimal data', () => {
      const taskData = {
        name: 'Minimal Task'
      };

      const task = taskService.createTask(taskData);

      expect(task).toBeDefined();
      expect(task.name).toBe('Minimal Task');
      expect(task.description).toBeNull();
      expect(task.due_date).toBeNull();
      expect(task.completed).toBe(0);
    });

    it('should throw error when task name is missing', () => {
      const taskData = {
        description: 'No name'
      };

      expect(() => taskService.createTask(taskData)).toThrow();
    });

    it('should throw error when task name is invalid', () => {
      const taskData = {
        name: ''
      };

      expect(() => taskService.createTask(taskData)).toThrow();
    });

    it('should trim whitespace from task name', () => {
      const taskData = {
        name: '  Trimmed Task  '
      };

      const task = taskService.createTask(taskData);
      expect(task.name).toBe('Trimmed Task');
    });

    it('should set created_at and updated_at timestamps', () => {
      const taskData = {
        name: 'Test Task'
      };

      const task = taskService.createTask(taskData);

      expect(task.created_at).toBeDefined();
      expect(task.updated_at).toBeDefined();
    });
  });

  describe('getAllTasks', () => {
    it('should return an empty array when no tasks exist', () => {
      const tasks = taskService.getAllTasks();
      expect(Array.isArray(tasks)).toBe(true);
      expect(tasks).toHaveLength(0);
    });

    it('should return all tasks', () => {
      taskService.createTask({ name: 'Task 1' });
      taskService.createTask({ name: 'Task 2' });
      taskService.createTask({ name: 'Task 3' });

      const tasks = taskService.getAllTasks();
      expect(tasks).toHaveLength(3);
    });

    it('should return tasks sorted by due date first', () => {
      taskService.createTask({ name: 'No due date', due_date: null });
      taskService.createTask({ name: 'Due soon', due_date: '2026-02-01' });
      taskService.createTask({ name: 'Due later', due_date: '2026-03-01' });

      const tasks = taskService.getAllTasks();

      expect(tasks[0].name).toBe('Due soon');
      expect(tasks[1].name).toBe('Due later');
      expect(tasks[2].name).toBe('No due date');
    });
  });

  describe('getTaskById', () => {
    it('should return a task by ID', () => {
      const created = taskService.createTask({ name: 'Test Task' });
      const task = taskService.getTaskById(created.id);

      expect(task).toBeDefined();
      expect(task.id).toBe(created.id);
      expect(task.name).toBe('Test Task');
    });

    it('should return null for non-existent ID', () => {
      const task = taskService.getTaskById(999);
      expect(task).toBeUndefined();
    });
  });

  describe('updateTask', () => {
    it('should update task fields', () => {
      const created = taskService.createTask({ name: 'Original Task' });
      
      const updated = taskService.updateTask(created.id, {
        name: 'Updated Task',
        description: 'New description'
      });

      expect(updated.name).toBe('Updated Task');
      expect(updated.description).toBe('New description');
    });

    it('should update updated_at timestamp', () => {
      const created = taskService.createTask({ name: 'Test Task' });
      
      const updated = taskService.updateTask(created.id, {
        description: 'Updated description'
      });

      // Verify updated_at exists and is a valid timestamp
      expect(updated.updated_at).toBeDefined();
      expect(typeof updated.updated_at).toBe('string');
    });

    it('should throw error for non-existent task', () => {
      expect(() => {
        taskService.updateTask(999, { name: 'Updated' });
      }).toThrow('Task not found');
    });

    it('should record changes in history', () => {
      const created = taskService.createTask({ name: 'Original Task' });
      
      taskService.updateTask(created.id, {
        name: 'Updated Task'
      });

      const history = taskService.getTaskHistory(created.id);
      expect(history.length).toBeGreaterThan(0);
      expect(history[0].changed_field).toBe('name');
      expect(history[0].old_value).toBe('Original Task');
      expect(history[0].new_value).toBe('Updated Task');
    });

    it('should not record history when no changes are made', () => {
      const created = taskService.createTask({ name: 'Test Task' });
      
      taskService.updateTask(created.id, {
        name: 'Test Task'
      });

      const history = taskService.getTaskHistory(created.id);
      expect(history).toHaveLength(0);
    });

    it('should allow partial updates', () => {
      const created = taskService.createTask({
        name: 'Test Task',
        description: 'Original description'
      });
      
      const updated = taskService.updateTask(created.id, {
        description: 'Updated description'
      });

      expect(updated.name).toBe('Test Task');
      expect(updated.description).toBe('Updated description');
    });

    it('should validate updated fields', () => {
      const created = taskService.createTask({ name: 'Test Task' });
      
      expect(() => {
        taskService.updateTask(created.id, {
          name: 'a'.repeat(201)
        });
      }).toThrow();
    });

    it('should record multiple field changes', () => {
      const created = taskService.createTask({
        name: 'Original',
        description: 'Original description'
      });
      
      taskService.updateTask(created.id, {
        name: 'Updated',
        description: 'Updated description'
      });

      const history = taskService.getTaskHistory(created.id);
      expect(history).toHaveLength(2);
    });
  });

  describe('toggleCompletion', () => {
    it('should toggle completion from false to true', () => {
      const created = taskService.createTask({ name: 'Test Task', completed: 0 });
      
      const toggled = taskService.toggleCompletion(created.id);
      expect(toggled.completed).toBe(1);
    });

    it('should toggle completion from true to false', () => {
      const created = taskService.createTask({ name: 'Test Task', completed: 1 });
      
      const toggled = taskService.toggleCompletion(created.id);
      expect(toggled.completed).toBe(0);
    });

    it('should throw error for non-existent task', () => {
      expect(() => {
        taskService.toggleCompletion(999);
      }).toThrow('Task not found');
    });

    it('should record completion change in history', () => {
      const created = taskService.createTask({ name: 'Test Task', completed: 0 });
      
      taskService.toggleCompletion(created.id);

      const history = taskService.getTaskHistory(created.id);
      expect(history.length).toBeGreaterThan(0);
      expect(history[0].changed_field).toBe('completed');
    });
  });

  describe('deleteTask', () => {
    it('should delete an existing task', () => {
      const created = taskService.createTask({ name: 'Test Task' });
      
      const result = taskService.deleteTask(created.id);
      expect(result).toBe(true);

      const task = taskService.getTaskById(created.id);
      expect(task).toBeUndefined();
    });

    it('should return false for non-existent task', () => {
      const result = taskService.deleteTask(999);
      expect(result).toBe(false);
    });

    it('should delete associated history when task is deleted', () => {
      const created = taskService.createTask({ name: 'Test Task' });
      taskService.updateTask(created.id, { name: 'Updated' });
      
      taskService.deleteTask(created.id);

      const history = taskService.getTaskHistory(created.id);
      expect(history).toHaveLength(0);
    });
  });

  describe('getTaskHistory', () => {
    it('should return empty array for task with no history', () => {
      const created = taskService.createTask({ name: 'Test Task' });
      
      const history = taskService.getTaskHistory(created.id);
      expect(history).toHaveLength(0);
    });

    it('should return all history fields', () => {
      const created = taskService.createTask({ name: 'Test Task' });
      taskService.updateTask(created.id, { name: 'Updated' });

      const history = taskService.getTaskHistory(created.id);
      const entry = history[0];

      expect(entry).toHaveProperty('id');
      expect(entry).toHaveProperty('task_id');
      expect(entry).toHaveProperty('changed_field');
      expect(entry).toHaveProperty('old_value');
      expect(entry).toHaveProperty('new_value');
      expect(entry).toHaveProperty('changed_at');
    });
  });
});
