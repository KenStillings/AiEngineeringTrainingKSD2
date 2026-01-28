const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

const { createDatabase, seedDatabase } = require('./database/schema');
const TaskService = require('./services/TaskService');
const { validateTaskId } = require('./utils/validation');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize database
const db = createDatabase();
seedDatabase(db);

// Initialize TaskService
const taskService = new TaskService(db);

console.log('In-memory database initialized with sample tasks');

// API Routes - Tasks

/**
 * GET /api/tasks
 * Retrieve all tasks, sorted by due date and creation date
 */
app.get('/api/tasks', (req, res) => {
  try {
    const tasks = taskService.getAllTasks();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

/**
 * GET /api/tasks/:id
 * Retrieve a single task by ID
 */
app.get('/api/tasks/:id', (req, res) => {
  try {
    const validation = validateTaskId(req.params.id);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    const task = taskService.getTaskById(validation.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

/**
 * POST /api/tasks
 * Create a new task
 */
app.post('/api/tasks', (req, res) => {
  try {
    const task = taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    
    if (error.message.includes('required') || error.message.includes('must be')) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Failed to create task' });
  }
});

/**
 * PUT /api/tasks/:id
 * Update an existing task
 */
app.put('/api/tasks/:id', (req, res) => {
  try {
    const validation = validateTaskId(req.params.id);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    const task = taskService.updateTask(validation.id, req.body);
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    
    if (error.message === 'Task not found') {
      return res.status(404).json({ error: error.message });
    }
    
    if (error.message.includes('must be')) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Failed to update task' });
  }
});

/**
 * PATCH /api/tasks/:id/complete
 * Toggle task completion status
 */
app.patch('/api/tasks/:id/complete', (req, res) => {
  try {
    const validation = validateTaskId(req.params.id);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    const task = taskService.toggleCompletion(validation.id);
    res.json(task);
  } catch (error) {
    console.error('Error toggling task completion:', error);
    
    if (error.message === 'Task not found') {
      return res.status(404).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Failed to toggle task completion' });
  }
});

/**
 * DELETE /api/tasks/:id
 * Delete a task
 */
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const validation = validateTaskId(req.params.id);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    const deleted = taskService.deleteTask(validation.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully', id: validation.id });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

/**
 * GET /api/tasks/:id/history
 * Retrieve change history for a task
 */
app.get('/api/tasks/:id/history', (req, res) => {
  try {
    const validation = validateTaskId(req.params.id);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    const history = taskService.getTaskHistory(validation.id);
    res.json(history);
  } catch (error) {
    console.error('Error fetching task history:', error);
    res.status(500).json({ error: 'Failed to fetch task history' });
  }
});

module.exports = { app, db, taskService };