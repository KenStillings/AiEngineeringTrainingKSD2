const { getTaskSortSQL } = require('../utils/sorting');
const { sanitizeTaskData, validateTask } = require('../utils/validation');

/**
 * Service class for managing tasks and task history.
 */
class TaskService {
  /**
   * Creates a new TaskService instance.
   * 
   * @param {Database} db - SQLite database instance
   */
  constructor(db) {
    this.db = db;
  }

  /**
   * Retrieves all tasks, sorted by due date and creation date.
   * 
   * @returns {Array} Array of task objects
   */
  getAllTasks() {
    const query = `SELECT * FROM tasks ${getTaskSortSQL()}`;
    return this.db.prepare(query).all();
  }

  /**
   * Retrieves a single task by ID.
   * 
   * @param {number} id - Task ID
   * @returns {Object|null} Task object or null if not found
   */
  getTaskById(id) {
    return this.db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  }

  /**
   * Creates a new task.
   * 
   * @param {Object} taskData - Task data
   * @param {string} taskData.name - Task name
   * @param {string} [taskData.description] - Task description
   * @param {string} [taskData.due_date] - Due date in ISO format
   * @param {boolean} [taskData.completed] - Completion status
   * @returns {Object} Created task object
   * @throws {Error} If validation fails
   */
  createTask(taskData) {
    const validation = validateTask(taskData, false);
    if (!validation.isValid) {
      throw new Error(validation.errors.join('; '));
    }

    const sanitized = sanitizeTaskData(taskData);
    
    const stmt = this.db.prepare(`
      INSERT INTO tasks (name, description, due_date, completed)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
      sanitized.name,
      sanitized.description || null,
      sanitized.due_date || null,
      sanitized.completed !== undefined ? sanitized.completed : 0
    );

    return this.getTaskById(result.lastInsertRowid);
  }

  /**
   * Updates an existing task and records the changes in history.
   * 
   * @param {number} id - Task ID
   * @param {Object} updates - Fields to update
   * @returns {Object} Updated task object
   * @throws {Error} If task not found or validation fails
   */
  updateTask(id, updates) {
    const existingTask = this.getTaskById(id);
    if (!existingTask) {
      throw new Error('Task not found');
    }

    const validation = validateTask(updates, true);
    if (!validation.isValid) {
      throw new Error(validation.errors.join('; '));
    }

    const sanitized = sanitizeTaskData(updates);
    const fieldsToUpdate = [];
    const values = [];

    // Track changes for history
    const changes = [];

    if (sanitized.name !== undefined) {
      fieldsToUpdate.push('name = ?');
      values.push(sanitized.name);
      if (sanitized.name !== existingTask.name) {
        changes.push({ field: 'name', oldValue: existingTask.name, newValue: sanitized.name });
      }
    }

    if (sanitized.description !== undefined) {
      fieldsToUpdate.push('description = ?');
      values.push(sanitized.description);
      if (sanitized.description !== existingTask.description) {
        changes.push({
          field: 'description',
          oldValue: existingTask.description,
          newValue: sanitized.description
        });
      }
    }

    if (sanitized.due_date !== undefined) {
      fieldsToUpdate.push('due_date = ?');
      values.push(sanitized.due_date);
      if (sanitized.due_date !== existingTask.due_date) {
        changes.push({
          field: 'due_date',
          oldValue: existingTask.due_date,
          newValue: sanitized.due_date
        });
      }
    }

    if (sanitized.completed !== undefined) {
      fieldsToUpdate.push('completed = ?');
      values.push(sanitized.completed);
      if (sanitized.completed !== existingTask.completed) {
        changes.push({
          field: 'completed',
          oldValue: String(existingTask.completed),
          newValue: String(sanitized.completed)
        });
      }
    }

    if (fieldsToUpdate.length === 0) {
      return existingTask;
    }

    // Update updated_at timestamp
    fieldsToUpdate.push("updated_at = datetime('now')");
    values.push(id);

    const updateStmt = this.db.prepare(`
      UPDATE tasks 
      SET ${fieldsToUpdate.join(', ')}
      WHERE id = ?
    `);

    updateStmt.run(...values);

    // Record changes in history
    this.recordHistory(id, changes);

    return this.getTaskById(id);
  }

  /**
   * Toggles the completion status of a task.
   * 
   * @param {number} id - Task ID
   * @returns {Object} Updated task object
   * @throws {Error} If task not found
   */
  toggleCompletion(id) {
    const task = this.getTaskById(id);
    if (!task) {
      throw new Error('Task not found');
    }

    const newStatus = task.completed ? 0 : 1;
    return this.updateTask(id, { completed: newStatus });
  }

  /**
   * Deletes a task.
   * 
   * @param {number} id - Task ID
   * @returns {boolean} True if deleted, false if not found
   */
  deleteTask(id) {
    const stmt = this.db.prepare('DELETE FROM tasks WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  /**
   * Records changes to a task in the history table.
   * 
   * @param {number} taskId - Task ID
   * @param {Array} changes - Array of change objects
   * @private
   */
  recordHistory(taskId, changes) {
    if (changes.length === 0) return;

    const stmt = this.db.prepare(`
      INSERT INTO task_history (task_id, changed_field, old_value, new_value)
      VALUES (?, ?, ?, ?)
    `);

    changes.forEach(change => {
      stmt.run(taskId, change.field, change.oldValue, change.newValue);
    });
  }

  /**
   * Retrieves the change history for a specific task.
   * 
   * @param {number} taskId - Task ID
   * @returns {Array} Array of history entries
   */
  getTaskHistory(taskId) {
    return this.db.prepare(`
      SELECT * FROM task_history 
      WHERE task_id = ? 
      ORDER BY changed_at DESC
    `).all(taskId);
  }
}

module.exports = TaskService;
